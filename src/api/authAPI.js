/**
 * api/authAPI.js — Axios service layer for authentication endpoints.
 *
 * Why a separate API layer?
 *  - Keeps components clean — no fetch/axios logic inside UI components
 *  - Single place to update base URL or headers
 *  - Easy to mock during testing
 *
 * `withCredentials: true` is CRITICAL — tells axios to send and receive
 * HTTP-only cookies across requests (required for JWT cookie auth).
 */

import axios from "axios";

// Base axios instance — all requests share this config
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,          // CRA proxy forwards this to http://localhost:5000/api
  withCredentials: true,    // Send cookies with every request (JWT auth)
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  /**
   * register — Create a new user account.
   * @param {{ name, email, password }} data
   */
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  /**
   * login — Authenticate with email + password.
   * Server sets an HTTP-only JWT cookie on success.
   * @param {{ email, password }} data
   */
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  /**
   * logout — Instructs server to clear the JWT cookie.
   */
  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  /**
   * getMe — Fetch the currently authenticated user's profile.
   * Uses the JWT cookie automatically (withCredentials).
   */
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};