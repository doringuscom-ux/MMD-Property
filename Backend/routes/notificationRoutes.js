import express from 'express';
const router = express.Router();
import { 
    getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
} from '../controllers/notificationController.js';
import { protect, subAdmin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, subAdmin, getNotifications);

router.route('/read-all')
    .put(protect, subAdmin, markAllAsRead);

router.route('/:id/read')
    .put(protect, subAdmin, markAsRead);

router.route('/:id')
    .delete(protect, subAdmin, deleteNotification);

export default router;
