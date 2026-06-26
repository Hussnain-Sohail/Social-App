import mongoose from 'mongoose';
import { Types } from 'mongoose';
import MetaData from './MetaDataSchema.ts';
import type { IMetaData } from './MetaDataSchema.ts';

interface IPosts {
    imageURL: string,
    imagePublicID: string,
    likes: number,
    unlikes: number,
}
interface IUser {
    userName: string,
    age: number,
    password: string,
    profilePic: string,
    posts: [],
    followers: Types.ObjectId[],
    following: Types.ObjectId[],

};
const UserSchema = new mongoose.Schema({
    userName: String,
    age: Number,
    password: String,
    profilePic: String,
    posts: {
        type: [
            {
                imageURL: String,
                imagePublicID: String,
                likes: Number,
                unlikes: Number,
            }
        ], default: [],
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    accountCreatedOnDate: String,
});

export type { IUser, IPosts };
export default mongoose.model<IUser>('User', UserSchema);