import express from 'express';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor
} from '../controllers/doctor.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createDoctor);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);

export default router;
