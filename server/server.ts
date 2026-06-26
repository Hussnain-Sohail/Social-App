import express from 'express';
import cookiePraser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import client from './RedisClientProivder.ts';
import Connect from '../model/Connect.ts'
import userRouter from '../routes/UserRouter.ts';
const App = express();

Connect();
await client.connect();

App.use('/', userRouter);

App.listen(process.env.PORT, () => { console.log('App is running') })