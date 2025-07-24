import React, { useEffect, useState } from 'react';
import './Professionals.css';
import api from '../api/axios';
import Loader from './Loader'; // ✅ Spinner component
import { toast } from 'react-toastify'; // Import toast

function About() {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false); // ✅ New State
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const fetchPsychologists = async () => {
    try {
      const res = await api.get('/api/psychologists');
      setPsychologists(res.data);
    } catch (err) {
      setError("Failed to load professionals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setFilterLoading(true);
    try {
      // Simulate filtering (replace with actual filter API call if needed)
      const res = await api.get('/api/psychologists');
      const filteredPsychologists = res.data;

      // Check availability among filtered psychologists
      const available = filteredPsychologists.some(psych => psych.availability.toLowerCase() === 'available');
      if (available) {
        toast.success('Professional(s) available!');
      } else {
        toast.error('No professionals available at the moment.');
      }

      setPsychologists(filteredPsychologists);
    } catch (err) {
      console.error("Filter error", err);
      toast.error('Error filtering professionals.');
    } finally {
      setFilterLoading(false);
    }
  };

  return (
    <div className="about-container">
      <h2>Find Your Mental Health Professional</h2>
      <p>
        Connect with licensed psychologists who understand your unique needs.<br />
        Take the first step towards better mental health today.
      </p>

      <input className="search-bar" placeholder="Search by name or specialization..." />
      
      {/* ✅ Filter Button with Loader */}
      <button className="filter-button" onClick={handleFilter} disabled={filterLoading}>
        {filterLoading ? <Loader size={15} color="#fff" /> : "Filter"}
      </button>

      {/* ✅ Loader on page load */}
      {loading ? (
        <div className="loader-wrapper">
          <Loader size={40} />
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="psychologist-list">
          {psychologists.map((psych, index) => (
            <div className="psychologist-card" key={index}>
              <h3>{psych.name}</h3>
              <p>{psych.specialization}</p>
              <p>⭐ {psych.rating} ({psych.reviews} reviews)</p>
              <p>{psych.experience} experience • {psych.availability}</p>
              <button className="book-button">Book Appointment</button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <button className="load-more">Load More Psychologists</button>
      )}
    </div>
  );
}

export default About;