import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import api from "../api/axios";
import Loader from "./Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showToast = (message) => {
    return new Promise((resolve) => {
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        onClose: resolve,
      });
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return; // Prevent multiple clicks

    // Check errors in sequence, show only the first one
    if (!email.trim()) {
      await showToast("Email is required.");
      return;
    }

    if (!isValidEmail(email)) {
      await showToast("Enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      await showToast("Password is required.");
      return;
    }

    const rememberMe = document.getElementById("rememberMeCheckbox").checked;
    if (!rememberMe) {
      await showToast("Please check 'Remember me' before logging in.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("token", response.data.token);

      await new Promise((resolve) => {
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
          onClose: resolve,
        });
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      await showToast(message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Loader />;

  return (
    <div className="login-wrapper">
      <ToastContainer theme="colored" position="top-center" autoClose={5000} />

      <div className="login-card">
        <div className="login-logo-container">
          <img src={require("../assets/pic.png")} alt="pic" className="pic" />
        </div>

        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <input
              type="email"
              className="login-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="password-wrapper input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" id="rememberMeCheckbox" /> Remember me
            </label>
            <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <button type="submit" className="login-button" disabled={loading}>
              Log In
            </button>
          )}
        </form>

        <div className="divider">or</div>

        <button className="social-button google">
          <FaGoogle className="social-icon" /> Continue with Google
        </button>

        <button className="social-button facebook">
          <FaFacebookF className="social-icon" /> Continue with Facebook
        </button>

        <p className="signup-text">
          Don’t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;