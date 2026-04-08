/**
 * ui/components/Loader.js — Reusable loading spinner component.
 */

import React from "react";
import "./Loader.css";

const Loader = ({ fullScreen = false, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className="loader-ring" />
        <p className="loader-msg">{message}</p>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <div className="loader-ring loader-ring--sm" />
      <span className="loader-msg loader-msg--sm">{message}</span>
    </div>
  );
};

export default Loader;