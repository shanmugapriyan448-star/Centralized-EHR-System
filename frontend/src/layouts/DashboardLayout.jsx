import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  FileText,
  Pill,
  FileBarChart,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User
} from 'lucide-react';
import { logout } from '../services/api';

export default function DashboardLayout({ currentRole, children, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roleNavItems = {
    admin: [
      { id: 'overview', label: 'Dashboard', icon: Activity },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'patients', label: 'Patients', icon: UserCheck },
      { id: 'doctors', label: 'Doctors', icon: Stethoscope },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'audit', label: 'Audit Logs', icon: ShieldAlert }
    ],
    doctor: [
      { id: 'overview', label: 'Dashboard', icon: Activity },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'patients', label: 'Patients', icon: UserCheck },
      { id: 'records', label: 'Medical Records', icon: FileText },
      { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
      { id: 'reports', label: 'Reports', icon: FileBarChart }
    ],
    patient: [
      { id: 'overview', label: 'Dashboard', icon: Activity },
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'records', label: 'Medical Records', icon: FileText },
      { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
      { id: 'reports', label: 'Reports', icon: FileBarChart }
    ]
  };

  const navItems = roleNavItems[currentRole] || roleNavItems.admin;

  const handleRoleSwitch = (e) => {
    const selectedRole = e.target.value;
    navigate(`/${selectedRole}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleTitleMap = {
    admin: 'Administrator Portal',
    doctor: 'Doctor Clinical Workspace',
    patient: 'Patient Portal'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transition: 'all 0.3s ease'
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0d9488, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.3px' }}>
                Centralized EHR
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Healthcare System</span>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div style={{ padding: '16px 20px 8px 20px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Session
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2dd4bf', marginTop: '2px' }}>
              {roleTitleMap[currentRole]}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(90deg, #0d9488, #059669)' : 'transparent',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Icon size={18} color={isActive ? '#ffffff' : '#94a3b8'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.1)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: '70px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Centralized EHR System — MERN Architecture Foundation
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Quick Role Switcher for Demo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Demo Switch Role:</span>
              <select
                value={currentRole}
                onChange={handleRoleSwitch}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <option value="admin">Admin Portal</option>
                <option value="doctor">Doctor Portal</option>
                <option value="patient">Patient Portal</option>
              </select>
            </div>

            {/* Profile Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                background: '#f1f5f9',
                borderRadius: '9999px'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0d9488',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {currentRole.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
                {currentRole} User
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic View Body */}
        <main style={{ padding: '32px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
