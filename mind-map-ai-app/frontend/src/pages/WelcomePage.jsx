// src/pages/WelcomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="welcome-title">MindMapAI — Learn Smarter</h1>
        <p className="welcome-subtitle">
          Unlock your learning potential. Create, share, and study with
          intelligent mind maps.
        </p>

        <div className="welcome-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
