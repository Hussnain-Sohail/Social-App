import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { NextFunction } from 'express';
async function ServerSecurity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader: string | undefined = req.headers.authorization;
        if (authHeader === undefined) {
            res.status(403).json({ message: 'Missing token' });
            return;
        }
        const token: string | undefined = authHeader.split(' ')[1];
        if (token === undefined) {
            res.status(403).json({ message: 'Missing token' });
            return;
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
            (error, decoded) => {
                if (error) {
                    res.status(403).json({ message: "Access denied" });
                    return;
                }
                req.user.userId = decoded as string;
                next();
            }
        )
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}