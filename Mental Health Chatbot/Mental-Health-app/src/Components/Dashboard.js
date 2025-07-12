// src/Components/Dashboard.js
import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';



const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">Serenio</div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/DashboardHome">Home</a></li>
            <li><a href="/Professionals">Professionals</a></li>
            <li><a href="/SentimentAnalysis">Sentiment Analysis</a></li>
            <li><a href="/profile">Profile setting</a></li>
            <li><Link to="/Index">Back to Home</Link></li>
          </ul>

        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Monitor user activities and manage system logs</p>
        </div>

        <div className="dashboard-cards">
          <div className="card">
            <p>Total Users</p>
            <h2>1,248</h2>
          </div>
          <div className="card">
            <p>Active Sessions</p>
            <h2>342</h2>
          </div>
          <div className="card">
            <p>Today's Actions</p>
            <h2>89</h2>
          </div>
          <div className="card">
            <p>System Health</p>
            <h2 className="success">98.5%</h2>
          </div>
        </div>

        <div className="activity-section">
          <div className="section-header">
            <h3>Activity Logs</h3>
            <div className="actions">
              <input type="text" placeholder="Search logs..." />
              <select><option>All Roles</option></select>
              <select><option>All Actions</option></select>
              <button className="export-btn">Export</button>
            </div>
          </div>

          <table className="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Sarah Johnson</strong><br />sarah@example.com
                </td>
                <td><span className="badge admin">Admin</span></td>
                <td>User Created</td>
                <td>2024-01-15 14:30:22</td>
                <td><span className="status success">Success</span></td>
              </tr>
              <tr>
                <td>
                  <strong>Mike Chen</strong><br />mike@example.com
                </td>
                <td><span className="badge user">User</span></td>
                <td>Login</td>
                <td>2024-01-15 14:25:18</td>
                <td><span className="status success">Success</span></td>
              </tr>
              <tr>
                <td>
                  <strong>Emma Davis</strong><br />emma@example.com
                </td>
                <td><span className="badge moderator">Moderator</span></td>
                <td>Data Updated</td>
                <td>2024-01-15 14:20:45</td>
                <td><span className="status success">Success</span></td>
              </tr>
              <tr>
                <td>
                  <strong>John Smith</strong><br />john@example.com
                </td>
                <td><span className="badge user">User</span></td>
                <td>Failed Login</td>
                <td>2024-01-15 14:15:32</td>
                <td><span className="status failed">Failed</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="user-management">
          <div className="section-header">
            <h3>User Management</h3>
            <div className="actions">
              <input type="text" placeholder="Search users..." />
              <select><option>All Status</option></select>
              <button className="add-user">+ Add User</button>
            </div>
          </div>

          <table className="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Last Active</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Lisa Wang</strong><br />lisa@example.com
                </td>
                <td><span className="badge admin">Admin</span></td>
                <td>2 hours ago</td>
                <td><span className="status active">Active</span></td>
                <td><span className="action-btn">Edit</span> <span className="action-btn danger">Suspend</span></td>
              </tr>
              <tr>
                <td>
                  <strong>Alex Rodriguez</strong><br />alex@example.com
                </td>
                <td><span className="badge user">User</span></td>
                <td>1 day ago</td>
                <td><span className="status active">Active</span></td>
                <td><span className="action-btn">Edit</span> <span className="action-btn danger">Suspend</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;