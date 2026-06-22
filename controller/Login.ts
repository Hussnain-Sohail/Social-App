import type { Request, Response } from 'express';
import z from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import client from '../server/RedisClientProivder.ts';
import User from '../model/UserSchema';

const userData = z.object({
    userName: z.string(),
    password: z.string().min(6),
});
async function Login(req: Request, res: Response): Promise<void> {
    try {
        const validData = userData.safeParse(req.body);
        if (!validData.success) {
            res.status(400).json({ message: validData.error.issues[0].message });
            return;
        }
        const key = `user/${validData.data.userName}`;

        const totalAttempts: number = Number(await client.get(key));
        if (totalAttempts >= 3) {
            res.status(400).json({ message: 'To many attempts. Request block. Please wait 30 seconds to try again' });
            return;
        }

        await client.set(key, 0, { NX: true, EX: 30 });

        const findUser = await User.findOne({ userName: validData.data.userName });
        if (!findUser) {
            res.status(400).json({ message: 'Username not found' });
            return;
        }
        const checkPassword = await bcrypt.compare(validData.data.password, findUser.password);
        if (!checkPassword) {
            await client.incr(key);
            res.status(403).json({ message: 'Invalid password' });
            return;
        }
        const accessToken = jwt.sign(
            { userId: findUser._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '60s' },
        );
        const refreshToken = jwt.sign(
            { userId: findUser._id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '5m' },
        );

        res.cookie('RefreshToken', refreshToken, { httpOnly: true, maxAge: 5 * 60 * 60 });
        res.status(200).json({ message: 'Account created' })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Inter server error' });
    }
}

export default Login