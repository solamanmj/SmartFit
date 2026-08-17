import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, token, logout } = useAuth();
  const location = useLocation();

  // 1. Check if user or token is missing
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Validate JWT Token expiration if token is a JWT string (3 parts separated by dots)
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      const nowInSecs = Math.floor(Date.now() / 1000);
      
      // If JWT Token has expired
      if (payload.exp && payload.exp < nowInSecs) {
        console.warn('JWT Token expired. Redirecting to login.');
        logout();
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    }
  } catch (e) {
    // If token parsing fails, fallback to user check
  }

  return children;
}
