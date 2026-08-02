import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dkmaaoqqx' ,
  api_key: process.env.CLOUDINARY_API_KEY || '998883446332793' ,
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rVLTtm8wBM2OSa8v6W37753duPs' ,
  secure: true,
});

export default cloudinary;
