import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="avatar-icon">👤</div>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please sign in to your account</p>

        <input
          type="email"
          className="login-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="login-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>

        <div className="divider">or</div>

        <button className="social-button google">
          <FaGoogle className="social-icon" />
          Continue with Google
        </button>

        <button className="social-button facebook">
          <FaFacebookF className="social-icon" />
          Continue with Facebook
        </button>

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;