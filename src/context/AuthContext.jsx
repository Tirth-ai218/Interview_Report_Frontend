/**
 * context/AuthContext.js — Global authentication state.
 *
 * Why React Context?
 *  - Avoids prop-drilling (passing user/login/logout through many component layers)
 *  - Provides a single source of truth for auth state across the whole app
 *
 * What this context provides:
 *  - user        → current user object (or null if not logged in)
 *  - loading     → true while checking auth status on app load
 *  - login()     → sets user after successful login
 *  - logout()    → clears user and calls backend logout endpoint
 *  - isAuth      → convenience boolean derived from user
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/authAPI";

// Create the context with undefined default (will be provided by AuthProvider)
const AuthContext = createContext(undefined);

// ── Provider Component ────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true on first load while checking session

  /**
   * checkAuth — Called once on app mount.
   * Hits GET /api/auth/me — if the cookie is still valid, returns user data.
   * This re-hydrates the auth state after page refresh without needing localStorage.
   */
  const checkAuth = useCallback(async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch {
      // Cookie invalid or expired — user is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run auth check when the app first loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * login — Sets the user object after a successful login API call.
   * @param {object} userData - User object returned from login/register endpoint
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * logout — Clears local user state and calls backend to clear the cookie.
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      setUser(null); // Always clear local state even if API call fails
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuth: !!user, // Convenience boolean
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Custom hook for consuming the context ────────────────────────────────────

/**
 * useAuth — Custom hook that provides access to the AuthContext.
 * Throws an error if used outside of AuthProvider (prevents silent bugs).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};