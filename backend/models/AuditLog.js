import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userRole: {
      type: String,
      default: 'guest'
    },
    action: {
      type: String,
      required: [true, 'Action type is required'],
      enum: ['LOGIN', 'REGISTER', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
      uppercase: true
    },
    resource: {
      type: String,
      required: [true, 'Resource target is required'],
      trim: true
    },
    resourceId: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Add index for fast querying by action, resource, and creation date
auditLogSchema.index({ action: 1, resource: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
