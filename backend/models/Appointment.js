import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: String,
      required: [true, 'Appointment date is required']
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
      default: 'scheduled'
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

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
