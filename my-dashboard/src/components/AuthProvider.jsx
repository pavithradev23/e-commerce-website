import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

 
  const getUsers = () =>
    JSON.parse(localStorage.getItem("users") || "[]");

  const saveUsers = (users) =>
    localStorage.setItem("users", JSON.stringify(users));


  const register = async ({ name, email, password, role }) => {
    const users = getUsers();

    if (users.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser = { name, email, password, role };
    saveUsers([...users, newUser]);

    setUser({ name, email, role });
  };


  const login = async ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    throw new Error("Invalid email or password");
  }

  setUser(foundUser);
  localStorage.setItem("user", JSON.stringify(foundUser));

  return foundUser; // 🔥 VERY IMPORTANT
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
