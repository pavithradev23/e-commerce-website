import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
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

    const newUser = { 
      id: Date.now().toString(),
      name, 
      email, 
      password, 
      role,
      createdAt: new Date().toISOString()
    };
    
    saveUsers([...users, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    
    return userWithoutPassword;
  };

  const login = async ({ email, password }) => {
    const users = getUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);

    return userWithoutPassword;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

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