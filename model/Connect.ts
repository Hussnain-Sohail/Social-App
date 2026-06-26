import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

async function Connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        console.log(`connected to Mongo DB`)
    }
    catch (error) {
        console.error(error);
    }
}

export default Connect