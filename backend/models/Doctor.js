import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide doctor email'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide doctor phone number'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      trim: true
    },
    qualification: {
      type: String,
      default: 'MD'
    },
    licenseNumber: {
      type: String,
      default: ''
    },
    experience: {
      type: String,
      default: '5 Years'
    },
    department: {
      type: String,
      default: 'General Medicine'
    },
    availability: {
      type: String,
      default: 'Mon-Fri (9AM - 5PM)'
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
