import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  getMyEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protect, subAdmin, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(optionalProtect, createEnquiry)
  .get(protect, subAdmin, getEnquiries);

router.get('/my', protect, getMyEnquiries);

router.route('/:id')
  .put(protect, subAdmin, updateEnquiryStatus)
  .delete(protect, subAdmin, deleteEnquiry);

export default router;
