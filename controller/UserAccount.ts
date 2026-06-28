import client from '../server/RedisClientProivder.ts';
import User, { IUser } from '../model/UserSchema.ts';
import type { Request, Response } from 'express';
import IUseer from '../model/UserSchema.ts'

async function AccountInformation(req: Request, res: Response) {
    try {
        const userId = req.user.userId;
        const key: string = `user${userId}`;

        const cachedUser: string | null = await client.get(key);

        if (cachedUser !== null) {
            const user: IUser = JSON.parse(cachedUser);
            res.status(200).json({ message: '', user: user });
            return;
        }

        const findUser: IUser | null = await User.findById(userId);
        if (!findUser) {
            res.status(400).json({ message: 'Could not find account information' });
            return;
        }

        await client.set(key, JSON.stringify(findUser), { NX: true, EX: 60 });

        res.status(200).json({ message: '', user: findUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default AccountInformation;