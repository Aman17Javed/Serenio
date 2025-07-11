// src/Components/DashboardHome.js
import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./DashboardHome.css";

const DashboardHome = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate function

  return (
    <div className="dashboard-home">
      {/* Greeting Banner */}
      <div className="welcome-banner">
        <h2>Welcome back, user 👋</h2>
        <p>How are you feeling today? Let's check in on your mental wellness journey.</p>
      </div>

      {/* Grid Sections */}
      <div className="dashboard-grid">

        {/* Mood Tracker */}
        <div className="mood-tracker card">
          <h3>Mood Tracker</h3>
          <div className="circle">
            <span className="percent">75%</span>
            <span className="status">Good</span>
          </div>
          <p>Your mood has improved by 15% this week!</p>
        </div>

        {/* Upcoming Appointments */}
        <div className="appointments card">
          <h3>Upcoming Appointments</h3>
          <div className="appointment">
            <p><strong>Dr. Sarah Wilson</strong><br /><span>Clinical Psychologist</span></p>
            <p>📅 Dec 28, 2024 | 🕑 2:00 PM</p>
            <button className="join-btn">Join Session</button>
          </div>
          <div className="appointment">
            <p><strong>Dr. Michael Chen</strong><br /><span>Therapist</span></p>
            <p>📅 Jan 3, 2025 | 🕥 10:30 AM</p>
            <button className="scheduled-btn">Scheduled</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions card">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button onClick={() => navigate("/chatbot")}>💬 Chat with Bot</button>
            <button onClick={() => navigate("/Professionals")}>📅 Book Appointment</button>
            <button onClick={() => navigate("/sentimentAnalysis")}>📊 Generate Report</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity card">
          <h3>Recent Activity</h3>
          <ul>
            <li>✅ Mood check completed <span>2 hours ago</span></li>
            <li>🧠 Chat session with AI <span>Yesterday</span></li>
            <li>🧘 Meditation completed <span>2 days ago</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
