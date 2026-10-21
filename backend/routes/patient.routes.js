import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient
} from '../controllers/patient.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);

export default router;
