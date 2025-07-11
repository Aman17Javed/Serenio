import React, { useState } from "react";
import "./ProfileSettings.css";

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    language: "English",
    quickLang: "English",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-container">
      <h2 className="heading">&larr; Profile Settings</h2>

      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Sarah Johnson"
            className="avatar"
          />
          <h3>Sarah Johnson</h3>
          <p className="subtext">Member since 2023</p>
        </div>

        <form className="profile-form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Language
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option>English</option>
              <option>Urdu</option>
              <option>French</option>
            </select>
          </label>

          <div className="lang-switch">
            <span>Quick Language Switch</span>
            <div className="toggle">
              <button
                type="button"
                className={
                  formData.quickLang === "English" ? "active" : ""
                }
                onClick={() =>
                  setFormData((prev) => ({ ...prev, quickLang: "English" }))
                }
              >
                English
              </button>
              <button
                type="button"
                className={
                  formData.quickLang === "اردو" ? "active" : ""
                }
                onClick={() =>
                  setFormData((prev) => ({ ...prev, quickLang: "اردو" }))
                }
              >
                اردو
              </button>
            </div>
          </div>

          <div className="password-section">
            <div>
              <label>Password</label>
              <p className="note">Last updated 3 months ago</p>
            </div>
            <button className="reset-btn" type="button">
              Reset Password
            </button>
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              ✓ Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="additional-settings">
        <div className="setting-item">🔔 Notifications</div>
        <div className="setting-item">🔒 Privacy & Security</div>
        <div className="setting-item">❓ Help & Support</div>
      </div>
    </div>
  );
};

export default ProfileSettings;