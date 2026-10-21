import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReport
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);

export default router;
