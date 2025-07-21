import express, { Request, Response } from "express";

const app = express();

app.get('/hi', (req: Request, res: Response) => {
     res.json({
          msg: 'hi from http be'
     })
})

app.listen(3001)