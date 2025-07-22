import { keyStore1, keyStore2, keyStore3, keyStore4, keyStore5 } from '@repo/keystore-db/client'
import express, { Request, Response } from 'express'
import { authMiddleware } from '@repo/backend-common/middleware'
import cors from 'cors';

const app = express();

app.use(cors({
     origin: ['http://localhost:3001']
}));


app.post('/createkey', authMiddleware, (req: Request, res: Response) => {
     const userId = req.userId;
     
})

app.listen(8080);
