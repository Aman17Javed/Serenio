import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Mental Health Chatbot</div>

      <ul className="navbar-links">
        <li>
          <Link to="/signup" className="nav-button signup-btn">Sign Up</Link>
        </li>
        <li>
          <Link to="/login" className="nav-button login-btn">Login</Link>
        </li> 
        
        <li>
          <Link to="/Dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/chatbot">chatbot</Link>
        </li>
        <li>
          <Link to="/PaymentForm">Payment</Link>
        </li>
       
      </ul>
    </nav>
  );
};

export default Navbar;
