import express from 'express';
import {
  createOrder,
  captureOrder,
  getOrderDetails,
  refundPayment
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.post('/create-order', protect, createOrder);
router.post('/capture-order', protect, captureOrder);
router.get('/order/:orderId', protect, getOrderDetails);
router.post('/refund', protect, admin, refundPayment);

export default router;
