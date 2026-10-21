export const mockUsers = [
  { id: 'usr-1', name: 'System Administrator', email: 'admin@ehr.com', role: 'admin' },
  { id: 'usr-2', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@ehr.com', role: 'doctor' },
  { id: 'usr-3', name: 'Dr. Robert Chen', email: 'robert.chen@ehr.com', role: 'doctor' },
  { id: 'usr-4', name: 'John Doe', email: 'john.doe@patient.com', role: 'patient' },
  { id: 'usr-5', name: 'Emily Watson', email: 'emily.watson@patient.com', role: 'patient' }
];

export const mockPatients = [
  {
    id: 'pat-1',
    userId: 'usr-4',
    name: 'John Doe',
    dateOfBirth: '1988-05-14',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Springfield',
    medicalHistory: 'Hypertension, Mild Asthma'
  },
  {
    id: 'pat-2',
    userId: 'usr-5',
    name: 'Emily Watson',
    dateOfBirth: '1995-11-20',
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+1 (555) 876-5432',
    address: '104 Oakridge Lane, Metropolis',
    medicalHistory: 'Penicillin Allergy'
  }
];

export const mockDoctors = [
  {
    id: 'doc-1',
    userId: 'usr-2',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    department: 'Cardiovascular Care',
    phone: '+1 (555) 901-2345',
    experience: '12 Years'
  },
  {
    id: 'doc-2',
    userId: 'usr-3',
    name: 'Dr. Robert Chen',
    specialization: 'Neurology',
    department: 'Neurosciences',
    phone: '+1 (555) 345-6789',
    experience: '9 Years'
  }
];

export const mockAppointments = [
  {
    id: 'apt-101',
    patientId: 'pat-1',
    patientName: 'John Doe',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-10-02',
    time: '10:00 AM',
    reason: 'Routine Cardiac Checkup',
    status: 'confirmed'
  },
  {
    id: 'apt-102',
    patientId: 'pat-2',
    patientName: 'Emily Watson',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Chen',
    date: '2026-10-03',
    time: '02:30 PM',
    reason: 'Migraine Consultation',
    status: 'pending'
  },
  {
    id: 'apt-103',
    patientId: 'pat-1',
    patientName: 'John Doe',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Chen',
    date: '2026-09-20',
    time: '11:15 AM',
    reason: 'Dizziness and Fatigue Evaluation',
    status: 'completed'
  }
];

export const mockMedicalRecords = [
  {
    id: 'rec-501',
    patientId: 'pat-1',
    patientName: 'John Doe',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    symptoms: 'Mild chest tightness after exercise',
    diagnosis: 'Stage 1 Essential Hypertension',
    notes: 'Patient advised to monitor BP daily and reduce sodium intake.',
    date: '2026-09-15'
  },
  {
    id: 'rec-502',
    patientId: 'pat-2',
    patientName: 'Emily Watson',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Chen',
    symptoms: 'Throbbing headache on left side, light sensitivity',
    diagnosis: 'Episodic Migraine without Aura',
    notes: 'Prescribed prophylactic treatment and trigger avoidance log.',
    date: '2026-09-18'
  }
];

export const mockPrescriptions = [
  {
    id: 'rx-801',
    patientId: 'pat-1',
    patientName: 'John Doe',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    medicines: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once Daily', duration: '30 Days' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once Daily in Morning', duration: '30 Days' }
    ],
    instructions: 'Take Lisinopril in the morning with a full glass of water.',
    date: '2026-09-15'
  },
  {
    id: 'rx-802',
    patientId: 'pat-2',
    patientName: 'Emily Watson',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Chen',
    medicines: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'At onset of headache', duration: 'As Needed' }
    ],
    instructions: 'Do not exceed 200mg in a 24-hour period.',
    date: '2026-09-18'
  }
];

export const mockReports = [
  {
    id: 'rep-901',
    patientId: 'pat-1',
    patientName: 'John Doe',
    uploadedBy: 'Dr. Sarah Jenkins',
    reportType: 'Echocardiogram (ECG)',
    fileName: 'John_Doe_ECG_Sep2026.pdf',
    filePath: '/reports/John_Doe_ECG_Sep2026.pdf',
    date: '2026-09-15'
  },
  {
    id: 'rep-902',
    patientId: 'pat-2',
    patientName: 'Emily Watson',
    uploadedBy: 'Dr. Robert Chen',
    reportType: 'Brain MRI Scan',
    fileName: 'Emily_Watson_MRI_Sep2026.pdf',
    filePath: '/reports/Emily_Watson_MRI_Sep2026.pdf',
    date: '2026-09-18'
  }
];

export const mockAuditLogs = [
  {
    id: 'log-1001',
    userId: 'usr-1',
    userName: 'System Administrator',
    action: 'USER_LOGIN',
    targetType: 'Auth',
    targetId: 'usr-1',
    timestamp: '2026-09-30 20:15:02'
  },
  {
    id: 'log-1002',
    userId: 'usr-2',
    userName: 'Dr. Sarah Jenkins',
    action: 'CREATE_MEDICAL_RECORD',
    targetType: 'MedicalRecord',
    targetId: 'rec-501',
    timestamp: '2026-09-15 14:22:10'
  },
  {
    id: 'log-1003',
    userId: 'usr-4',
    userName: 'John Doe',
    action: 'CREATE_APPOINTMENT',
    targetType: 'Appointment',
    targetId: 'apt-101',
    timestamp: '2026-09-28 09:10:45'
  }
];
