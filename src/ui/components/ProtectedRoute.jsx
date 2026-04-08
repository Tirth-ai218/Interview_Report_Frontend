/**
 * ui/components/ProtectedRoute.js — Route guard for authenticated pages.
 *
 * How it works:
 *  1. While auth state is loading (checking cookie on first load) → show spinner
 *  2. If user is not authenticated → redirect to /login
 *  3. If authenticated → render the protected child component
 *
 * This prevents unauthenticated users from accessing dashboard/reports.
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();

  // Show full-screen loader while checking session cookie
  if (loading) return <Loader fullScreen message="Checking session..." />;

  // Not authenticated — redirect to login page
  if (!isAuth) return <Navigate to="/login" replace />;

  // Authenticated — render the requested page
  return children;
};

export default ProtectedRoute;