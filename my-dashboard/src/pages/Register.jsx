import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); 
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await register({
        name,
        email,
        password,
        role, 
      });
      
   
      if (role === "admin") {
        nav("/admin");
      } else {
        nav("/");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>

        <form onSubmit={submit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
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

        
          <label>
            Account Type
            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginRight: 8 }}
                />
                Regular User
              </label>
              <label style={{ display: 'block' }}>
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ marginRight: 8 }}
                />
                Admin
              </label>
            </div>
          </label>

          <button type="submit">Register</button>
        </form>

        <p style={{ marginTop: 12 }}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}