import express, { Router } from 'express';
const userRouter: Router = express.Router();
import Signup from '../controller/Signup.ts';
import Login from '../controller/Login.ts';

userRouter.post('/signup', Signup);
userRouter.post('/login', Login);

export default userRouter;