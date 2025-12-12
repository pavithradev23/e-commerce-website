import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    // Assign role based on email (simple logic)
    const role = email === "admin@example.com" ? "admin" : "user";

    try {
      await login({ email, password, role });
      nav("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
