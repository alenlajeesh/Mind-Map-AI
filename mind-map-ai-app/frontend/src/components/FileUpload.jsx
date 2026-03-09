// src/components/FileUpload.jsx
import React, { useState } from "react";
import api from "../api/axios";
import "./FileUpload.css";

/**
 * FileUpload Component
 * --------------------
 * Uploads a file (e.g., .docx, .pdf, .txt) for a given note.
 * Uses: POST /files/upload with multipart/form-data
 * Props:
 *   - noteId: string (required)
 */
export default function FileUpload({ noteId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
    if (!noteId) {
      setMessage("No note selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("noteId", noteId);

    try {
      setUploading(true);
      const res = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "File uploaded successfully!");
    } catch (err) {
      setMessage("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="fileupload-container">
      <div className="fileupload-inputs">
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          accept=".docx,.pdf,.txt,.md"
          className="file-input"
        />
        <button
          onClick={handleUpload}
          className="btn btn-primary upload-btn"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}
