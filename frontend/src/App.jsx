import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import { getToken, getUser } from './services/api';

/**
 * Protected Route Wrapper Component
 */
function ProtectedRoute({ allowedRole, children }) {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role ? user.role.toLowerCase() : '';

  if (allowedRole && userRole !== allowedRole.toLowerCase()) {
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
  }

  return children;
}

/**
 * Public Only Route (Redirects authenticated users to their dashboard)
 */
function PublicRoute({ children }) {
  const token = getToken();
  const user = getUser();

  if (token && user) {
    const userRole = user.role ? user.role.toLowerCase() : '';
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'doctor') return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
