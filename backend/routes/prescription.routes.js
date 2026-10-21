import express from 'express';
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription
} from '../controllers/prescription.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createPrescription);
router.get('/', getPrescriptions);
router.get('/:id', getPrescriptionById);
router.put('/:id', updatePrescription);

export default router;
