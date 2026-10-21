import AuditLog from '../models/AuditLog.js';

/**
 * Get system audit logs (Admin Only)
 * Route: GET /api/audit-logs
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const { user, action, resource } = req.query;
    const filter = {};

    if (user) filter.user = user;
    if (action) filter.action = action.toUpperCase();
    if (resource) filter.resource = resource;

    const logs = await AuditLog.find(filter)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully.',
      data: {
        logs
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single audit log entry by ID (Admin Only)
 * Route: GET /api/audit-logs/:id
 */
export const getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('user', 'name email role');
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Audit log entry not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Audit log entry details retrieved successfully.',
      data: {
        log
      }
    });
  } catch (error) {
    next(error);
  }
};
