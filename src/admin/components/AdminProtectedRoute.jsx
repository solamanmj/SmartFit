import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminProtectedRoute({ children }) {
  const { user, token, logout } = useAuth();
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/admin/login" state={{ from: location, error: "Authentication required to access SmartFit Admin Panel." }} replace />;
  }

  // Strict role check: Only ADMIN role allowed
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/admin/login" state={{ error: "Access Denied: You do not have administrative privileges." }} replace />;
  }

  // Check token expiration if JWT
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      const nowInSecs = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < nowInSecs) {
        logout();
        return <Navigate to="/admin/login" state={{ error: "Session expired. Please log in again." }} replace />;
      }
    }
  } catch (e) {
    // Ignore non-JWT tokens in local dev fallback
  }

  return children;
}
