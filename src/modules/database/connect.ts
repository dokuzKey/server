import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    console.log('📰 Attempting to connect to the database...');
    await mongoose.connect(process.env.MONGO_URI as string);
    return console.log('📰 Successfully connected to the database!');
  } catch (err: any) {
    console.log('❌ Failed to connect to the database!');
    return console.log(err.message);
  }
};

export default connectDB;
