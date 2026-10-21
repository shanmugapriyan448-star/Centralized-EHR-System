import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    name: {
      type: String,
      required: [true, 'Please provide patient name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide patient email'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide patient phone number'],
      trim: true
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Please provide date of birth']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other'
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      default: 'O+'
    },
    address: {
      type: String,
      default: ''
    },
    emergencyContact: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
