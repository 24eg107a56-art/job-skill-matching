import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfilePage from './pages/CandidateProfilePage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import RecommendedJobsPage from './pages/RecommendedJobsPage';
import SkillGapPage from './pages/SkillGapPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import ApplicationsPage from './pages/ApplicationsPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
            <Route path="/jobs" element={<PublicLayout><JobsPage /></PublicLayout>} />
            <Route path="/jobs/:id" element={<PublicLayout><JobDetailsPage /></PublicLayout>} />

            {/* Candidate Dashboard Pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CandidateDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CandidateProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ResumeAnalyzerPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/recommended"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <RecommendedJobsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/skill-gap"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SkillGapPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CareerRoadmapPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ApplicationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Management Pages */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
