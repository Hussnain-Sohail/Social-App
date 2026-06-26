import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
    url: process.env.REDIS_URI!
});

export default client;