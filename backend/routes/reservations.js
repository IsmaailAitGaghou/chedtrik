import express from 'express';
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
  deleteReservation,
  confirmReservation,
  getReservationStats
} from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.post('/', protect, createReservation);
router.get('/', protect, getReservations);
router.get('/stats', protect, admin, getReservationStats);
router.get('/:id', protect, getReservationById);
router.put('/:id', protect, updateReservation);
router.patch('/:id/cancel', protect, cancelReservation);
router.patch('/:id/confirm', protect, confirmReservation);
router.delete('/:id', protect, admin, deleteReservation);

export default router;
