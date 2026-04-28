import express from 'express';
import { authUser, registerUser, getUsers, updateUserRole, logoutUser, updateUserByAdmin, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

router.post('/login', authUser);
router.post('/logout', logoutUser);

router.route('/:id/role')
    .put(protect, admin, updateUserRole);

router.route('/:id')
    .put(protect, admin, updateUserByAdmin)
    .delete(protect, admin, deleteUser);

export default router;
