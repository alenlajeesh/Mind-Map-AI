// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all folders for the user
  const fetchFolders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/folders");
      setFolders(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load folders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // Create new folder
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolder.trim()) return;
    try {
      const res = await api.post("/folders", { title: newFolder });
      setFolders((prev) => [...prev, res.data]);
      setNewFolder("");
    } catch (err) {
      setError("Error creating folder");
    }
  };

  // Delete folder
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this folder?")) return;
    try {
      await api.delete(`/folders/${id}`);
      setFolders((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError("Error deleting folder");
    }
  };

  // Rename folder inline
  const handleRename = async (id, newName) => {
    try {
      const res = await api.put(`/folders/${id}`, { name: newName });
      setFolders((prev) =>
        prev.map((f) => (f._id === id ? { ...f, name: res.data.name } : f))
      );
    } catch (err) {
      setError("Error renaming folder");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar onLogout={logout} />

      <div className="dashboard-content">
        <h1 className="dashboard-title">Your Study Folders</h1>

        <form className="create-folder-form" onSubmit={handleCreateFolder}>
          <input
            type="text"
            placeholder="New folder name..."
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            + Create Folder
          </button>
        </form>

        {loading ? (
          <p className="loading-text">Loading folders...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : folders.length === 0 ? (
          <p className="empty-text">No folders yet. Create one to get started!</p>
        ) : (
          <div className="folder-grid">
            {folders.map((folder) => (
              <div
                className="folder-card"
                key={folder._id}
                onClick={() => navigate(`/folders/${folder._id}`)}
              >
                <div className="folder-header">
                  <input
                    className="folder-title"
                    value={folder.title || folder.name}
                    onChange={(e) =>
                      handleRename(folder._id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="folder-actions">
                  <button
                    className="btn-icon delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(folder._id);
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
