import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupPatient = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/centralized_ehr';
    await mongoose.connect(mongoUri);

    const email = 'patient@ehr.com';
    const password = 'Patient@123';
    const name = 'Patient User';
    const role = 'patient';

    let patient = await User.findOne({ email: email.toLowerCase() });

    if (patient) {
      patient.password = password;
      patient.name = name;
      patient.role = role;
      await patient.save();
    } else {
      patient = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role
      });
    }

    await mongoose.connection.close();

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('PATIENT_LOGIN_TEST:', data.success ? 'PASSED' : 'FAILED');
  } catch (err) {
    console.error('Error setting up patient account:', err);
    process.exit(1);
  }
};

setupPatient();
