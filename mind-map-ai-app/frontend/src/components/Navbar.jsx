// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar({ onLogout }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/dashboard")}>
        <h1 className="navbar-logo">🧠 MindMapAI</h1>
      </div>

      <div className="navbar-center">
        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
          Dashboard
        </Link>
        <Link to="/tasks" className={`nav-link ${isActive("/tasks")}`}>
          Tasks
        </Link>
      </div>

      <div className="navbar-right">
        {user && (
          <span className="navbar-user">
            👋 {user.username || user.email.split("@")[0]}
          </span>
        )}
        <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
