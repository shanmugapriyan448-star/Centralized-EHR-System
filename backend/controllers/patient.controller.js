import Patient from '../models/Patient.js';

/**
 * Create a new patient record
 * Route: POST /api/patients
 */
export const createPatient = async (req, res, next) => {
  try {
    const { name, email, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact, user } = req.body;

    if (!name || !email || !phone || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and dateOfBirth.'
      });
    }

    const patient = await Patient.create({
      user: user || null,
      name,
      email: email.toLowerCase(),
      phone,
      dateOfBirth,
      gender: gender || 'Other',
      bloodGroup: bloodGroup || 'O+',
      address: address || '',
      emergencyContact: emergencyContact || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Patient profile created successfully.',
      data: {
        patient
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of patients
 * Route: GET /api/patients
 */
export const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().populate('user', 'name email role');
    return res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully.',
      data: {
        patients
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient by ID
 * Route: GET /api/patients/:id
 */
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email role');
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient details retrieved successfully.',
      data: {
        patient
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update patient record
 * Route: PUT /api/patients/:id
 */
export const updatePatient = async (req, res, next) => {
  try {
    let patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Patient details updated successfully.',
      data: {
        patient
      }
    });
  } catch (error) {
    next(error);
  }
};
