import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("shopUser");
    return saved ? JSON.parse(saved) : null;
  });

  function saveAuth(data) {
    localStorage.setItem("shopToken", data.token);
    localStorage.setItem("shopUser", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    saveAuth(data);
    return data.user;
  }

  async function register(values) {
    const { data } = await api.post("/auth/register", values);
    saveAuth(data);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("shopToken");
    localStorage.removeItem("shopUser");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === "admin", login, register, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
