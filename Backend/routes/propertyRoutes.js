import express from 'express';
const router = express.Router();
import { 
    getProperties, 
    getPropertyById, 
    createProperty,
    updateProperty,
    deleteProperty,
    bulkUpdateProperties,
    bulkDeleteProperties
} from '../controllers/propertyController.js';

import { protect, admin, subAdmin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(getProperties)
    .post(protect, createProperty); // Users can post but stay unverified

router.route('/bulk/update').put(protect, subAdmin, bulkUpdateProperties);
router.route('/bulk/delete').post(protect, subAdmin, bulkDeleteProperties);

router.route('/:id')
    .get(getPropertyById)
    .put(protect, subAdmin, updateProperty)
    .delete(protect, subAdmin, deleteProperty);

export default router;
