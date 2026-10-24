import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only protected routes
router.post('/', authenticateJwt, requireAdmin, createProduct);
router.put('/:id', authenticateJwt, requireAdmin, updateProduct);
router.delete('/:id', authenticateJwt, requireAdmin, deleteProduct);

export default router;
