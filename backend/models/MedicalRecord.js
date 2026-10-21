import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true
    },
    symptoms: {
      type: String,
      required: [true, 'Symptoms are required'],
      trim: true
    },
    treatment: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    recordDate: {
      type: String,
      required: [true, 'Record date is required']
    },
    attachments: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
