/**
 * ui/components/ErrorMessage.js — Inline error banner component.
 */

import React from "react";
import "./ErrorMessage.css";

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span className="error-banner__icon">⚠</span>
      <span className="error-banner__text">{message}</span>
      {onDismiss && (
        <button className="error-banner__close" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;