import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";


export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[A-Z])/.test(password)) return "Must contain at least one uppercase letter";
    if (!/(?=.*[a-z])/.test(password)) return "Must contain at least one lowercase letter";
    if (!/(?=.*\d)/.test(password)) return "Must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Must contain at least one special character (@$!%*?&)";
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  // Handle input change
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

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === "";
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    };
    
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("🔍 Registration form submitted");
  
  if (!validateForm()) {
    console.log("❌ Form validation failed");
    const firstErrorField = document.querySelector(".error-field");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }
  
  console.log("✅ Form validation passed");
  console.log("📤 Sending registration data:", {
    name: formData.name,
    email: formData.email,
    // Don't log password for security
  });
  
  try {
    // ✅ SECURE: Only send name, email, password - NO ROLE!
    const user = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    console.log("✅ Registration successful, user:", user);
    console.log("✅ JWT Token:", localStorage.getItem("jwt_token"));
    console.log("✅ Current User:", localStorage.getItem("current_user"));
    
    navigate("/");
    
  } catch (err) {
    console.error("❌ Registration error:", err);
    setErrors(prev => ({ ...prev, form: err.message }));
  }
};

  // Check if form can be submitted
  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !loading
    );
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        
        {errors.form && (
          <div className="alert alert-error">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className={`form-group ${touched.name && errors.name ? 'error-field' : ''}`}>
            <label htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? 'error-input' : ''}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
            {touched.name && errors.name && (
              <div className="error-message">{errors.name}</div>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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
              placeholder="Create a strong password"
              required
              disabled={loading}
            />
            {touched.password && errors.password ? (
              <div className="error-message">{errors.password}</div>
            ) : (
              <small className="hint-text">
                Must be 8+ characters with uppercase, lowercase, number, and special character
              </small>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className={`form-group ${touched.confirmPassword && errors.confirmPassword ? 'error-field' : ''}`}>
            <label htmlFor="confirmPassword">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.confirmPassword && errors.confirmPassword ? 'error-input' : ''}
              placeholder="Re-enter your password"
              required
              disabled={loading}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
}