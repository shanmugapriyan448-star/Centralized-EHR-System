import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  mockAppointments,
  mockPatients,
  mockMedicalRecords,
  mockPrescriptions,
  mockReports,
  mockDoctors
} from '../data/mockData';
import { Calendar, FileText, Pill, FileBarChart, User, Plus, Download, Clock, CheckCircle } from 'lucide-react';
import { api, getUser } from '../services/api';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const storedUser = getUser();
  const [patientInfo, setPatientInfo] = useState({
    id: storedUser?._id || mockPatients[0].id,
    name: storedUser?.name || mockPatients[0].name,
    bloodGroup: 'O+',
    phone: storedUser?.email || mockPatients[0].phone,
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    address: '123 Health Ave, Medical City',
    medicalHistory: 'Penicillin Allergy, Mild Asthma'
  });

  const [myAppointments, setMyAppointments] = useState(mockAppointments);
  const [myRecords, setMyRecords] = useState(mockMedicalRecords);
  const [myPrescriptions, setMyPrescriptions] = useState(mockPrescriptions);
  const [myReports, setMyReports] = useState(mockReports);

  // Book Appointment Modal State
  const [showBookModal, setShowBookModal] = useState(false);
  const [newApt, setNewApt] = useState({
    doctorId: 'doc-1',
    date: '2026-10-10',
    time: '10:00 AM',
    reason: 'Follow-up Consultation'
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const apptsRes = await api.get('/appointments').catch(() => null);
        if (apptsRes?.success && apptsRes.data?.appointments?.length > 0) {
          setMyAppointments(
            apptsRes.data.appointments.map((a) => ({
              id: a._id || a.id,
              doctorName: a.doctor?.name || 'Dr. Medical Specialist',
              date: a.appointmentDate ? a.appointmentDate.split('T')[0] : '2026-10-10',
              time: a.appointmentTime || '10:00 AM',
              reason: a.reason || 'Follow-up Consultation',
              status: a.status || 'pending'
            }))
          );
        }

        const recordsRes = await api.get('/medical-records').catch(() => null);
        if (recordsRes?.success && recordsRes.data?.records?.length > 0) {
          setMyRecords(
            recordsRes.data.records.map((r) => ({
              id: r._id || r.id,
              doctorName: r.doctor?.name || 'Dr. Medical Specialist',
              diagnosis: r.diagnosis || 'Clinical Diagnosis',
              symptoms: r.symptoms || 'None reported',
              notes: r.treatmentPlan || r.notes || '',
              date: r.recordDate ? r.recordDate.split('T')[0] : '2026-10-01'
            }))
          );
        }

        const rxRes = await api.get('/prescriptions').catch(() => null);
        if (rxRes?.success && rxRes.data?.prescriptions?.length > 0) {
          setMyPrescriptions(
            rxRes.data.prescriptions.map((rx) => ({
              id: rx._id || rx.id,
              doctorName: rx.doctor?.name || 'Dr. Medical Specialist',
              medicines: rx.medications || [
                { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice Daily', duration: '7 Days' }
              ],
              date: rx.prescribedDate ? rx.prescribedDate.split('T')[0] : '2026-10-01'
            }))
          );
        }

        const reportsRes = await api.get('/reports').catch(() => null);
        if (reportsRes?.success && reportsRes.data?.reports?.length > 0) {
          setMyReports(
            reportsRes.data.reports.map((rep) => ({
              id: rep._id || rep.id,
              reportType: rep.reportType || 'Lab Test',
              fileName: rep.reportName || 'Diagnostic_Result.pdf',
              uploadedBy: rep.doctor?.name || 'Lab Technician',
              date: rep.reportDate ? rep.reportDate.split('T')[0] : '2026-10-01'
            }))
          );
        }
      } catch (err) {
        console.warn('Patient API sync warning: utilizing local state fallback.', err.message);
      }
    };

    fetchPatientData();
  }, []);

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const doctor = mockDoctors.find((d) => d.id === newApt.doctorId) || mockDoctors[0];
    const added = {
      id: `apt-${myAppointments.length + 104}`,
      patientId: patientInfo.id,
      patientName: patientInfo.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: newApt.date,
      time: newApt.time,
      reason: newApt.reason,
      status: 'pending'
    };
    setMyAppointments([added, ...myAppointments]);
    setShowBookModal(false);
  };

  const handleCancelAppointment = (id) => {
    setMyAppointments(
      myAppointments.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
  };

  return (
    <DashboardLayout currentRole="patient" activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Patient Summary Header */}
          <div
            className="card-glass"
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #0d9488, #0f172a)',
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '8px' }}>
                  Patient Portal
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome back, {patientInfo.name}</h2>
                <p style={{ color: '#99f6e4', fontSize: '0.9rem', marginTop: '4px' }}>
                  Blood Group: {patientInfo.bloodGroup} | Phone: {patientInfo.phone}
                </p>
              </div>
              <button
                className="btn"
                style={{ background: '#ffffff', color: '#0d9488', fontWeight: 700 }}
                onClick={() => setShowBookModal(true)}
              >
                <Plus size={18} /> Schedule Appointment
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#dbeafe', color: '#2563eb' }}>
                <Calendar size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>My Appointments</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{myAppointments.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#d1fae5', color: '#059669' }}>
                <FileText size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Medical Records</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{myRecords.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#fef3c7', color: '#d97706' }}>
                <Pill size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Prescriptions</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{myPrescriptions.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#f3e8ff', color: '#7c3aed' }}>
                <FileBarChart size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Available Reports</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{myReports.length}</div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointment Highlight */}
          <div className="card-glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Next Scheduled Appointment</h3>
            {myAppointments.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {myAppointments[0].doctorName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                    {myAppointments[0].reason}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> {myAppointments[0].date} at {myAppointments[0].time}
                  </div>
                </div>
                <span className={`badge badge-${myAppointments[0].status}`}>{myAppointments[0].status}</span>
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>No upcoming appointments scheduled.</p>
            )}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Personal Health Profile</h3>
          <div className="card-glass" style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input" style={{ background: '#f8fafc', fontWeight: 600 }}>{patientInfo.name}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <div className="form-input" style={{ background: '#f8fafc' }}>{patientInfo.dateOfBirth}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="form-input" style={{ background: '#f8fafc' }}>{patientInfo.gender}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <div className="form-input" style={{ background: '#f8fafc', fontWeight: 600, color: '#0d9488' }}>
                  {patientInfo.bloodGroup}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone / Contact</label>
                <div className="form-input" style={{ background: '#f8fafc' }}>{patientInfo.phone}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <div className="form-input" style={{ background: '#f8fafc' }}>{patientInfo.address}</div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Known Medical Conditions & Allergies</label>
              <div className="form-input" style={{ background: '#f8fafc', color: '#b45309', fontWeight: 600 }}>
                {patientInfo.medicalHistory}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Appointments</h3>
            <button className="btn btn-primary" onClick={() => setShowBookModal(true)}>
              <Plus size={16} /> Book Appointment
            </button>
          </div>

          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>{apt.id}</td>
                    <td style={{ fontWeight: 600 }}>{apt.doctorName}</td>
                    <td>{apt.date} at {apt.time}</td>
                    <td>{apt.reason}</td>
                    <td>
                      <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                    </td>
                    <td>
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelAppointment(apt.id)}
                        >
                          Cancel
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

      {/* MEDICAL RECORDS TAB */}
      {activeTab === 'records' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Medical Records</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myRecords.map((rec) => (
              <div key={rec.id} className="card-glass" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{rec.diagnosis}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{rec.date}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Attending Doctor:</strong> {rec.doctorName}</div>
                  <div><strong>Symptoms:</strong> {rec.symptoms}</div>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>
                    <strong>Doctor's Notes:</strong> {rec.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRESCRIPTIONS TAB */}
      {activeTab === 'prescriptions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Prescriptions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myPrescriptions.map((rx) => (
              <div key={rx.id} className="card-glass" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Prescription #{rx.id}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Issued by {rx.doctorName} on {rx.date}</span>
                  </div>
                </div>

                <div className="ehr-table-container">
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Diagnostic Reports</h3>
          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Report Type</th>
                  <th>File Name</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myReports.map((rep) => (
                  <tr key={rep.id}>
                    <td>{rep.id}</td>
                    <td><span className="badge badge-doctor">{rep.reportType}</span></td>
                    <td style={{ fontWeight: 600 }}>{rep.fileName}</td>
                    <td>{rep.uploadedBy}</td>
                    <td>{rep.date}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Downloading ${rep.fileName} (UI Demonstration)`)}
                      >
                        <Download size={14} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Schedule New Appointment</h3>
            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label className="form-label">Select Specialist Doctor</label>
                <select
                  className="form-select"
                  value={newApt.doctorId}
                  onChange={(e) => setNewApt({ ...newApt, doctorId: e.target.value })}
                >
                  {mockDoctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={newApt.date}
                    onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={newApt.time}
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Appointment</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Routine checkup, headaches"
                  value={newApt.reason}
                  onChange={(e) => setNewApt({ ...newApt, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
