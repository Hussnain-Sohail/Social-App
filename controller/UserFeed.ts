import type { Request, Response } from 'express';
import User, { IUser, IPosts } from '../model/UserSchema';
import mongoose from 'mongoose';
async function FeedCallback(user: IUser): Promise<IPosts[]> {
    let feedArray = await User.aggregate([
        {
            $match: { 'posts.0': { $exists: true } },
        }, {
            $sample: { size: 5 },
        }
    ]);

    return feedArray;
}

async function Helper(user: IUser, category: string): Promise<string[]> { }
async function UserFeed(req: Request, res: Response): Promise<void> {
    try {
        const userId: string = req.user.userId;
        if (!userId) {
            res.status(403).json({ message: 'Invalid request', feedArray: [] });
            return;
        }

        const findUser = await User.findById(userId);

        if (!findUser) {
            res.status(403).json({ message: 'Invalid request', feedArray: [] });
            return;
        } else if (findUser.followers.length === 0 && findUser.following.length === 0) {
            res.status(200).json({ message: '', feedArray: await FeedCallback(findUser) });
            return;
        } else if (findUser.following.length > 0 && findUser.followers.length)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Inter server error' });
    }
}
export default UserFeed;