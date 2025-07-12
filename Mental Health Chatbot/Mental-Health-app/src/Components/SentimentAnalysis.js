import React from "react";
import "./SentimentAnalysis.css";

const SentimentReport = () => {
  return (
    <div className="report-container">
      <h1 className="report-title">Sentiment Analysis Report</h1>
      <p className="report-subtitle">
        Your emotional journey summary for the past 30 days<br />
        <span className="report-date">Generated on March 15, 2024</span>
      </p>

      {/* Sentiment Distribution */}
      <div className="card">
        <h2 className="section-title">Sentiment Distribution</h2>
        <p className="section-subtitle">Overview of your emotional patterns</p>
        <img
          src="/sentiment-chart-placeholder.png"
          alt="Sentiment Chart"
          className="chart-image"
        />
        <div className="stats-row">
          <p>Positive: 62%</p>
          <p>Neutral: 28%</p>
          <p>Negative: 10%</p>
        </div>
      </div>

      {/* Session Summary */}
      <div className="grid-two">
        <div className="card">
          <h2 className="section-title">🧠 Overall Tone Analysis</h2>
          <p className="section-text">
            Your recent sessions show a predominantly positive emotional state
            with moments of introspection. There’s been a noticeable improvement
            in emotional regulation over the past two weeks, with stress levels
            decreasing by 23% compared to the previous period.
          </p>
        </div>
        <div className="card">
          <h2 className="section-title">📊 Session Frequency</h2>
          <ul className="section-list">
            <li>Total Sessions: <strong>24</strong></li>
            <li>Average per Week: <strong>6</strong></li>
            <li>Longest Streak: <strong>8 days</strong></li>
            <li>Most Active Time: <strong>Evening</strong></li>
          </ul>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card">
        <h2 className="section-title">🔍 Key Insights</h2>
        <div className="grid-three">
          <div className="insight-box green">
            <strong>Improvement:</strong><br />
            Stress levels decreased by 23% this month
          </div>
          <div className="insight-box blue">
            <strong>Consistency:</strong><br />
            Regular evening sessions show best results
          </div>
          <div className="insight-box purple">
            <strong>Milestone:</strong><br />
            Achieved 8-day consecutive streak
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="button-wrapper">
        <button className="download-button">📄 Download Report (PDF)</button>
      </div>

      <p className="footer-text">
        Complete report with detailed analysis and recommendations
      </p>
    </div>
  );
};

export default SentimentReport;