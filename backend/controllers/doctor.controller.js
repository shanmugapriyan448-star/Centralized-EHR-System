import Doctor from '../models/Doctor.js';

/**
 * Create a new doctor profile
 * Route: POST /api/doctors
 */
export const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      licenseNumber,
      experience,
      department,
      availability,
      user
    } = req.body;

    if (!name || !email || !phone || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and specialization.'
      });
    }

    const doctor = await Doctor.create({
      user: user || null,
      name,
      email: email.toLowerCase(),
      phone,
      specialization,
      qualification: qualification || 'MD',
      licenseNumber: licenseNumber || '',
      experience: experience || '5 Years',
      department: department || 'General Medicine',
      availability: availability || 'Mon-Fri (9AM - 5PM)'
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully.',
      data: {
        doctor
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of doctors
 * Route: GET /api/doctors
 */
export const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email role');
    return res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully.',
      data: {
        doctors
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor by ID
 * Route: GET /api/doctors/:id
 */
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email role');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor details retrieved successfully.',
      data: {
        doctor
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update doctor profile
 * Route: PUT /api/doctors/:id
 */
export const updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Doctor details updated successfully.',
      data: {
        doctor
      }
    });
  } catch (error) {
    next(error);
  }
};
