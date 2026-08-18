import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

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
      <Route path="login" element={<AdminLogin />} />

      <Route path="dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
      <Route path="users" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
      <Route path="trainers" element={<ProtectedRoute adminOnly={true}><AdminTrainers /></ProtectedRoute>} />
      <Route path="nutritionists" element={<ProtectedRoute adminOnly={true}><AdminNutritionists /></ProtectedRoute>} />
      <Route path="exercises" element={<ProtectedRoute adminOnly={true}><AdminExercises /></ProtectedRoute>} />
      <Route path="nutrition" element={<ProtectedRoute adminOnly={true}><AdminNutrition /></ProtectedRoute>} />
      <Route path="recommendations" element={<ProtectedRoute adminOnly={true}><AdminRecommendations /></ProtectedRoute>} />
      <Route path="analytics" element={<ProtectedRoute adminOnly={true}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="feedback" element={<ProtectedRoute adminOnly={true}><AdminFeedback /></ProtectedRoute>} />
      <Route path="profile" element={<ProtectedRoute adminOnly={true}><AdminProfile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
