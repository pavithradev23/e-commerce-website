import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ✅ ADD THIS: Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");
      console.log("✅ Already authenticated, redirecting to:", redirectPath);
      navigate(redirectPath);
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath && redirectPath !== "/login") {
      console.log("Found redirect path:", redirectPath);
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ form: "" });

    if (!validateForm()) {
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login({
        email: formData.email,
        password: formData.password
      });
      
      // ✅ Check if login was successful
      if (!loggedInUser) {
        throw new Error("Login failed - no user returned");
      }

      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("Authentication failed - No JWT token generated");
      }

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");

      // ✅ Redirect based on role
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
      setErrors(prev => ({ 
        ...prev, 
        form: err.message || "Login failed. Please check your credentials." 
      }));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      !errors.email &&
      !errors.password &&
      !loading
    );
  };

  // ✅ Show loading while checking authentication
  if (authLoading) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Checking authentication...</p>
          </div>
        </div>
      </main>
    );
  }

  // ✅ Don't render login form if already authenticated
  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        
        {errors.form && (
          <div className="alert alert-error">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${touched.email && errors.email ? 'error-field' : ''}`}>
            <label htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'error-input' : ''}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
            {touched.email && errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className={`form-group ${touched.password && errors.password ? 'error-field' : ''}`}>
            <label htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && errors.password ? 'error-input' : ''}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            {touched.password && errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging In...
              </>
            ) : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}