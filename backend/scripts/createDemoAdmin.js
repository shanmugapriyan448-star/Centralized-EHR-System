import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createDemoAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/centralized_ehr';
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');

    const adminEmail = 'admin@ehr.com';
    const adminPassword = 'Admin@123';
    const adminName = 'EHR Administrator';
    const adminRole = 'admin';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    
    if (existingAdmin) {
      console.log(`STATUS: Admin user ${adminEmail} already exists. No duplicate created.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Creating user triggers the Mongoose pre('save') hook to hash password with bcryptjs
    const newAdmin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: adminRole
    });

    console.log(`SUCCESS: Admin account created successfully with ID: ${newAdmin._id}`);
    
    // Verification check
    const verifyUser = await User.findOne({ email: adminEmail.toLowerCase() }).select('+password');
    const isPasswordValid = await verifyUser.matchPassword(adminPassword);

    if (verifyUser && isPasswordValid) {
      console.log('VERIFICATION: Admin user verification PASSED. Credentials and password match test succeeded.');
    } else {
      console.error('VERIFICATION: Admin user verification FAILED.');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo admin account:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

createDemoAdmin();
