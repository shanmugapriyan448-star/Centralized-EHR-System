import Prescription from '../models/Prescription.js';

/**
 * Create a new prescription (Doctor/Admin Only)
 * Route: POST /api/prescriptions
 */
export const createPrescription = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Patients are not authorized to create prescriptions.'
      });
    }

    const {
      patient,
      doctor,
      medicalRecord,
      appointment,
      medications,
      instructions,
      prescriptionDate,
      notes
    } = req.body;

    if (!patient || !doctor || !prescriptionDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, doctor, and prescriptionDate.'
      });
    }

    if (!Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one medication is required.'
      });
    }

    for (const med of medications) {
      if (!med.medicineName || !med.dosage || !med.frequency || !med.duration) {
        return res.status(400).json({
          success: false,
          message: 'Each medication must include medicineName, dosage, frequency, and duration.'
        });
      }
    }

    const prescription = await Prescription.create({
      patient,
      doctor,
      medicalRecord: medicalRecord || null,
      appointment: appointment || null,
      medications,
      instructions: instructions || '',
      prescriptionDate,
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Prescription created successfully.',
      data: {
        prescription
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all prescriptions
 * Route: GET /api/prescriptions
 */
export const getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department')
      .populate('medicalRecord', 'diagnosis recordDate')
      .populate('appointment', 'appointmentDate appointmentTime reason');

    return res.status(200).json({
      success: true,
      message: 'Prescriptions retrieved successfully.',
      data: {
        prescriptions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single prescription by ID
 * Route: GET /api/prescriptions/:id
 */
export const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department')
      .populate('medicalRecord', 'diagnosis recordDate')
      .populate('appointment', 'appointmentDate appointmentTime reason');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prescription details retrieved successfully.',
      data: {
        prescription
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update prescription by ID (Doctor/Admin Only)
 * Route: PUT /api/prescriptions/:id
 */
export const updatePrescription = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Patients are not authorized to update prescriptions.'
      });
    }

    let prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found.'
      });
    }

    prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Prescription updated successfully.',
      data: {
        prescription
      }
    });
  } catch (error) {
    next(error);
  }
};
