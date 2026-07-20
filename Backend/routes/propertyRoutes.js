import express from 'express';
const router = express.Router();
import { 
    getProperties, 
    getPropertyById, 
    createProperty,
    updateProperty,
    deleteProperty,
    bulkUpdateProperties,
    bulkDeleteProperties,
    updatePropertyStatusQuick,
    requestLocationFromUser,
    updateMapLink
} from '../controllers/propertyController.js';

import { protect, admin, subAdmin, optionalProtect } from '../middleware/authMiddleware.js';

router.route('/')
    .get(optionalProtect, getProperties)
    .post(protect, createProperty); // Users can post but stay unverified

router.route('/bulk/update').put(protect, subAdmin, bulkUpdateProperties);
router.route('/bulk/delete').post(protect, subAdmin, bulkDeleteProperties);

router.route('/:id')
    .get(optionalProtect, getPropertyById)
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

router.route('/:id/status').put(protect, updatePropertyStatusQuick);
router.route('/:id/request-location').post(protect, subAdmin, requestLocationFromUser);
router.route('/:id/map-link').put(protect, updateMapLink);

export default router;
