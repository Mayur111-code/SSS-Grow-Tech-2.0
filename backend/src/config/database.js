import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sss_grow_tech';
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  // eslint-disable-next-line no-console
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
