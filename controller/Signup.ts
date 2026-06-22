import type { Request, Response } from 'express';
import z from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/UserSchema';

const userData = z.object({
    userName: z.string(),
    age: z.number().min(18),
    password: z.string().min(6),
});
async function Signup(req: Request, res: Response): Promise<void> {
    try {
        const validData = userData.safeParse(req.body);
        if (!validData.success) {
            res.status(400).json({ message: validData.error.issues[0].message });
            return;
        }

        const checkDuplicate = await User.findOne({ userName: validData.data.userName });
        if (checkDuplicate) {
            res.status(400).json({ message: 'Username is already taken !' });
            return;
        }

        const hashedPassword = await bcrypt.hash(validData.data.password, 10);
        const newAccount = new User({
            userName: validData.data.userName,
            age: validData.data.age,
            password: hashedPassword,
            accountCreatedOnDate: new Date().toISOString(),
        });

        await newAccount.save();
        const accessToken = jwt.sign(
            { userId: newAccount._id },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '60s' },
        );
        const refreshToken = jwt.sign(
            { userId: newAccount._id },
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

export default Signup