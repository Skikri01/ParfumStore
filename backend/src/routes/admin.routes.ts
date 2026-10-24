import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../controllers/order.controller.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt, requireAdmin);

// GET /api/admin/analytics
router.get('/analytics', getAnalytics);

// GET /api/admin/orders
router.get('/orders', getAllOrdersAdmin);

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', updateOrderStatusAdmin);

export default router;
