import React from "react";
import "./Index.css";
import mentalImage from "../assets/Mental.png"; // Ensure path is correct

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
        </div>
      </div>
    </div>
  );
};

export default Index;
