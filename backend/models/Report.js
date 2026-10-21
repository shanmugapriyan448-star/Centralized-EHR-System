import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required']
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required']
    },
    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord',
      required: false
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false
    },
    reportType: {
      type: String,
      required: [true, 'Report type is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    reportDate: {
      type: String,
      required: [true, 'Report date is required']
    },
    findings: {
      type: String,
      default: ''
    },
    result: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'available', 'reviewed'],
      default: 'pending'
    },
    fileUrl: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
