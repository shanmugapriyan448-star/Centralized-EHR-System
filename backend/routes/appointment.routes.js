import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all appointment routes
router.use(protect);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
