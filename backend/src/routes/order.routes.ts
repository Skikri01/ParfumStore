import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from '../controllers/order.controller.js';
import { authenticateJwt, optionalAuthenticateJwt, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Order creation allows both guest and authenticated customers
router.post('/', optionalAuthenticateJwt, createOrder);
router.get('/', authenticateJwt, getUserOrders);

// Admin routes
router.get('/admin/all', authenticateJwt, requireAdmin, getAllOrdersAdmin);
router.put('/admin/:id/status', authenticateJwt, requireAdmin, updateOrderStatusAdmin);

export default router;
