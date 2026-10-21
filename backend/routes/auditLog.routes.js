import express from 'express';
import { getAuditLogs, getAuditLogById } from '../controllers/auditLog.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Apply authentication and Admin role enforcement to all audit log endpoints
router.use(protect);
router.use(requireRole('admin'));

router.get('/', getAuditLogs);
router.get('/:id', getAuditLogById);

export default router;
