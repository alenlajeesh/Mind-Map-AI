// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">Oops! The page you’re looking for doesn’t exist.</p>

        <div className="notfound-actions">
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            🏠 Back to Home
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
