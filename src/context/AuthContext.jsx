import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("studyos_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("studyos_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("studyos_token", token);
    } else {
      localStorage.removeItem("studyos_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("studyos_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("studyos_user");
    }
  }, [user]);

  async function signup(credentials) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.signup(credentials);
      setToken(data.access_token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      setToken(data.access_token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
