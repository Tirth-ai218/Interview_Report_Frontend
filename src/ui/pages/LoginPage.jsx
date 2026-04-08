/**
 * ui/pages/LoginPage.js — User login form.
 *
 * Uses useAuthForm hook for all form logic.
 * On success → navigates to /dashboard.
 */

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthForm } from "../../hooks/useAuthForm";
import ErrorMessage from "../components/ErrorMessage";
import "./AuthPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { formData, error, loading, handleChange, handleSubmit } = useAuthForm("login");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(() => navigate("/dashboard"));
  };

  return (
    <div className="auth-page">
      {/* Decorative background grid lines */}
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-page__grid" />
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-card__icon">⬡</div>
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">
            Sign in to access your interview reports
          </p>
        </div>

        {/* Error */}
        {error && <ErrorMessage message={error} />}

        {/* Form */}
        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="btn-spinner" /> Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Switch to register */}
        <p className="auth-card__switch">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;