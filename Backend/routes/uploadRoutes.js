import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../utils/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';
import fs from 'fs';

const router = express.Router();

// @desc    Upload any image to Cloudinary
// @route   POST /api/upload
router.post('/', protect, upload.single('image'), async (req, res) => {
    if (process.env.WORKING_STATUS !== 'done') {
        return res.status(403).json({ message: 'Image upload is temporarily disabled.' });
    }
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'mmd_properties',
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        res.json({
            url: result.secure_url
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
