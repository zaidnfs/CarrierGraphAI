import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobExplorerPage } from './pages/JobExplorerPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DesignShowcasePage } from './pages/DesignShowcasePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public dummy design system showcase page (for visual review) */}
          <Route path="/design" element={<DesignShowcasePage />} />

          {/* Public routes (redirect to / if already authenticated) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Protected routes (require valid JWT token) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/jobs" element={<JobExplorerPage />} />
              <Route path="/resumes" element={<ResumeAnalyzerPage />} />
            </Route>
          </Route>

          {/* Fallback routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
