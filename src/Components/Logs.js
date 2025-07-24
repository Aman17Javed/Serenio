import React, { useState, useEffect } from "react";
import axios from "axios"; // ✅ Axios added
import "./Logs.css";
import Loader from "./Loader"; // ✅ Import the loader
import { toast } from 'react-toastify'; // Import toast

const statusColor = {
  Success: "status-success",
  Error: "status-error",
  Warning: "status-warning",
};

export default function SystemMonitoringLogs() {
  const [logsData, setLogsData] = useState([]); // ✅ dynamic data
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // New state for search loading
  const [searchTerm, setSearchTerm] = useState(""); // New state for search bar

  useEffect(() => {
    // ✅ Replace with your real API endpoint
    axios.get("https://your-api.com/api/logs")
      .then((res) => {
        setLogsData(res.data); // expecting array of log objects
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      // Simulate search API call (replace with your actual endpoint)
      const res = await axios.get(`https://your-api.com/api/logs?search=${searchTerm}`);
      setLogsData(res.data);
      if (res.data.length > 0) {
        toast.success('Search completed successfully! Logs found.');
      } else {
        toast.info('No logs found for the search term.');
      }
      setSearch(searchTerm); // Update filtered logs with search term
    } catch (err) {
      console.error("Error searching logs:", err);
      toast.error('Failed to search logs. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const filteredLogs = logsData.filter((log) =>
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="logs-container">
      <h1 className="logs-title">System Monitoring Logs</h1>
      <p className="logs-subtitle">Monitor real-time system activities and user interactions</p>

      <div className="logs-filters">
        <select>
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
        </select>

        <select>
          <option>All Levels</option>
          <option>Info</option>
          <option>Error</option>
        </select>

        <select>
          <option>All Modules</option>
          <option>Authentication</option>
          <option>Reports</option>
        </select>

        <div className="search-log-bar">
          <input
            type="text"
            placeholder="Search logs by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? <Loader size={15} color="#fff" /> : "Search Log"}
          </button>
        </div>
      </div>

      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td className={statusColor[log.status]}>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}