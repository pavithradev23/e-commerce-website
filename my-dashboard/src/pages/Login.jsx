import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath && redirectPath !== "/login") {
      console.log("Found redirect path:", redirectPath);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loggedInUser = await login({ email, password });
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin"); 
      
      if (loggedInUser.role === "admin") {
        if (redirectPath && redirectPath.includes("/admin")) {
          nav(redirectPath);
        } else {
          nav("/admin/dashboard");
        }
      } else {
        nav(redirectPath || "/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={submit}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password123"
            />
          </label>

          <button type="submit">Login</button>
        </form>

        

        <p style={{ marginTop: 12 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}