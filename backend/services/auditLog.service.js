import AuditLog from '../models/AuditLog.js';

/**
 * Audit Logging Helper Service
 * Safely creates audit log entries in the background
 */
export const createAuditLog = async ({
  user = null,
  userRole = 'guest',
  action,
  resource,
  resourceId = '',
  description = '',
  ipAddress = ''
}) => {
  try {
    // Only attempt DB insert if DB connection is active
    if (AuditLog.db && AuditLog.db.readyState === 1) {
      await AuditLog.create({
        user: user || null,
        userRole,
        action,
        resource,
        resourceId,
        description,
        ipAddress
      });
    }
  } catch (error) {
    // Silently log error in console so main API response is not disrupted
    console.error('[AUDIT LOG SERVICE ERROR]:', error.message);
  }
};
