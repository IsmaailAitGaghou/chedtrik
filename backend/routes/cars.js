import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarTypes,
  getCarBrands
} from '../controllers/carController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Routes publiques
router.get('/', getCars);
router.get('/types', getCarTypes);
router.get('/brands', getCarBrands);
router.get('/:id', getCarById);

// Routes protégées admin
router.post('/', protect, admin, createCar);
router.put('/:id', protect, admin, updateCar);
router.delete('/:id', protect, admin, deleteCar);

export default router;
