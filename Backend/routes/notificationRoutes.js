import express from 'express';
const router = express.Router();
import { 
    getNotifications, 
    getMyNotifications,
    markAsRead, 
    markAllNotificationsRead, 
    markMyNotificationsRead,
    deleteNotification 
} from '../controllers/notificationController.js';
import { protect, subAdmin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, subAdmin, getNotifications);

router.route('/my')
    .get(protect, getMyNotifications);

router.route('/read-all')
    .put(protect, subAdmin, markAllNotificationsRead);

router.route('/my/read-all')
    .put(protect, markMyNotificationsRead);

router.route('/:id/read')
    .put(protect, subAdmin, markAsRead);

router.route('/:id')
    .delete(protect, subAdmin, deleteNotification);

export default router;
