/**
 * hooks/useAuthForm.js — Custom hook for managing login/register form state.
 *
 * Handles:
 *  - Form field values
 *  - Client-side validation
 *  - Submission loading state
 *  - API error messages
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/authAPI";

export const useAuthForm = (mode = "login") => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  // Update a single field
  const handleChange = (e) => {
    setError(null); // Clear error when user types
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * validate — Client-side checks before hitting the API.
   * Returns error message string or null if valid.
   */
  const validate = () => {
    const { name, email, password } = formData;

    if (mode === "register" && !name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
    if (!password) return "Password is required";
    if (mode === "register" && password.length < 6)
      return "Password must be at least 6 characters";

    return null;
  };

  /**
   * handleSubmit — Validates, calls the API, and updates global auth state on success.
   * @param {function} onSuccess - Called after successful login/register (e.g. navigate to dashboard)
   */
  const handleSubmit = async (onSuccess) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (mode === "register") {
        data = await authAPI.register(formData);
      } else {
        data = await authAPI.login({ email: formData.email, password: formData.password });
      }

      // Update global auth context with the returned user
      login(data.user);

      // Trigger navigation or any post-login action
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { formData, error, loading, handleChange, handleSubmit };
};