import mongoose from "mongoose";
dotenv.config();
import dotenv from 'dotenv';

const DB_URI = process.env.MONGO_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default connectDB;