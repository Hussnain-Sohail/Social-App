import mongoose, { Model } from 'mongoose';
interface IMetaData {
    userName: string,
    userID: string,
    profilePic: string,
};
const MetaDataScema = new mongoose.Schema({
    userName: String,
    userID: String,
    profilePic: String,
});

export type { IMetaData }
export default mongoose.model<IMetaData>('MetaData', MetaDataScema);