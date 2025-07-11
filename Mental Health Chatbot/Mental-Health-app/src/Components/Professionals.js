import React from 'react';
import './Professionals.css';

const psychologists = [
  {
    name: "Dr. Sarah Johnson",
    specialization: "Anxiety & Depression Specialist",
    rating: 4.9,
    reviews: 127,
    experience: "15+ years",
    availability: "Available today"
  },
  {
    name: "Dr. Michael Chen",
    specialization: "Cognitive Behavioral Therapy",
    rating: 4.7,
    reviews: 89,
    experience: "12+ years",
    availability: "Next available: Tomorrow"
  },
  {
    name: "Dr. Emily Rodriguez",
    specialization: "Family & Relationship Therapy",
    rating: 5.0,
    reviews: 203,
    experience: "18+ years",
    availability: "Available today"
  },
  {
    name: "Dr. James Wilson",
    specialization: "Trauma & PTSD Specialist",
    rating: 4.8,
    reviews: 165,
    experience: "20+ years",
    availability: "Next available: This week"
  },
  {
    name: "Dr. Lisa Thompson",
    specialization: "Child & Adolescent Psychology",
    rating: 4.9,
    reviews: 174,
    experience: "14+ years",
    availability: "Available today"
  },
  {
    name: "Dr. David Kumar",
    specialization: "Addiction & Recovery Counseling",
    rating: 4.8,
    reviews: 165,
    experience: "16+ years",
    availability: "Next available: Tomorrow"
  }
];

function About() {
  return (
    <div className="about-container">
      <h2>Find Your Mental Health Professional</h2>
      <p>Connect with licensed psychologists who understand your unique needs.<br />Take the first step towards better mental health today.</p>
      <input className="search-bar" placeholder="Search by name or specialization..." />
      <button className="filter-button">Filter</button>
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
      <button className="load-more">Load More Psychologists</button>
    </div>
  );
}

export default About;
