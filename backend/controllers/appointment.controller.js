import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

/**
 * Create a new appointment
 * Route: POST /api/appointments
 */
export const createAppointment = async (req, res, next) => {
  try {
    const { patient, doctor, appointmentDate, appointmentTime, reason, status, notes } = req.body;

    if (!patient || !doctor || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, doctor, appointmentDate, appointmentTime, and reason.'
      });
    }

    const appointment = await Appointment.create({
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      status: status || 'scheduled',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully.',
      data: {
        appointment
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all appointments
 * Route: GET /api/appointments
 */
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department');

    return res.status(200).json({
      success: true,
      message: 'Appointments retrieved successfully.',
      data: {
        appointments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single appointment by ID
 * Route: GET /api/appointments/:id
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment details retrieved successfully.',
      data: {
        appointment
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment details/status
 * Route: PUT /api/appointments/:id
 */
export const updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    const allowedStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Allowed: scheduled, confirmed, completed, cancelled.'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      data: {
        appointment
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete or cancel appointment by ID
 * Route: DELETE /api/appointments/:id
 */
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled/deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
