import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import patientRoutes from './routes/patient.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import medicalRecordRoutes from './routes/medicalRecord.routes.js';
import prescriptionRoutes from './routes/prescription.routes.js';
import reportRoutes from './routes/report.routes.js';
import auditLogRoutes from './routes/auditLog.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middleware
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// 404 and Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
