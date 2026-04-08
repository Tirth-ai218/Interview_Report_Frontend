/**
 * ui/pages/ReportsHistoryPage.js — Lists all past reports for the current user.
 *
 * On mount: calls fetchUserReports() to load the list.
 * Renders ReportCard components for each report.
 * Empty state shown if no reports exist yet.
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReports } from "../../hooks/useReports";
import ReportCard from "../components/ReportCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import "./ReportsHistoryPage.css";

const ReportsHistoryPage = () => {
  const navigate = useNavigate();
  const { reports, loading, error, fetchUserReports } = useReports();

  // Load reports when the component mounts
  useEffect(() => {
    fetchUserReports();
  }, [fetchUserReports]);

  return (
    <div className="history-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="history-page__header">
          <div>
            <span className="history-page__tag">// REPORT ARCHIVE</span>
            <h1 className="history-page__title">Past Reports</h1>
            <p className="history-page__subtitle">
              All your AI-generated interview analyses, newest first.
            </p>
          </div>
          <button
            className="history-page__new-btn"
            onClick={() => navigate("/dashboard")}
          >
            + New Report
          </button>
        </div>

        {/* ── States ── */}
        {loading && <Loader message="Loading reports..." />}

        {error && <ErrorMessage message={error} />}

        {/* Empty state */}
        {!loading && !error && reports.length === 0 && (
          <div className="history-page__empty">
            <span className="history-page__empty-icon">⬡</span>
            <h2 className="history-page__empty-title">No reports yet</h2>
            <p className="history-page__empty-text">
              Generate your first AI interview report to see it here.
            </p>
            <button
              className="history-page__empty-btn"
              onClick={() => navigate("/dashboard")}
            >
              Generate First Report
            </button>
          </div>
        )}

        {/* Report list */}
        {!loading && reports.length > 0 && (
          <div className="history-page__list">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportsHistoryPage;