// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Components/Navbar"; // Import Navbar
import Index from "./Components/Index"; // Import Index page
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Signup from './Components/Signup';  
import Chat from './Components/Chat';
import SentimentAnalysis from "./Components/SentimentAnalysis"; // Create this file for Contact Us page
import Professionals from "./Components/Professionals"; // Create this file for About Us page
import PaymentForm from "./Components/PaymentForm"; // Create this file for Help page
import Chatbot from "./Components/Chatbot";
import Profile from "./Components/Profile";
import DashboardHome from './Components/DashboardHome';
const App = () => {
  return (
      <>
   <Router>
  <Navbar /> {/* Shown on all pages */}


  <Routes>
    <Route path="/" element={<Index/>} /> {/* Home route; can add redirect or home content */}
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/login" element={<Login />} />
    <Route path="/chat" element={<Chat />} />
    <Route path="/SentimentAnalysis" element={<SentimentAnalysis />} />
    <Route path="/Professionals" element={<Professionals />} />
    <Route path="/PaymentForm" element={<PaymentForm />} />
    <Route path="/Chatbot" element={<Chatbot />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/DashboardHome" element={<DashboardHome />} />
  </Routes>
</Router>

   
    </>
  );
};

export default App;
