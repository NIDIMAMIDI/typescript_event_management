import 'dotenv/config';
import express, { Request, Response, Application, NextFunction } from 'express';
import { Server } from 'http';
import indexRouter from './routes/index.routes';
import { connectToDB } from './config/connectToDB/connectToDB';

const app: Application = express();
const port: number = Number(process.env.PORT) || 7777; // Use lowercase number for type annotation
app.use(express.json());

app.use('/api', indexRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Bismillah');
});

const server: Server = app.listen(port, () => {
  console.log(`Server has started at port ${port}`);
  connectToDB();
});
