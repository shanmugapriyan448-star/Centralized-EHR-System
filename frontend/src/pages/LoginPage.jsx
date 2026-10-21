import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, Eye, EyeOff, Shield, Stethoscope, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { api, saveToken, saveUser } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both Email and Password fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response && response.success && response.data) {
        const { token, user } = response.data;
        saveToken(token);
        saveUser(user);

        const role = user?.role?.toLowerCase() || 'patient';
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/patient');
        }
      } else {
        setError('Login failed. Invalid response structure from server.');
      }
    } catch (err) {
      const errorMessage =
        err.data?.message ||
        err.message ||
        'Unable to connect to authentication server. Please check backend status.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    navigate(`/${role}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #0f766e 0%, #0f172a 100%)',
        padding: '20px'
      }}
    >
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', gap: '30px', alignItems: 'center' }}>
        {/* Left Hero Card */}
        <div style={{ flex: 1, color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(20, 184, 166, 0.4)'
              }}
            >
              <Activity size={28} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Centralized EHR
            </h1>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, color: '#f8fafc' }}>
            Unified Electronic Health Record System
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
            A secure, role-based healthcare platform providing seamless medical records management, appointments, digital prescriptions, and automated audit logging.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            {[
              'Role-Based Access Control (Admin, Doctor, Patient)',
              'Encrypted Patient Medical Records & Diagnostic Reports',
              'Real-Time Appointment Scheduling & Status Tracking',
              'Compliant System Action Audit Logging'
            ].map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#2dd4bf" />
                <span style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Card */}
        <div
          style={{
            width: '420px',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Sign In to Portal</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              Enter your credentials to access your EHR portal
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '0.85rem',
                marginBottom: '16px',
                fontWeight: 500
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@ehr.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '10px', padding: '12px', fontSize: '0.95rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.5px' }}>
              Instant Demo Role Access
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleQuickDemo('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#f3e8ff',
                  color: '#6b21a8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <Shield size={18} />
                <span>Explore Admin Portal</span>
              </button>

              <button
                onClick={() => handleQuickDemo('doctor')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#ccfbf1',
                  color: '#0f766e',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <Stethoscope size={18} />
                <span>Explore Doctor Portal</span>
              </button>

              <button
                onClick={() => handleQuickDemo('patient')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                <UserCheck size={18} />
                <span>Explore Patient Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
