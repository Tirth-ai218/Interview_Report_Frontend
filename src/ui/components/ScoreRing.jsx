/**
 * ui/components/ScoreRing.js — Animated circular progress ring showing match score.
 *
 * Uses SVG with stroke-dasharray/dashoffset technique for the ring fill animation.
 * The ring fills proportionally to the score (0–100).
 */

import React from "react";
import "./ScoreRing.css";

const ScoreRing = ({ score = 0 }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339px
  // How much of the circumference to "fill" based on score
  const offset = circumference - (score / 100) * circumference;

  // Colour interpolation: red (low) → amber (mid) → green (high)
  const getColor = (s) => {
    if (s >= 75) return "#22c55e";      // green
    if (s >= 50) return "#f59e0b";      // amber
    return "var(--accent)";             // red
  };

  return (
    <div className="score-ring">
      <svg viewBox="0 0 120 120" className="score-ring__svg">
        {/* Background track */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth="8"
        />
        {/* Foreground arc — animated fill */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring__arc"
          style={{ "--offset": offset, "--circumference": circumference }}
        />
      </svg>
      {/* Score number in the centre */}
      <div className="score-ring__label">
        <span className="score-ring__number" style={{ color: getColor(score) }}>
          {score}
        </span>
        <span className="score-ring__unit">/ 100</span>
      </div>
    </div>
  );
};

export default ScoreRing;