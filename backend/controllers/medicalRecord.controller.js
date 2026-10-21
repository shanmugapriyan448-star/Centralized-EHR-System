import MedicalRecord from '../models/MedicalRecord.js';

/**
 * Create a new medical record
 * Route: POST /api/medical-records
 */
export const createMedicalRecord = async (req, res, next) => {
  try {
    const { patient, doctor, appointment, diagnosis, symptoms, treatment, notes, recordDate, attachments } = req.body;

    if (!patient || !doctor || !diagnosis || !symptoms || !recordDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, doctor, diagnosis, symptoms, and recordDate.'
      });
    }

    const record = await MedicalRecord.create({
      patient,
      doctor,
      appointment: appointment || null,
      diagnosis,
      symptoms,
      treatment: treatment || '',
      notes: notes || '',
      recordDate,
      attachments: attachments || []
    });

    return res.status(201).json({
      success: true,
      message: 'Medical record created successfully.',
      data: {
        record
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all medical records
 * Route: GET /api/medical-records
 */
export const getMedicalRecords = async (req, res, next) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department')
      .populate('appointment', 'appointmentDate appointmentTime reason status');

    return res.status(200).json({
      success: true,
      message: 'Medical records retrieved successfully.',
      data: {
        records
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get medical record by ID
 * Route: GET /api/medical-records/:id
 */
export const getMedicalRecordById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department')
      .populate('appointment', 'appointmentDate appointmentTime reason status');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Medical record details retrieved successfully.',
      data: {
        record
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update medical record by ID
 * Route: PUT /api/medical-records/:id
 */
export const updateMedicalRecord = async (req, res, next) => {
  try {
    let record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found.'
      });
    }

    record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Medical record updated successfully.',
      data: {
        record
      }
    });
  } catch (error) {
    next(error);
  }
};
