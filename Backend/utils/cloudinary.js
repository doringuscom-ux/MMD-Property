import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drx_placeholder',
    api_key: process.env.CLOUDINARY_API_KEY || 'key_placeholder',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'secret_placeholder'
});

export default cloudinary;
