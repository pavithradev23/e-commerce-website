import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const JWT_SECRET = 'yozi-shop-demo-jwt-secret-2024';

const createToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) 
  }));
  const signature = btoa(JWT_SECRET);
  return `${header}.${encodedPayload}.${signature}`;
};

const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    const expectedSignature = btoa(JWT_SECRET);
    if (parts[2] !== expectedSignature) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("jwt_token");
    const savedUser = localStorage.getItem("user");
    
    if (token && savedUser) {
      const decoded = verifyToken(token);
      if (decoded) {
        return JSON.parse(savedUser);
      } else {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user");
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt_token");
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
      role: role || "user",
      createdAt: new Date().toISOString()
    };
    
    saveUsers([...users, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    const token = createToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });
    
    localStorage.setItem("jwt_token", token);
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
    
    const token = createToken({
      userId: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name
    });
    
    localStorage.setItem("jwt_token", token);
    setUser(userWithoutPassword);

    return userWithoutPassword;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt_token");
  };

   
  const isAuthenticated = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return false;
    
    const decoded = verifyToken(token);
    return decoded !== null;
  };

  const isAdmin = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return false;
    
    const decoded = verifyToken(token);
    return decoded && decoded.role === "admin";
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };


  const getToken = () => {
    return localStorage.getItem("jwt_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isAuthenticated(),
        isAdmin: isAdmin(),
        loading,
        login,
        register,
        logout,
        getAuthHeader,
        getToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}