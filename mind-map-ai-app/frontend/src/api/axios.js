// src/api/axios.js
/**
 * Axios instance for MindMapAI frontend
 * - Base URL set to backend: http://localhost:5000/api
 * - Automatically attaches JWT stored in localStorage under "token"
 * - Handles global 401 response: clears token and redirects to /login
 */

import axios from "axios";

const api = axios.create({
  baseURL: "https://genai-bootcamp.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token before each request if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage errors in some environments
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler: if unauthorized, remove token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token expired/invalid -> remove and force login
      try {
        localStorage.removeItem("token");
      } catch (e) {}
      // Use window.location to force navigation from any context
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
