import express from 'express';
import { 
    authUser, registerUser, getUsers, updateUserRole, 
    logoutUser, updateUserByAdmin, deleteUser,
    toggleWishlist, getWishlist, sendOTPRequest,
    getUserProfile, updateUserProfile, uploadAvatar
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/send-otp', sendOTPRequest);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/avatar', protect, upload.single('image'), uploadAvatar);

router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:id').post(protect, toggleWishlist);

router.route('/:id/role')
    .put(protect, admin, updateUserRole);

router.route('/:id')
    .put(protect, admin, updateUserByAdmin)
    .delete(protect, admin, deleteUser);

export default router;
