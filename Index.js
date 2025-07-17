import React from "react";
import { Link } from "react-router-dom";
import "./Index.css";
import mentalImage from "../assets/Mental.png"; // Make sure this image exists in src/assets

const Index = () => {
  return (
    <div className="index-wrapper">
      <div className="hero-section">
        <img
          src={mentalImage}
          alt="Mental Health Chatbot Hero"
          className="hero-image"
        />
        <div className="hero-text">
          <h1 className="hero-title">MENTAL HEALTH CHATBOT</h1>
          <p className="hero-description">
            Mendora is a friendly AI that works like a talk therapist to help you uncover patterns and improve your mental health.
          </p>

          {/* ✅ Added CTA button */}
          <Link to="/chatbot">
            <button className="hero-button">Start Talking</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
