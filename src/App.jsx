/**
 * App.js — Root application component.
 *
 * Responsibilities:
 *  - Wrap the entire app in AuthProvider (global auth state)
 *  - Define client-side routes using React Router v6
 *  - Apply ProtectedRoute to pages that require authentication
 *  - Render the persistent Navbar on every page
 *
 * Route structure:
 *  /login          → LoginPage       (public)
 *  /register       → RegisterPage    (public)
 *  /dashboard      → DashboardPage   (protected)
 *  /reports        → ReportsHistory  (protected)
 *  /report/:id     → ReportDetail    (protected)
 *  /               → redirect to /dashboard or /login
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./ui/components/Navbar";
import ProtectedRoute from "./ui/components/ProtectedRoute";

// Pages
import LoginPage from "./ui/pages/LoginPage";
import RegisterPage from "./ui/pages/RegisterPage";
import DashboardPage from "./ui/pages/DashboardPage";
import ReportDetailPage from "./ui/pages/ReportDetailPage";
import ReportsHistoryPage from "./ui/pages/ReportsHistoryPage";

const App = () => {
  return (
    // BrowserRouter enables HTML5 history-based routing (clean URLs, no hash)
    <BrowserRouter>
      {/* AuthProvider wraps everything so any component can access auth state */}
      <AuthProvider>
        {/* Navbar is always visible — it conditionally shows logout based on auth */}
        <Navbar />

        <main>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Protected routes ── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:id"
              element={
                <ProtectedRoute>
                  <ReportDetailPage />
                </ProtectedRoute>
              }
            />

            {/* ── Default redirect ── */}
            {/* Redirect root "/" to dashboard; ProtectedRoute handles unauthed users */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ── 404 fallback ── */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;