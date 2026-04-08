/**
 * ui/components/ReportCard.js — Summary card shown in the report history list.
 * Clicking it navigates to the full report detail page.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReportCard.css";

const ReportCard = ({ report }) => {
  const navigate = useNavigate();

  // Format the creation date nicely
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const score = report.report?.overallScore;

  // Derive score colour class
  const scoreClass =
    score >= 75 ? "card-score--green" :
    score >= 50 ? "card-score--amber" :
    "card-score--red";

  return (
    <div
      className="report-card"
      onClick={() => navigate(`/reports/${report._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/reports/${report._id}`)}
    >
      {/* Left: metadata */}
      <div className="report-card__body">
        <p className="report-card__date">{date}</p>
        <p className="report-card__file">
          <span className="report-card__file-icon">📄</span>
          {report.resumeFileName || "resume.pdf"}
        </p>
        {report.report?.summary && (
          <p className="report-card__summary">{report.report.summary}</p>
        )}
      </div>

      {/* Right: score badge */}
      {score !== undefined && score !== null && (
        <div className={`report-card__score ${scoreClass}`}>
          <span className="report-card__score-num">{score}</span>
          <span className="report-card__score-label">Match</span>
        </div>
      )}

      {/* Arrow indicator */}
      <span className="report-card__arrow">→</span>
    </div>
  );
};

export default ReportCard;