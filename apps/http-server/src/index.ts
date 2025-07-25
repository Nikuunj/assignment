import express, { Request, Response } from 'express'
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import { prismaClient } from '@repo/db/client';
import axios from 'axios';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';

const app = express();

app.use(cors({
     origin: ['http:localhost:3000']
}))
app.use(express.json());

app.post('/signup', async (req: Request, res: Response) => {
     const { email, password } = req.body;

     try {

          const hashPass = bcrypt.hashSync(password, 5);
          await prismaClient.user.create({
               data: {
                    email,
                    password: hashPass
               }
          })

          res.json({
               msg: 'user create'
          })
     } catch(e) {
          res.status(422).json({
               msg: "user aleady exist"
          })
     }
})

app.post('/login', async (req: Request, res: Response) => {
     const { email, password } = req.body;

     try {
          const user = await prismaClient.user.findFirst({
               where: {
                    email
               }
          })


          if(!user) {
               res.status(404).json({
                    msg: 'user not found'
               })    
               return 
          }

          const match = bcrypt.compareSync(password, user.password);
          if(!match) {
               res.status(403).json({
                    massege: 'Not Authorized'
               })
               return;
          }

          const token = jwt.sign({
               userId : user.id
          }, JWT_SECRET);

          res.json({
               token : `Bearer ${token}`
          })
          return
     } catch(e) {
          res.status(404).json({
               msg: 'user not found'
          })
          return
     }
})

app.get('/hi', async (req: Request, res: Response) => {
     const { data } = await axios.get('http:localhost:8080/hi')

     res.json({
          msg: 'from http server',
          data
     })
})
app.post('/createwallet', authMiddleware, async (req: Request, res: Response) => {
     const tokenStr = req.headers.authorization ?? "" ;
     try {
          
          const { data } = await axios.post('http:localhost:8080/createkey', {}, {
               headers: {
                    'Authorization': tokenStr
               }
          })

          res.json({
               solAddress: data?.solAddress?.encodedPub,
               akashAddress: data?.akashAddress?.akashAddress
          })
          
     } catch(e) {
          res.status(500).json({
               msg: 'somthing wrong'
          })
     }
})


app.get('/getpulickey', authMiddleware, async (req: Request, res: Response) => {
     const userId = req.userId;

     if(!userId) {
          res.status(404).json({
               msg: "user not authenticated"
          })
     }


     const publicKeyAkash = await prismaClient.akashPublicKey.findMany({
          where: {
               userId
          }
     })

     const publicKeySol = await prismaClient.solPublickey.findMany({
          where: {
               userId
          }
     })

     res.json({
          akashAddress: publicKeyAkash,
          solAddress: publicKeySol
     })
})

app.post('/create-deployement', authMiddleware, async (req: Request, res: Response) => {

     const { publickeyObj, cloudname } = req.body;
     // if akash the akash address and public key both other wirse only public key

     const tokenStr = req.headers.authorization ?? "" ;
     
     try {
          
          const response = await axios.post(`http:localhost:8080/${cloudname}/create-deployment`, publickeyObj , {
               headers: {
                    'Authorization': tokenStr
               }
          })

          
           res.json({
               data: response.data
          });
          
     } catch(e) {
          res.status(500).json({
               msg: 'Something went wrong',
               // @ts-ignore
               error: e.message || e.toString()
          });
     }
})

app.listen(3001);