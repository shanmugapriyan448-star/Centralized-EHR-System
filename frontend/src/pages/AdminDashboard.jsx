import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  mockUsers,
  mockPatients,
  mockDoctors,
  mockAppointments,
  mockAuditLogs
} from '../data/mockData';
import { Users, UserCheck, Stethoscope, Calendar, ShieldAlert, Plus, Search, Trash2, Edit } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [usersList, setUsersList] = useState(mockUsers);
  const [patientsList, setPatientsList] = useState(mockPatients);
  const [doctorsList, setDoctorsList] = useState(mockDoctors);
  const [appointmentsList, setAppointmentsList] = useState(mockAppointments);
  const [auditLogsList, setAuditLogsList] = useState(mockAuditLogs);
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'patient' });

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const usersRes = await api.get('/users').catch(() => null);
        if (usersRes?.success && usersRes.data?.users?.length > 0) {
          setUsersList(
            usersRes.data.users.map((u) => ({
              id: u._id || u.id,
              name: u.name,
              email: u.email,
              role: u.role
            }))
          );
        }

        const patientsRes = await api.get('/patients').catch(() => null);
        if (patientsRes?.success && patientsRes.data?.patients?.length > 0) {
          setPatientsList(
            patientsRes.data.patients.map((p) => ({
              id: p._id || p.id,
              name: p.user?.name || p.name || 'Patient User',
              dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '1990-01-01',
              gender: p.gender || 'Other',
              bloodGroup: p.bloodGroup || 'O+',
              phone: p.phone || 'N/A',
              medicalHistory: p.medicalHistory || 'None recorded'
            }))
          );
        }

        const doctorsRes = await api.get('/doctors').catch(() => null);
        if (doctorsRes?.success && doctorsRes.data?.doctors?.length > 0) {
          setDoctorsList(
            doctorsRes.data.doctors.map((d) => ({
              id: d._id || d.id,
              name: d.user?.name || d.name || 'Doctor Staff',
              specialization: d.specialization || 'General Practice',
              department: d.department || 'Internal Medicine',
              experience: d.experienceYears ? `${d.experienceYears} Years` : '5 Years',
              phone: d.phone || 'N/A'
            }))
          );
        }

        const apptsRes = await api.get('/appointments').catch(() => null);
        if (apptsRes?.success && apptsRes.data?.appointments?.length > 0) {
          setAppointmentsList(
            apptsRes.data.appointments.map((a) => ({
              id: a._id || a.id,
              patientName: a.patient?.name || 'Patient Record',
              doctorName: a.doctor?.name || 'Doctor Staff',
              date: a.appointmentDate ? a.appointmentDate.split('T')[0] : '2026-10-01',
              time: a.appointmentTime || '10:00 AM',
              reason: a.reason || 'General Checkup',
              status: a.status || 'pending'
            }))
          );
        }

        const auditRes = await api.get('/audit-logs').catch(() => null);
        if (auditRes?.success && auditRes.data?.logs?.length > 0) {
          setAuditLogsList(
            auditRes.data.logs.map((l) => ({
              id: l._id || l.id,
              userName: l.user?.name || l.userRole || 'System User',
              action: l.action,
              targetType: l.resource,
              targetId: l.resourceId || 'N/A',
              timestamp: l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : 'Just now'
            }))
          );
        }
      } catch (err) {
        console.warn('API sync warning: utilizing local state fallback.', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const added = {
      id: `usr-${usersList.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
    setUsersList([...usersList, added]);
    setNewUser({ name: '', email: '', role: 'patient' });
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (id) => {
    setUsersList(usersList.filter((u) => u.id !== id));
  };

  return (
    <DashboardLayout currentRole="admin" activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#dbeafe', color: '#2563eb' }}>
                <UserCheck size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Patients</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{patientsList.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#ccfbf1', color: '#0d9488' }}>
                <Stethoscope size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Active Doctors</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{doctorsList.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#fef3c7', color: '#d97706' }}>
                <Calendar size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Appointments</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{appointmentsList.length}</div>
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#f3e8ff', color: '#7c3aed' }}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Audit Records</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{auditLogsList.length}</div>
              </div>
            </div>
          </div>

          {/* System Overview Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div className="card-glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Recent System Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {auditLogsList.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                        {log.userName} ({log.action})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Target: {log.targetType} [{log.targetId}]
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glass" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>System Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Backend Server</span>
                  <span className="badge badge-completed">Live Connected</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Database Engine</span>
                  <span className="badge badge-confirmed">MongoDB Community Server</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Frontend Framework</span>
                  <span className="badge badge-completed">Vite + React</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Security Engine</span>
                  <span className="badge badge-admin">JWT + RBAC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>System User Management</h3>
            <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
              <Plus size={16} /> Add New User
            </button>
          </div>

          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        style={{ color: '#ef4444', padding: '4px 8px', borderRadius: '4px' }}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
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
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Patient Directory</h3>
          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Phone</th>
                  <th>Medical History</th>
                </tr>
              </thead>
              <tbody>
                {patientsList.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: '#0d9488' }}>{p.id}</td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.dateOfBirth}</td>
                    <td>{p.gender}</td>
                    <td>
                      <span className="badge badge-confirmed">{p.bloodGroup}</span>
                    </td>
                    <td>{p.phone}</td>
                    <td>{p.medicalHistory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOCTORS TAB */}
      {activeTab === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Medical Staff Directory</h3>
          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Doctor ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {doctorsList.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600, color: '#7c3aed' }}>{d.id}</td>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.specialization}</td>
                    <td>{d.department}</td>
                    <td>{d.experience}</td>
                    <td>{d.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>All Appointments</h3>
          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsList.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.id}</td>
                    <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                    <td>{a.doctorName}</td>
                    <td>
                      {a.date} at {a.time}
                    </td>
                    <td>{a.reason}</td>
                    <td>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>System Audit Logs</h3>
          <div className="ehr-table-container">
            <table className="ehr-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target Type</th>
                  <th>Target ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogsList.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>{log.id}</td>
                    <td style={{ fontWeight: 600 }}>{log.userName}</td>
                    <td>
                      <span className="badge badge-admin">{log.action}</span>
                    </td>
                    <td>{log.targetType}</td>
                    <td>{log.targetId}</td>
                    <td style={{ color: '#64748b' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
