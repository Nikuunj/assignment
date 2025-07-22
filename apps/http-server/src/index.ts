import express, { Request, Response } from 'express'
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';
import axios from 'axios';

const app = express();

app.use(cors({
     origin: ['http:localhost:3000']
}))

app.post('/signup', async (req: Request, res: Response) => {
     
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

app.listen(3001);