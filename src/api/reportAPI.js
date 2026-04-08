/**
 * api/reportAPI.js — Axios service layer for report endpoints.
 *
 * Note on file upload:
 *  When sending a PDF + text fields together, we use FormData (multipart/form-data).
 *  Axios detects FormData and sets the correct Content-Type header automatically,
 *  so we must NOT manually set "Content-Type: application/json" for that request.
 */

import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // Send JWT cookie on every request
});

export const reportAPI = {
  /**
   * generateReport — Submit form data (text + PDF) to generate an AI report.
   *
   * @param {FormData} formData - Must contain: selfDescription, jobDescription, resume (File)
   * @param {function} onUploadProgress - Optional callback for upload progress (0–100)
   */
  generateReport: async (formData, onUploadProgress) => {
    const res = await api.post("/reports", formData, {
      headers: {
        // Let browser set the correct multipart boundary automatically
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percent);
        }
      },
    });
    return res.data;
  },

  /**
   * getUserReports — Fetch all reports belonging to the current user.
   */
  getUserReports: async () => {
    const res = await api.get("/reports");
    return res.data;
  },

  /**
   * getReportById — Fetch a single full report by its MongoDB ID.
   * @param {string} id - Report ObjectId
   */
  getReportById: async (id) => {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  },
};