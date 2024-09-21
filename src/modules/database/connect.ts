import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI as string);
    console.log('Database connection success!');
  } catch (err: any) {
    console.error(err.message);
  }
};

export default connectDB;
