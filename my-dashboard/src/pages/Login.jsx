import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath && redirectPath !== "/login") {
      console.log("Found redirect path:", redirectPath);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login({ email, password });
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
      
      // Verify JWT token was stored
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("Authentication failed - No JWT token generated");
      }

      // Redirect based on role
      if (loggedInUser.role === "admin") {
        if (redirectPath && redirectPath.includes("/admin")) {
          navigate(redirectPath);
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        navigate(redirectPath || "/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        <form onSubmit={submit}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}