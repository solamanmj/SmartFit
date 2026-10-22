import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, allowedRoles = null }) {
  const { user, token, logout } = useAuth();
  const location = useLocation();

  // 1. Check if user or token is missing
  if (!user || !token) {
    const target = adminOnly ? "/admin/login" : "/login";
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  // 2. Strict Role Protection for Admin Portal
  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. Strict Role Protection for Allowed Roles
  const userRole = (user?.role || '').toUpperCase();
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
    if (userRole === 'TRAINER') return <Navigate to="/trainer-dashboard" replace />;
    if (userRole === 'NUTRITIONIST') return <Navigate to="/nutritionist-dashboard" replace />;
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // 2. Validate JWT Token expiration if token is a JWT string (3 parts separated by dots)
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const payload = JSON.parse(atob(padded));
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
