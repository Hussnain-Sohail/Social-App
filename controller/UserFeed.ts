import type { Request, Response } from 'express';
import User, { IUser, IPosts } from '../model/UserSchema';
import mongoose, { HydratedDocument } from 'mongoose';
import { IMetaData } from '../model/MetaDataSchema';
async function FeedFallback(user: IUser): Promise<IPosts[]> {
    let feedArray = await User.aggregate([
        {
            $match: { 'posts.0': { $exists: true } },
        }, {
            $sample: { size: 5 },
        }
    ]);

    let arrays: IPosts[][] = feedArray.map((data) => {
        return data.posts
    });

    feedArray = [];
    for (const x of arrays) {
        for (const u of x)
            feedArray.push(u);
    }
    return feedArray;
}

async function Helper(user: HydratedDocument<IUser> | null): Promise<any> {
    try {
        if (!user)
            return null;

        if (user.following.length > 0 && user.followers.length == 0) {
            await user?.populate('following');

            let followingFeed: IPosts[][] = user.following.map((data) => {
                return data.posts;
            })

            for (const x of user.following) {
                for (const y of x)
                    followingFeed.push(y);
            }
            return followingFeed;
        } else
            return null;
    }
    catch (error) {
        console.error(error);
    }
}

async function UserFeed(req: Request, res: Response): Promise<void> {
    try {
        const userId: string = req.user.userId;
        if (!userId) {
            res.status(403).json({ message: 'Invalid request', feedArray: [] });
            return;
        }
        const findUser: HydratedDocument<IUser> | null = await User.findById(userId);
        if (!findUser) {
            res.status(400).json({ message: 'Error user not found' });
            return;
        }

        let feedArray: IPosts[] = await Helper(findUser);
        if (feedArray.length === 0) {
            feedArray = await FeedFallback(findUser);
            res.json(200).json({ message: '', feedArray: feedArray })
            return;
        }

        res.json(200).json({ message: '', feedArray: feedArray })
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Inter server error' });
    }
}
export default UserFeed;