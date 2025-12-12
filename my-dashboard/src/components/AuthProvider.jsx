import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); 
  }, []);

  const login = async ({ email, password }) => {
    const fakeUser = { id: 1, email };
    setUser(fakeUser);
    localStorage.setItem("user", JSON.stringify(fakeUser));
    return fakeUser;
  };

  const register = async ({ name, email, password }) => {
    const fakeUser = { id: 2, name, email };
    setUser(fakeUser);
    localStorage.setItem("user", JSON.stringify(fakeUser));
    return fakeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = { user, login, register, logout, isAuthenticated: !!user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

