// src/pages/TaskPage.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./TaskPage.css";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all tasks
const fetchTasks = async () => {
  try {
    setLoading(true);
    const res = await api.get("/tasks");
    console.log("Tasks fetched:", res.data); 
    setTasks(res.data);
    setLoading(false);
  } catch (err) {
    console.error("Fetch error:", err.response || err);
    setError("Failed to load tasks");
    setLoading(false);
  }
};


  // Create a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await api.post("/tasks", {
        title: newTask,
        status: "pending",
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
    } catch (err) {
      setError("Error creating task");
    }
  };

  // Toggle task completion
  const toggleTask = async (task) => {
    try {
      const updated = {
        ...task,
        status: task.status === "completed" ? "pending" : "completed",
      };
      await api.put(`/tasks/${task._id}`, updated);
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
    } catch (err) {
      setError("Error updating task");
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError("Error deleting task");
    }
  };
useEffect(() => {
  fetchTasks();
}, []);
  return (
    <div className="taskpage-container">
      <Navbar />
      <div className="taskpage-content">
        <h1 className="taskpage-title">📅 Your Study Planner</h1>

        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Add a new study task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            + Add Task
          </button>
        </form>

        {loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="empty-text">
            You don’t have any tasks yet. Create one to stay productive 💪
          </p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${
                  task.status === "completed" ? "completed" : ""
                }`}
              >
                <div className="task-info">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => toggleTask(task)}
                  />
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === task._id
                            ? { ...t, title: e.target.value }
                            : t
                        )
                      )
                    }
                    onBlur={async () => {
                      try {
                        await api.put(`/tasks/${task._id}`, {
                          title: task.title,
                          status: task.status,
                        });
                      } catch (err) {
                        setError("Error saving task");
                      }
                    }}
                    className="task-title"
                  />
                </div>
                <button
                  className="btn-icon delete"
                  onClick={() => deleteTask(task._id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
