import Report from '../models/Report.js';

/**
 * Create a new diagnostic/laboratory report (Doctor/Admin Only)
 * Route: POST /api/reports
 */
export const createReport = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Patients are not authorized to create reports.'
      });
    }

    const {
      patient,
      doctor,
      medicalRecord,
      appointment,
      reportType,
      title,
      description,
      reportDate,
      findings,
      result,
      status,
      fileUrl,
      notes
    } = req.body;

    if (!patient || !doctor || !title || !reportType || !reportDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, doctor, title, reportType, and reportDate.'
      });
    }

    const report = await Report.create({
      patient,
      doctor,
      medicalRecord: medicalRecord || null,
      appointment: appointment || null,
      reportType,
      title,
      description: description || '',
      reportDate,
      findings: findings || '',
      result: result || '',
      status: status || 'pending',
      fileUrl: fileUrl || '',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Report created successfully.',
      data: {
        report
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reports
 * Route: GET /api/reports
 */
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department')
      .populate('medicalRecord', 'diagnosis recordDate')
      .populate('appointment', 'appointmentDate appointmentTime reason');

    return res.status(200).json({
      success: true,
      message: 'Reports retrieved successfully.',
      data: {
        reports
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single report by ID
 * Route: GET /api/reports/:id
 */
export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name email phone specialization department')
      .populate('medicalRecord', 'diagnosis recordDate')
      .populate('appointment', 'appointmentDate appointmentTime reason');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Report details retrieved successfully.',
      data: {
        report
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update report by ID (Doctor/Admin Only)
 * Route: PUT /api/reports/:id
 */
export const updateReport = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Patients are not authorized to update reports.'
      });
    }

    let report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    const allowedStatuses = ['pending', 'available', 'reviewed'];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Allowed: pending, available, reviewed.'
      });
    }

    report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Report updated successfully.',
      data: {
        report
      }
    });
  } catch (error) {
    next(error);
  }
};
