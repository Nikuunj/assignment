import express, { Request, Response } from 'express'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { prismaClient } from '@repo/db/client'
import cors from 'cors';
import { deriveAkashAddress, deriveSolAddress } from './function/keygen';
import { authMiddleware } from './middleware/authMiddleware';
import { createDeploymentWithKey } from './function/createAkashDeployment';
import { getPrivateKey } from './function/getPrivateKey';
import { createNosanaDeployment } from './function/createNosanaDeployment';


const app = express();
app.use(express.json())

app.use(cors({
     origin: ['http://localhost:3001']
}));

app.get('/hi',async (req: Request, res: Response) => {
     res.json({
          msg :'hi from key manager server'
     })
})
app.post('/createkey', authMiddleware, async (req: Request, res: Response) => {
     const userId = req.userId;
     const memonics = generateMnemonic()
     const memoSeed = mnemonicToSeedSync(memonics);

     const publicKeySol = await deriveSolAddress(memoSeed);
     
     const publicAkash = await deriveAkashAddress(memoSeed);


     if(!userId) {
          res.json({
               msg: 'user id not found'
          })
          return;
     }
     try {
          await prismaClient.solPublickey.create({
               data: {
                    userId: userId,
                    pubkey: publicKeySol.encodedPub
               }
          })
          
          await prismaClient.akashPublicKey.create({
               data: {
                    userId: userId,
                    pubkey: publicAkash.encodedPub,
                    address: publicAkash.akashAddress
               }
          })
     } catch (e) {
          console.error(e);
     }
     res.json({
          solAddress: publicKeySol,
          akashAddress: publicAkash
     })
})

app.post("/akash/create-deployment", authMiddleware, async (req: Request, res: Response) => {
     try {
          const { akashAccountAddress, publicKey } = req.body;

          console.log(req.body);
          

          if (!akashAccountAddress || !publicKey) {
               return res.status(400).json({ error: "akashAccountAddress are required" });
          }

          const privateKey = await getPrivateKey(publicKey);
          if(!privateKey) {
               return  res.status(404).json({
                    msg: 'private key not found'
               })
          }
          const hexPrivateKey = Buffer.from(privateKey).toString('hex');

                         // give privatekey of account it make it by usnig combine 5 of 3 key

          console.log(hexPrivateKey);
                         
          const result = await createDeploymentWithKey(hexPrivateKey);
          res.json({ result });
     } catch (err: any) {
          res.status(500).json({ err });
     }
});

app.post("/nosana/create-deployment", authMiddleware, async (req: Request, res: Response) => {
     try {
          const { publicKey } = req.body;

          console.log(req.body);
          

          if (!publicKey) {
               return res.status(400).json({ error: "public key are required" });
          }

          const privateKey = await getPrivateKey(publicKey);
          if(!privateKey) {
               return  res.status(404).json({
                    msg: 'private key not found'
               })
          }

          const bs58 = (await import('bs58')).default;

          const strPrivateKey = bs58.encode(privateKey)
          const response = await createNosanaDeployment('4G8erjLdFL6DLhnfsq2522A46TC4HfUQwCpRZr23s5QPFTjkABzDWKTuyVKhXKhPsbJifxwsTvUgT9zDhZyRLnp9');
          console.log(response);
          
          res.json({
               response
          })
          
     } catch (err: any) {
          res.status(500).json({ err });
     }
})


app.listen(8080);

