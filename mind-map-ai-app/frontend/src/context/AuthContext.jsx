// src/context/AuthContext.jsx
/**
 * AuthContext for MindMapAI
 * - Provides: user, isAuthenticated, loading, error
 * - Actions: login({email, password}), register({username,email,password}), logout()
 * - Persists token in localStorage as 'token'
 *
 * Notes:
 * - Backend /auth/login returns { message, token }
 * - Backend /auth/register returns { message, userId }
 *   After register we automatically call login() to obtain token so frontend
 *   can proceed to protected routes immediately.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // user: minimal info we store (email). We do not decode token here.
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false); // API call loading
  const [error, setError] = useState(null);

  useEffect(() => {
    // Keep user persisted in localStorage so refresh keeps UI state
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }
  }, [user]);

  // Helper: set token and minimal user info
  const handleSetToken = (token, userInfo = null) => {
    try {
      localStorage.setItem("token", token);
    } catch (e) {
      // ignore
    }
    if (userInfo) setUser(userInfo);
  };
 
  // LOGIN
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.token;
      if (!token) throw new Error("No token returned from server");

      // Save token and minimal user info
      handleSetToken(token, { email });

      setLoading(false);
      navigate("/dashboard");
      return res.data;
    } catch (err) {
      setLoading(false);
      // Normalize message
      const msg =
        err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
      throw err;
    }
  };

  // REGISTER -> After successful registration, auto-login to get token
  const register = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // Backend returns userId only. Immediately call login to retrieve token.
      await login({ email, password });
      // login will navigate to /dashboard and set token/user
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const msg =
        err?.response?.data?.message || err?.message || "Registration failed";
      setError(msg);
      throw err;
    }
  };

  // LOGOUT
  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }
    setUser(null);
    // Redirect to login
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated: Boolean(localStorage.getItem("token")),
    loading,
    error,
    login,
    register,
    logout,
    setError, // expose for components to clear errors if needed
    setUser, // exposed for potential profile fetching updates
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for easy usage in components
export function useAuth() {
  return useContext(AuthContext);
}
