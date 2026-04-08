/**
 * ui/components/Navbar.js — Top navigation bar.
 *
 * Shows: Brand logo, user name, logout button (when authenticated)
 * Hides logout when on auth pages (no user session)
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        {/* Brand */}
        <button className="navbar__brand" onClick={() => navigate(isAuth ? "/dashboard" : "/")}>
          <span className="navbar__brand-icon">⬡</span>
          <span className="navbar__brand-text">
            Interview<span className="navbar__brand-accent">AI</span>
          </span>
        </button>

        {/* Right side */}
        {isAuth && (
          <div className="navbar__right">
            <span className="navbar__user">
              <span className="navbar__user-dot" />
              {user?.name}
            </span>
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;