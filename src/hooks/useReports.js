/**
 * hooks/useReports.js — Custom hook for report generation and fetching.
 *
 * Why custom hooks?
 *  - Encapsulates async logic + loading/error state in one place
 *  - Components stay lean — they just call the hook and render
 *  - Reusable across multiple components
 */

import { useState, useCallback } from "react";
import { reportAPI } from "../api/reportAPI";

export const useReports = () => {
  const [reports, setReports]       = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError]           = useState(null);

  /**
   * generateReport — Builds FormData and calls the API.
   * @param {{ selfDescription, jobDescription, resumeFile }} params
   * @returns {object|null} The generated report or null on failure
   */
  const generateReport = useCallback(async ({ selfDescription, jobDescription, resumeFile }) => {
    setGenerating(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Build multipart FormData — text fields + file
      const formData = new FormData();
      formData.append("selfDescription", selfDescription);
      formData.append("jobDescription", jobDescription);
      formData.append("resume", resumeFile); // key must match multer field name "resume"

      const data = await reportAPI.generateReport(formData, setUploadProgress);
      setCurrentReport(data.report);
      return data.report;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to generate report. Please try again.";
      setError(msg);
      return null;
    } finally {
      setGenerating(false);
      setUploadProgress(0);
    }
  }, []);

  /**
   * fetchUserReports — Load all reports for the current user.
   */
  const fetchUserReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportAPI.getUserReports();
      setReports(data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchReportById — Load a single full report.
   * @param {string} id - MongoDB ObjectId of the report
   */
  const fetchReportById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportAPI.getReportById(id);
      setCurrentReport(data.report);
      return data.report;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);
  const clearCurrentReport = () => setCurrentReport(null);

  return {
    reports,
    currentReport,
    loading,
    generating,
    uploadProgress,
    error,
    generateReport,
    fetchUserReports,
    fetchReportById,
    clearError,
    clearCurrentReport,
  };
};