/**
 * ui/pages/ReportDetailPage.js — Full AI report display page.
 *
 * Fetches the report by ID from the URL params, then renders:
 *  - Score ring (animated circular match score)
 *  - Executive summary
 *  - Strengths, Weaknesses, Skill Gaps, Suggestions (each in its own card)
 *  - Job Match Guidance (action plan)
 */

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReports } from "../../hooks/useReports";
import ScoreRing from "../components/ScoreRing";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import "./ReportDetailPage.css";

// ── Section card sub-component ────────────────────────────────────────────────
const ReportSection = ({ title, icon, items = [], colorClass = "" }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`report-section ${colorClass}`}>
      <h3 className="report-section__title">
        <span className="report-section__icon">{icon}</span>
        {title}
      </h3>
      <ul className="report-section__list">
        {items.map((item, i) => (
          <li key={i} className="report-section__item">
            <span className="report-section__bullet" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentReport, loading, error, fetchReportById } = useReports();

  // Fetch report on mount using the ID from the URL
 useEffect(() => {
  if (!id || id === "undefined") {
    navigate("/reports");
    return;
  }

  fetchReportById(id);
}, [id, fetchReportById]);

  if (loading) return <Loader fullScreen message="Loading report..." />;

  if (error) {
    return (
      <div className="container" style={{ paddingTop: "3rem" }}>
        <ErrorMessage message={error} />
        <button className="back-btn" onClick={() => navigate("/dashboard")} style={{ marginTop: "1.5rem" }}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  if (!currentReport) return null;

  const r = currentReport.report || currentReport; // handle both shapes
  const date = new Date(currentReport.createdAt).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="report-detail">
      <div className="container">

        {/* ── Navigation ── */}
        <div className="report-detail__nav">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← New Report
          </button>
          <button className="back-btn" onClick={() => navigate("/reports")}>
            All Reports →
          </button>
        </div>

        {/* ── Hero: score + summary ── */}
        <div className="report-hero">
          <div className="report-hero__left">
            <span className="report-hero__tag">// ANALYSIS COMPLETE</span>
            <h1 className="report-hero__title">Interview Readiness Report</h1>
            <p className="report-hero__date">{date}</p>
            {r.summary && (
              <p className="report-hero__summary">{r.summary}</p>
            )}
          </div>

          {/* Animated match score ring */}
          {r.overallScore !== undefined && r.overallScore !== null && (
            <div className="report-hero__score">
              <ScoreRing score={r.overallScore} />
              <p className="report-hero__score-label">Job Match Score</p>
            </div>
          )}
        </div>

        {/* ── Report grid: four section cards ── */}
        <div className="report-grid">
          <ReportSection
            title="Strengths"
            icon="✦"
            items={r.strengths}
            colorClass="report-section--green"
          />
          <ReportSection
            title="Weaknesses"
            icon="◈"
            items={r.weaknesses}
            colorClass="report-section--red"
          />
          <ReportSection
            title="Skill Gaps"
            icon="◬"
            items={r.skillGaps}
            colorClass="report-section--amber"
          />
          <ReportSection
            title="Suggestions"
            icon="⟡"
            items={r.suggestions}
            colorClass="report-section--blue"
          />
        </div>

        {/* ── Job Match Guidance (full-width) ── */}
        {r.jobMatchGuidance && (
          <div className="report-guidance">
            <h3 className="report-guidance__title">
              <span>⬡</span> Action Plan — Match the Job Description
            </h3>
            <p className="report-guidance__text">{r.jobMatchGuidance}</p>
          </div>
        )}

        {/* ── Footer actions ── */}
        <div className="report-detail__footer">
          <button
            className="report-detail__new-btn"
            onClick={() => navigate("/dashboard")}
          >
            ⬡ Generate New Report
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportDetailPage;