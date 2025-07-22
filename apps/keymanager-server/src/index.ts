import { keyStore1, keyStore2, keyStore3, keyStore4, keyStore5 } from '@repo/keystore-db/client'
import express, { Request, Response } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import cors from 'cors';

const app = express();

app.use(cors({
     origin: ['http://localhost:3001']
}));


app.post('/createkey',(req: Request, res: Response) => {

})

app.listen(8080);

console.log(JWT_SECRET);
