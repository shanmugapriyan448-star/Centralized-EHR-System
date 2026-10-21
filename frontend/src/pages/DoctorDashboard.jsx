import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  mockAppointments,
  mockPatients,
  mockMedicalRecords,
  mockPrescriptions,
  mockReports
} from '../data/mockData';
import { Calendar, UserCheck, FileText, Pill, FileBarChart, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointmentsList, setAppointmentsList] = useState(mockAppointments);
  const [patientsList, setPatientsList] = useState(mockPatients);
  const [medicalRecordsList, setMedicalRecordsList] = useState(mockMedicalRecords);
  const [prescriptionsList, setPrescriptionsList] = useState(mockPrescriptions);
  const [reportsList, setReportsList] = useState(mockReports);

  // Modals state
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patientId: 'pat-1',
    symptoms: '',
    diagnosis: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showAddRxModal, setShowAddRxModal] = useState(false);
  const [newRx, setNewRx] = useState({
    patientId: 'pat-1',
    medicineName: '',
    dosage: '',
    frequency: 'Once Daily',
    duration: '14 Days',
    instructions: ''
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const apptsRes = await api.get('/appointments').catch(() => null);
        if (apptsRes?.success && apptsRes.data?.appointments?.length > 0) {
          setAppointmentsList(
            apptsRes.data.appointments.map((a) => ({
              id: a._id || a.id,
              patientName: a.patient?.name || 'Patient User',
              date: a.appointmentDate ? a.appointmentDate.split('T')[0] : '2026-10-01',
              time: a.appointmentTime || '10:00 AM',
              reason: a.reason || 'Consultation',
              status: a.status || 'pending'
            }))
          );
        }

        const patientsRes = await api.get('/patients').catch(() => null);
        if (patientsRes?.success && patientsRes.data?.patients?.length > 0) {
          setPatientsList(
            patientsRes.data.patients.map((p) => ({
              id: p._id || p.id,
              name: p.user?.name || p.name || 'Patient Record',
              dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '1990-01-01',
              gender: p.gender || 'Other',
              bloodGroup: p.bloodGroup || 'O+',
              phone: p.phone || 'N/A',
              address: p.address || 'N/A',
              medicalHistory: p.medicalHistory || 'None'
            }))
          );
        }

        const recordsRes = await api.get('/medical-records').catch(() => null);
        if (recordsRes?.success && recordsRes.data?.records?.length > 0) {
          setMedicalRecordsList(
            recordsRes.data.records.map((r) => ({
              id: r._id || r.id,
              patientId: r.patient?._id || r.patient,
              patientName: r.patient?.name || 'Patient Record',
              doctorId: r.doctor?._id || r.doctor,
              doctorName: r.doctor?.name || 'Dr. Medical Staff',
              symptoms: r.symptoms || '',
              diagnosis: r.diagnosis || '',
              notes: r.treatmentPlan || r.notes || '',
              date: r.recordDate ? r.recordDate.split('T')[0] : '2026-10-01'
            }))
          );
        }

        const rxRes = await api.get('/prescriptions').catch(() => null);
        if (rxRes?.success && rxRes.data?.prescriptions?.length > 0) {
          setPrescriptionsList(
            rxRes.data.prescriptions.map((rx) => ({
              id: rx._id || rx.id,
              patientId: rx.patient?._id || rx.patient,
              patientName: rx.patient?.name || 'Patient Record',
              doctorId: rx.doctor?._id || rx.doctor,
              doctorName: rx.doctor?.name || 'Dr. Medical Staff',
              medicines: rx.medications || [
                { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice Daily', duration: '7 Days' }
              ],
              instructions: rx.instructions || 'Take after meals',
              date: rx.prescribedDate ? rx.prescribedDate.split('T')[0] : '2026-10-01'
            }))
          );
        }

        const reportsRes = await api.get('/reports').catch(() => null);
        if (reportsRes?.success && reportsRes.data?.reports?.length > 0) {
          setReportsList(
            reportsRes.data.reports.map((rep) => ({
              id: rep._id || rep.id,
              patientName: rep.patient?.name || 'Patient Record',
              reportType: rep.reportType || 'Lab Test',
              fileName: rep.reportName || 'Diagnostic_Result.pdf',
              date: rep.reportDate ? rep.reportDate.split('T')[0] : '2026-10-01'
            }))
          );
        }
      } catch (err) {
        console.warn('Doctor API sync warning: utilizing local state fallback.', err.message);
      }
    };

    fetchDoctorData();
  }, []);

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointmentsList(
      appointmentsList.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    const patient = patientsList.find((p) => p.id === newRecord.patientId) || patientsList[0];
    const added = {
      id: `rec-${medicalRecordsList.length + 501}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Sarah Jenkins',
      symptoms: newRecord.symptoms,
      diagnosis: newRecord.diagnosis,
      notes: newRecord.notes,
      date: newRecord.date
    };
    setMedicalRecordsList([added, ...medicalRecordsList]);
    setShowAddRecordModal(false);
    setNewRecord({ patientId: 'pat-1', symptoms: '', diagnosis: '', notes: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    const patient = patientsList.find((p) => p.id === newRx.patientId) || patientsList[0];
    const added = {
      id: `rx-${prescriptionsList.length + 801}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Sarah Jenkins',
      medicines: [
        {
          name: newRx.medicineName,
          dosage: newRx.dosage,
          frequency: newRx.frequency,
          duration: newRx.duration
        }
      ],
      instructions: newRx.instructions,
      date: new Date().toISOString().split('T')[0]
    };
    setPrescriptionsList([added, ...prescriptionsList]);
    setShowAddRxModal(false);
  };

  return (
    <DashboardLayout currentRole="doctor" activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Doctor Top Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#ccfbf1', color: '#0d9488' }}>
                <Calendar size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Today's Appointments</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{appointmentsList.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#dbeafe', color: '#2563eb' }}>
                <UserCheck size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Assigned Patients</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{patientsList.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#d1fae5', color: '#059669' }}>
                <FileText size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Medical Records</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{medicalRecordsList.length}</div>
              </div>
            </div>
          </div>

          {/* Quick Clinical Workflow Table */}
          <div className="card-glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Appointment Clinical Actions</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Confirm, Complete, or Cancel</span>
            </div>

            <div className="ehr-table-container">
              <table className="ehr-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Clinical Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsList.map((apt) => (
                    <tr key={apt.id}>
                      <td style={{ fontWeight: 600 }}>{apt.patientName}</td>
                      <td>{apt.date} at {apt.time}</td>
                      <td>{apt.reason}</td>
                      <td>
                        <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {apt.status === 'pending' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            >
                              <CheckCircle size={14} /> Confirm
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ background: '#10b981' }}
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            >
                              <CheckCircle size={14} /> Mark Completed
                            </button>
                          )}
                          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            >
                              <XCircle size={14} /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Assigned Appointments</h3>
          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsList.map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.id}</td>
                    <td style={{ fontWeight: 600 }}>{apt.patientName}</td>
                    <td>{apt.date} {apt.time}</td>
                    <td>{apt.reason}</td>
                    <td>
                      <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                    </td>
                    <td>
                      {apt.status === 'pending' && (
                        <button className="btn btn-primary btn-sm" onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}>
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PATIENTS TAB */}
      {activeTab === 'patients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Patient Profiles & History</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {patientsList.map((p) => (
              <div key={p.id} className="card-glass" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{p.name}</h4>
                  <span className="badge badge-patient">{p.bloodGroup}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>DOB:</strong> {p.dateOfBirth} ({p.gender})</div>
                  <div><strong>Phone:</strong> {p.phone}</div>
                  <div><strong>Address:</strong> {p.address}</div>
                  <div style={{ marginTop: '6px', padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <strong>Medical History:</strong> {p.medicalHistory}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEDICAL RECORDS TAB */}
      {activeTab === 'records' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Patient Medical Records</h3>
            <button className="btn btn-primary" onClick={() => setShowAddRecordModal(true)}>
              <Plus size={16} /> Create Medical Record
            </button>
          </div>

          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Patient</th>
                  <th>Symptoms</th>
                  <th>Diagnosis</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecordsList.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: '#0d9488' }}>{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.patientName}</td>
                    <td>{r.symptoms}</td>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{r.diagnosis}</td>
                    <td>{r.notes}</td>
                    <td style={{ color: '#64748b' }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRESCRIPTIONS TAB */}
      {activeTab === 'prescriptions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Digital Prescriptions</h3>
            <button className="btn btn-primary" onClick={() => setShowAddRxModal(true)}>
              <Plus size={16} /> New Prescription
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {prescriptionsList.map((rx) => (
              <div key={rx.id} className="card-glass" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{rx.patientName}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Prescribed by {rx.doctorName} on {rx.date}</span>
                  </div>
                  <span className="badge badge-completed">{rx.id}</span>
                </div>

                <div className="ehr-table-container" style={{ marginBottom: '12px' }}>
                  <table className="ehr-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rx.medicines.map((m, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{m.name}</td>
                          <td>{m.dosage}</td>
                          <td>{m.frequency}</td>
                          <td>{m.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px' }}>
                  <strong>Instructions:</strong> {rx.instructions}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Lab & Diagnostic Reports</h3>
          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Patient</th>
                  <th>Report Type</th>
                  <th>File Name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reportsList.map((rep) => (
                  <tr key={rep.id}>
                    <td style={{ fontWeight: 600 }}>{rep.id}</td>
                    <td style={{ fontWeight: 600 }}>{rep.patientName}</td>
                    <td><span className="badge badge-doctor">{rep.reportType}</span></td>
                    <td style={{ color: '#2563eb' }}>{rep.fileName}</td>
                    <td>{rep.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddRecordModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Create Medical Record</h3>
            <form onSubmit={handleAddRecord}>
              <div className="form-group">
                <label className="form-label">Select Patient</label>
                <select
                  className="form-select"
                  value={newRecord.patientId}
                  onChange={(e) => setNewRecord({ ...newRecord, patientId: e.target.value })}
                >
                  {patientsList.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Symptoms</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Mild chest pain, fever"
                  value={newRecord.symptoms}
                  onChange={(e) => setNewRecord({ ...newRecord, symptoms: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Diagnosis</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Essential Hypertension"
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Additional patient guidance..."
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddRecordModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Medical Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {showAddRxModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Issue New Prescription</h3>
            <form onSubmit={handleAddPrescription}>
              <div className="form-group">
                <label className="form-label">Patient</label>
                <select
                  className="form-select"
                  value={newRx.patientId}
                  onChange={(e) => setNewRx({ ...newRx, patientId: e.target.value })}
                >
                  {patientsList.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Medicine Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Amoxicillin"
                  value={newRx.medicineName}
                  onChange={(e) => setNewRx({ ...newRx, medicineName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 500mg"
                    value={newRx.dosage}
                    onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Twice Daily"
                    value={newRx.frequency}
                    onChange={(e) => setNewRx({ ...newRx, frequency: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Instructions</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Take after meals"
                  value={newRx.instructions}
                  onChange={(e) => setNewRx({ ...newRx, instructions: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddRxModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Issue Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
