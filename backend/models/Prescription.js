import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true
    },
    route: {
      type: String,
      default: 'Oral'
    },
    additionalInstructions: {
      type: String,
      default: ''
    }
  },
  { _id: true }
);

const prescriptionSchema = new mongoose.Schema(
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
    medications: {
      type: [medicationSchema],
      validate: [
        (val) => val && val.length > 0,
        'At least one medication is required in prescription'
      ]
    },
    instructions: {
      type: String,
      default: ''
    },
    prescriptionDate: {
      type: String,
      required: [true, 'Prescription date is required']
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

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
