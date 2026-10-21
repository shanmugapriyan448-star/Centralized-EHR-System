import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord
} from '../controllers/medicalRecord.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createMedicalRecord);
router.get('/', getMedicalRecords);
router.get('/:id', getMedicalRecordById);
router.put('/:id', updateMedicalRecord);

export default router;
