import express, { Request, Response } from 'express'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { prismaClient } from '@repo/db/client'
import cors from 'cors';
import { deriveAkashAddress, deriveSolAddress } from './function/keygen';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();

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

app.listen(8080);

