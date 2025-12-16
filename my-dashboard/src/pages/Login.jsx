import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
     const loggedInUser=await login({email,password});
     if(loggedInUser.role=== "admin"){
      nav("/admin/dashboard");
    } else{
      nav("/");
    }
  }catch (err) {
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
