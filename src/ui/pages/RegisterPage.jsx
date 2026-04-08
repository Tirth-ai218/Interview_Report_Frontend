/**
 * ui/pages/RegisterPage.js — New user registration form.
 * On success → navigates to /dashboard.
 */

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthForm } from "../../hooks/useAuthForm";
import ErrorMessage from "../components/ErrorMessage";
import "./AuthPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { formData, error, loading, handleChange, handleSubmit } = useAuthForm("register");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(() => navigate("/dashboard"));
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" aria-hidden="true">
        <div className="auth-page__grid" />
      </div>

      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">⬡</div>
          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__subtitle">
            Start analysing your interview readiness
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
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
              Password <span className="form-label__hint">(min 6 chars)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="btn-spinner" /> Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;