// src/pages/FolderPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./FolderPage.css";

export default function FolderPage() {
  const { id: folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch folder info + notes
  const fetchFolderData = async () => {
    try {
      setLoading(true);
      const [folderRes, notesRes] = await Promise.all([
        api.get(`/folders/${folderId}`),
        api.get(`/notes/${folderId}`),
      ]);
      setFolder(folderRes.data);
      setNotes(notesRes.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load notes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderData();
  }, [folderId]);

  // Create note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    try {
      const res = await api.post("/notes", {
        folderId,
        title: newNoteTitle,
        content: "",
      });
      setNotes((prev) => [...prev, res.data]);
      setNewNoteTitle("");
    } catch (err) {
      setError("Error creating note");
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      setError("Error deleting note");
    }
  };

  // Rename note
  const handleRenameNote = async (noteId, title) => {
    try {
      await api.put(`/notes/${noteId}`, { title });
      setNotes((prev) =>
        prev.map((n) => (n._id === noteId ? { ...n, title } : n))
      );
    } catch (err) {
      setError("Error renaming note");
    }
  };

  return (
    <div className="folderpage-container">
      <Navbar />

      <div className="folderpage-content">
        {folder && (
          <h1 className="folderpage-title">
            {folder.title || folder.name} 📂
          </h1>
        )}

        <form className="create-note-form" onSubmit={handleCreateNote}>
          <input
            type="text"
            placeholder="New note title..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            + Create Note
          </button>
        </form>

        {loading ? (
          <p className="loading-text">Loading notes...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : notes.length === 0 ? (
          <p className="empty-text">
            No notes yet. Create one to get started ✏️
          </p>
        ) : (
          <div className="note-grid">
            {notes.map((note) => (
              <div
                className="note-card"
                key={note._id}
                onClick={() => navigate(`/notes/${note._id}`)}
              >
                <input
                  className="note-title"
                  value={note.title}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleRenameNote(note._id, e.target.value)}
                />
                <div className="note-actions">
                  <button
                    className="btn-icon delete"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note._id);
                    }}
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
