import express from 'express';
import { getUsers, getUserById, deleteUser } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

// GET /api/users (Admin Only)
router.get('/', protect, requireRole('admin'), getUsers);

// GET /api/users/:id (Protected)
router.get('/:id', protect, getUserById);

// DELETE /api/users/:id (Admin Only)
router.delete('/:id', protect, requireRole('admin'), deleteUser);

export default router;
