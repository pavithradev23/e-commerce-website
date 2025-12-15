import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  // Persist logged-in user
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  // Load registered users
  const getUsers = () =>
    JSON.parse(localStorage.getItem("users") || "[]");

  const saveUsers = (users) =>
    localStorage.setItem("users", JSON.stringify(users));

  // REGISTER
  const register = async ({ name, email, password, role }) => {
    const users = getUsers();

    if (users.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser = { name, email, password, role };
    saveUsers([...users, newUser]);

    setUser({ name, email, role });
  };

  // LOGIN
  const login = async ({ email, password }) => {
    const users = getUsers();

    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!existingUser) {
      throw new Error("Invalid email or password");
    }

    setUser({
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
