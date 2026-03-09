// src/pages/NotePage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import MindMap from "../components/MindMap";
import FileUpload from "../components/FileUpload";
import "./NotePage.css";

export default function NotePage() {
  const { id: noteId } = useParams();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState(null); // structured object
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mindmapError, setMindmapError] = useState(false);

  const saveTimer = useRef(null);

  // Fetch note data
  const fetchNote = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/notes/${noteId}`);
      setNote(res.data);
      setContent(res.data.content || "");
      if (res.data.aiSummary) setSummary(res.data.aiSummary);
      setLoading(false);
    } catch (err) {
      setError("Failed to load note");
      setLoading(false);
    }
  };

  // Fetch mindmap nodes
  // Fetch mindmap nodes
// Fetch mindmap nodes
// Fetch mindmap nodes
const fetchNodes = async () => {
  try {
    const res = await api.get(`/ai/nodes/${noteId}`); // Use AI route instead
    console.log("Fetched nodes:", res.data);
    // Handle different response formats
    const nodesData = res.data.data || res.data || [];
    setNodes(nodesData);
  } catch (err) {
    console.log("No nodes yet or fetch error:", err.message);
    setNodes([]);
  }
};


  useEffect(() => {
    fetchNote();
    fetchNodes();
  }, [noteId]);

  // Auto-save logic (debounced)
  const autoSave = async (updatedContent) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        setSaving(true);
        const safeContent = updatedContent.replace(/\\/g, "\\\\"); // escape backslashes
        await api.put(`/notes/${noteId}`, { content: safeContent });
        setSaving(false);
      } catch {
        setSaving(false);
      }
    }, 2000);
  };

  // Handle content change
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    // Invalidate summary whenever user edits the note
    setSummary(null);
    autoSave(newContent);
  };

  // Generate AI summary
  const handleGenerateSummary = async () => {
  if (!content.trim()) {
    setSummary({ error: "Please write some content before generating a summary." });
    return;
  }

  try {
    setSummary({ loading: true });
    const res = await api.post(`/ai/summary/${noteId}`);
    let summaryData = res.data.summary;

    // Parse string if necessary
    if (typeof summaryData === "string") {
      try {
        summaryData = JSON.parse(summaryData);
      } catch (err) {
        summaryData = { heading: "Summary", body: summaryData, importantPoints: [], examples: [] };
      }
    }

    setSummary(summaryData);
  } catch (err) {
    setSummary({ error: err.response?.data?.message || "Error generating summary." });
    console.error(err);
  }
};

  // Generate Mindmap
  // Temporary test function
// Generate Mindmap
const handleGenerateMindmap = async () => {
  try {
    const res = await api.post(`/ai/nodes/${noteId}`);
    console.log("AI nodes response:", res.data);
    setNodes(res.data.data || res.data || []);
  } catch (err) {
    console.error("Error generating mindmap", err);
    setError("Failed to generate mindmap. Please try again.");
  }
};

  if (loading) return <p className="loading-text">Loading note...</p>;

  return (
    <div className="notepage-container">
      <Navbar />

      <div className="notepage-content">
        <h1 className="note-title">{note?.title}</h1>

        <div className="editor-section">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your note here..."
          />
          {saving && <p className="autosave-text">Saving...</p>}
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={handleGenerateSummary}>
            🧠 Generate Summary
          </button>
          <button className="btn btn-secondary" onClick={handleGenerateMindmap}>
            🕸️ Generate Mindmap
          </button>
        </div>

        <div className="ai-section">
          <div className="summary-section">
            <h2>AI Summary</h2>
            <div className="summary-box">
              {summary ? (
                summary.loading ? (
                  <p>Generating summary...</p>
                ) : summary.error ? (
                  <p>{summary.error}</p>
                ) : (
                  <div>
                    <h3>{summary.heading}</h3>
                    <p>{summary.body}</p>

                    {summary.importantPoints?.length > 0 && (
                      <div>
                        <h4>Important Points:</h4>
                        <ul>
                          {summary.importantPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {summary.examples?.length > 0 && (
                      <div>
                        <h4>Examples:</h4>
                        <ul>
                          {summary.examples.map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <p>No summary yet.</p>
              )}
            </div>
          </div>

          <div className="mindmap-section">
            <h2>Mindmap</h2>
            {nodes.length > 0 ? (
              <MindMap nodes={nodes} />
            ) : (
              <p className="no-mindmap">No mindmap generated yet.</p>
            )}
          </div>
        </div>
<div className="mindmap-section">
  <h2>Mindmap</h2>
  {mindmapError ? (
    <div className="error-message">
      Mindmap failed to load. Please try refreshing the page.
    </div>
  ) : nodes.length > 0 ? (
    <MindMap nodes={nodes} />
  ) : (
    <p className="no-mindmap">No mindmap generated yet.</p>
  )}
</div>
        <div className="upload-section">
          <h3>Upload Related File</h3>
          <FileUpload noteId={noteId} />
        </div>
      </div>
    </div>
  );
}
