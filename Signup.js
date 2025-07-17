import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../api/axios";
import "./Signup.css";
import Loader from "./Loader";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getPasswordStrength = () => {
    if (password.length >= 8) return "Strong";
    if (password.length >= 5) return "Moderate";
    return "Weak";
  };

  const handleSignup = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[A-Za-z\s]+$/;

    if (fullName.trim().length < 3) {
      setError("Full name must be at least 3 characters.");
      return;
    }
    if (!namePattern.test(fullName)) {
      setError("Full name must only contain letters and spaces.");
      return;
    }
    if (!emailPattern.test(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!phone.trim().match(/^\d{10,15}$/)) {
      setError("Enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    setSignupLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/signup", {
        name: fullName,
        email,
        phone,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const handleSignInClick = () => {
    setSigningIn(true);
    setTimeout(() => {
      navigate("/login");
    }, 800);
  };

  if (initialLoading) {
    return (
      <div className="signup-wrapper">
        <Loader size={32} />
      </div>
    );
  }

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="avatar-icon">👤</div>
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Join us today and get started</p>

        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            className="signup-input"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            className="signup-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <FaPhoneAlt className="input-icon" />
          <input
            type="text"
            className="signup-input"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            className="signup-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="password-strength">
          Password strength: {getPasswordStrength()}
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="signup-input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button
          className="signup-button"
          onClick={handleSignup}
          disabled={signupLoading}
        >
          {signupLoading ? (
            <>
              <Loader size={18} color="#fff" />
              &nbsp;Creating...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="signin-link">
          Already have an account?{" "}
          <span
            onClick={handleSignInClick}
            className="link"
            style={{ cursor: "pointer" }}
          >
            {signingIn ? (
              <>
                <Loader size={14} color="#000" /> &nbsp;Redirecting...
              </>
            ) : (
              "Sign in"
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;