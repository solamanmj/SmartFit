import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Optimized Lazy-Loaded Page Components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Workout = lazy(() => import('./pages/Workout'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Progress = lazy(() => import('./pages/Progress'));
const Challenges = lazy(() => import('./pages/Challenges'));
const VirtualWorkoutStudio = lazy(() => import('./pages/VirtualWorkoutStudio'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard'));
const NutritionistDashboard = lazy(() => import('./pages/NutritionistDashboard'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner message="Optimizing your SmartFit experience..." />}>
            <Routes>
              {/* Public User Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Standalone Admin Portal Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />

              {/* Standalone Trainer & Nutritionist Portals */}
              <Route 
                path="/trainer-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['TRAINER', 'ADMIN']}>
                    <TrainerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nutritionist-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['NUTRITIONIST', 'ADMIN']}>
                    <NutritionistDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Protected User-Only Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/workout" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Workout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/workout-studio" 
                element={
                  <ProtectedRoute allowedRoles={['USER', 'TRAINER', 'ADMIN']}>
                    <VirtualWorkoutStudio />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/nutrition" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Nutrition />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Progress />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/challenges" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Challenges />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/supplements" 
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <Challenges />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
