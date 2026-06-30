import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

async function NewAccessTokenProvider(req: Request, res: Response): Promise<void> {
    try {
        const refreshToken: string | null = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(403).json({ message: 'Access Denied', accessToken: '' });
            return;
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!,
            (error, decoded) => {
                if (error) {
                    res.status(403).json({ message: 'Access Denied', accessToken: '' });
                    return;
                }
                req.user.userId = decoded as string;
            }
        );
        const newAccessToken = jwt.sign(
            { userId: req.user.userId },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '60s' }
        );
        res.status(200).json({ message: '', accessToken: newAccessToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}