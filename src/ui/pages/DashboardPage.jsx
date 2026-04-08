/**
 * ui/pages/DashboardPage.js — Main page for generating AI interview reports.
 *
 * Contains:
 *  - Self description textarea
 *  - Job description textarea
 *  - PDF resume file upload
 *  - Submit button with upload progress indicator
 *  - Link to report history
 *
 * On successful generation → navigates to /report/:id to display the report.
 */

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../hooks/useReports";
import ErrorMessage from "../components/ErrorMessage";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generating, uploadProgress, error, generateReport, clearError } = useReports();

  // Local form state
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription]   = useState("");
  const [resumeFile, setResumeFile]           = useState(null);
  const [dragOver, setDragOver]               = useState(false);
  const [fieldErrors, setFieldErrors]         = useState({});

  const fileInputRef = useRef(null);

  // ── Client-side validation ─────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!selfDescription.trim() || selfDescription.trim().length < 30)
      errors.selfDescription = "Please describe yourself in at least 30 characters.";
    if (!jobDescription.trim() || jobDescription.trim().length < 30)
      errors.jobDescription = "Please provide the job description (at least 30 characters).";
    if (!resumeFile)
      errors.resume = "Please upload your resume as a PDF file.";
    return errors;
  };

  // ── File input handlers ────────────────────────────────────────
  const handleFileChange = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setFieldErrors((prev) => ({ ...prev, resume: "Only PDF files are accepted." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, resume: "File size must be under 5 MB." }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, resume: null }));
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const report = await generateReport({ selfDescription, jobDescription, resumeFile });
    if (report) {
      navigate(`/reports/${report._id}`);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* ── Page header ── */}
        <header className="dashboard__header">
          <div className="dashboard__greeting">
            <span className="dashboard__greeting-tag">// SYSTEM READY</span>
            <h1 className="dashboard__title">
              Hello, <span className="dashboard__title-name">{user?.name}</span>
            </h1>
            <p className="dashboard__subtitle">
              Submit your profile and let AI analyse your interview readiness.
            </p>
          </div>

          {/* Quick link to history */}
          <button
            className="dashboard__history-btn"
            onClick={() => navigate("/reports")}
          >
            View Past Reports →
          </button>
        </header>

        {/* ── Main form ── */}
        <form className="dashboard__form" onSubmit={handleSubmit} noValidate>
          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          {/* Row: two textareas side-by-side on wider screens */}
          <div className="dashboard__row">
            {/* Self Description */}
            <div className="form-block">
              <label className="form-block__label" htmlFor="selfDescription">
                <span className="form-block__label-num">01</span>
                Self Description
              </label>
              <p className="form-block__hint">
                Introduce yourself — your background, skills, years of experience.
              </p>
              <textarea
                id="selfDescription"
                className={`form-block__textarea ${fieldErrors.selfDescription ? "form-block__textarea--error" : ""}`}
                placeholder="I am a software engineer with 3 years of experience in React and Node.js. I have worked on..."
                value={selfDescription}
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                  setFieldErrors((p) => ({ ...p, selfDescription: null }));
                }}
                rows={8}
              />
              {fieldErrors.selfDescription && (
                <p className="form-block__error">{fieldErrors.selfDescription}</p>
              )}
            </div>

            {/* Job Description */}
            <div className="form-block">
              <label className="form-block__label" htmlFor="jobDescription">
                <span className="form-block__label-num">02</span>
                Job Description
              </label>
              <p className="form-block__hint">
                Paste the full job description from the posting you're targeting.
              </p>
              <textarea
                id="jobDescription"
                className={`form-block__textarea ${fieldErrors.jobDescription ? "form-block__textarea--error" : ""}`}
                placeholder="We are looking for a Senior Full Stack Developer with expertise in React, Node.js, and AWS..."
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setFieldErrors((p) => ({ ...p, jobDescription: null }));
                }}
                rows={8}
              />
              {fieldErrors.jobDescription && (
                <p className="form-block__error">{fieldErrors.jobDescription}</p>
              )}
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-block">
            <label className="form-block__label">
              <span className="form-block__label-num">03</span>
              Resume / CV
            </label>
            <p className="form-block__hint">Upload your resume as a PDF (max 5 MB).</p>

            <div
              className={`upload-zone ${dragOver ? "upload-zone--active" : ""} ${resumeFile ? "upload-zone--has-file" : ""} ${fieldErrors.resume ? "upload-zone--error" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              aria-label="Upload resume PDF"
            >
              {resumeFile ? (
                <div className="upload-zone__file">
                  <span className="upload-zone__file-icon">📄</span>
                  <div>
                    <p className="upload-zone__file-name">{resumeFile.name}</p>
                    <p className="upload-zone__file-size">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="upload-zone__remove"
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-zone__placeholder">
                  <span className="upload-zone__icon">⇪</span>
                  <p className="upload-zone__text">
                    Drag & drop your PDF here, or <span className="upload-zone__link">browse</span>
                  </p>
                  <p className="upload-zone__subtext">PDF only · Max 5 MB</p>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />

            {fieldErrors.resume && (
              <p className="form-block__error">{fieldErrors.resume}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="dashboard__submit-wrap">
            <button
              type="submit"
              className="dashboard__submit-btn"
              disabled={generating}
            >
              {generating ? (
                <>
                  <span className="btn-spinner btn-spinner--dark" />
                  {uploadProgress > 0 && uploadProgress < 100
                    ? `Uploading... ${uploadProgress}%`
                    : "Analysing with AI..."}
                </>
              ) : (
                <>
                  <span className="dashboard__submit-icon">⬡</span>
                  Generate AI Report
                </>
              )}
            </button>

            {/* Upload progress bar */}
            {generating && uploadProgress > 0 && (
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {generating && (
              <p className="dashboard__generating-note">
                AI is analysing your profile — this may take 15–30 seconds...
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;