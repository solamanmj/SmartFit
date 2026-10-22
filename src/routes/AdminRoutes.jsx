import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminProtectedRoute from '../admin/components/AdminProtectedRoute';
import AdminLayout from '../admin/components/AdminLayout';

import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminTrainers from '../pages/admin/AdminTrainers';
import AdminNutritionists from '../pages/admin/AdminNutritionists';
import AdminExercises from '../pages/admin/AdminExercises';
import AdminNutrition from '../pages/admin/AdminNutrition';
import AdminRecommendations from '../pages/admin/AdminRecommendations';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminFeedback from '../pages/admin/AdminFeedback';
import AdminProfile from '../pages/admin/AdminProfile';

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public Admin Login */}
      <Route path="login" element={<AdminLogin />} />

      {/* Standalone Admin Panel Routes with Strict Role Protection */}
      <Route
        path="*"
        element={
          <AdminProtectedRoute>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="trainers" element={<AdminTrainers />} />
              <Route path="nutritionists" element={<AdminNutritionists />} />
              <Route path="exercises" element={<AdminExercises />} />
              <Route path="nutrition" element={<AdminNutrition />} />
              <Route path="recommendations" element={<AdminRecommendations />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminProfile />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}
