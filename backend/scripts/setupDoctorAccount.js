import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const setupDoctor = async () => {
  let doctorExisted = false;
  let actionTaken = '';

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/centralized_ehr';
    await mongoose.connect(mongoUri);

    const email = 'doctor@ehr.com';
    const password = 'Doctor@123';
    const name = 'Doctor User';
    const role = 'doctor';

    let doctor = await User.findOne({ email: email.toLowerCase() });

    if (doctor) {
      doctorExisted = true;
      doctor.password = password; // Triggers pre('save') Mongoose hook to hash password
      doctor.name = name;
      doctor.role = role;
      await doctor.save();
      actionTaken = 'Password reset to Doctor@123 and updated.';
    } else {
      doctorExisted = false;
      doctor = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role
      });
      actionTaken = 'Created new doctor account.';
    }

    await mongoose.connection.close();

    // Verify against running HTTP backend on port 5000
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log('RESULT_SUMMARY:', JSON.stringify({
      doctorExisted,
      actionTaken,
      httpStatus: res.status,
      success: data.success,
      message: data.message,
      user: data.data?.user
    }, null, 2));

  } catch (err) {
    console.error('Error setting up doctor account:', err);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

setupDoctor();
