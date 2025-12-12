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

  // ------------------ LOGIN (MOCK DATA) ------------------
  const login = async ({ email, password }) => {
    // MOCK LOGIC:
    // If email contains "admin" → admin
    // otherwise → user
    const role = email.includes("admin") ? "admin" : "user";

    const fakeUser = {
      id: Date.now(),
      email,
      role,
    };

    setUser(fakeUser);
    localStorage.setItem("user", JSON.stringify(fakeUser));
    return fakeUser;
  };

  // ------------------ REGISTER (MOCK) ------------------
  const register = async ({ name, email, password }) => {
    const fakeUser = {
      id: Date.now(),
      name,
      email,
      role: "user", // All registered users are normal users
    };

    setUser(fakeUser);
    localStorage.setItem("user", JSON.stringify(fakeUser));
    return fakeUser;
  };

  // ------------------ LOGOUT ------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
