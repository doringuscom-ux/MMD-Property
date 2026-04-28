import express from 'express';
const router = express.Router();
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController.js';

router.route('/')
    .get(getLocations)
    .post(createLocation);

router.route('/:id')
    .put(updateLocation)
    .delete(deleteLocation);

export default router;
