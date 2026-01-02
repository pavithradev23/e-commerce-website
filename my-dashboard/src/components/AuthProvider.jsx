import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = "http://localhost:5000/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("current_user");
    const token = localStorage.getItem("jwt_token");
    
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem("current_user");
        localStorage.removeItem("jwt_token");
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("current_user");
      localStorage.removeItem("jwt_token");
    }
  }, [user]);

  const register = async ({ name, email, password }) => {
  setLoading(true);
  setError(null);
  
  try {
    console.log("🔍 Sending registration request to:", `${API_BASE_URL}/auth/register`);
    console.log("📤 Request body:", { name, email, password: "***" });
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    console.log("📥 Response status:", response.status);
    const data = await response.json();
    console.log("📥 Response data:", data);

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    console.log("✅ Storing JWT token:", data.token ? "Token received" : "No token");
    console.log("✅ Storing user:", data.user);
    
    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("current_user", JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  } catch (error) {
    console.error("❌ Registration catch error:", error);
    setError(error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      localStorage.setItem("jwt_token", data.token);
      localStorage.setItem("current_user", JSON.stringify(data.user));
      setUser(data.user);

      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("current_user");
      localStorage.removeItem("jwt_token");
    }
  };

  const validateToken = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      return false;
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: getAuthHeader(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem("current_user", JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
    return null;
  };

  // ✅ Better: Keep as functions for real-time updates
  const isAuthenticated = () => {
    const token = localStorage.getItem("jwt_token");
    return !!token && !!user;
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getToken = () => {
    return localStorage.getItem("jwt_token");
  };

  const clearError = () => {
    setError(null);
  };

  const fetchAdminStats = async () => {
    if (!isAdmin()) {
      throw new Error("Admin access required");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: "GET",
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch admin stats");
      }

      return data.stats;
    } catch (error) {
      throw error;
    }
  };

  const fetchAdminProducts = async () => {
    if (!isAdmin()) {
      throw new Error("Admin access required");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "GET",
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch admin products");
      }

      return data.products;
    } catch (error) {
      throw error;
    }
  };

  const fetchAllUsers = async () => {
    if (!isAdmin()) {
      throw new Error("Admin access required");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      return data.users;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("jwt_token");
      if (token && !user) {
        await fetchCurrentUser();
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: isAuthenticated(), // Returns boolean
    isAdmin: isAdmin(),                 // Returns boolean
    register,
    login,
    logout,
    getAuthHeader,
    getToken,
    validateToken,
    fetchCurrentUser,
    fetchAdminStats,
    fetchAdminProducts,
    fetchAllUsers,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}