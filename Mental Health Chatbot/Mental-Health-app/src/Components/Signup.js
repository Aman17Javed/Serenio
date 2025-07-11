import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import "./Signup.css";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = () => {
    if (password.length >= 8) return "Strong";
    if (password.length >= 5) return "Moderate";
    return "Weak";
  };

  const handleSignup = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fullName.trim().length < 3) {
      setError("Full name must be at least 3 characters.");
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

    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="avatar-icon">👤</div>
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Join us today and get started</p>

        {/* Full Name */}
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

        {/* Email */}
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

        {/* Phone */}
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

        {/* Password */}
        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            className="signup-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Password strength */}
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


        {/* Terms */}
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
          </span>
        </div>

        {/* Error */}
        {error && <p className="error-message">{error}</p>}

        {/* Button */}
        <button className="signup-button" onClick={handleSignup}>
          Create Account
        </button>

        <p className="signin-link">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;