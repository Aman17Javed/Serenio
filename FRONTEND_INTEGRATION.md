# Frontend Integration Guide for Appointment System

## Backend API Base URL
```
http://localhost:5000/api/appointments
```

## Required Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. API Service Functions

Create a file `src/services/appointmentService.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/appointments';

// Create axios instance with default config
const appointmentAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
appointmentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
appointmentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Appointment API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const appointmentService = {
  // Book a new appointment
  bookAppointment: async (appointmentData) => {
    const response = await appointmentAPI.post('/book', appointmentData);
    return response.data;
  },

  // Get available time slots for a psychologist on a specific date
  getAvailableSlots: async (psychologistId, date) => {
    const response = await appointmentAPI.get('/available-slots', {
      params: { psychologistId, date }
    });
    return response.data;
  },

  // Get user's appointments
  getMyAppointments: async () => {
    const response = await appointmentAPI.get('/my-appointments');
    return response.data;
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId) => {
    const response = await appointmentAPI.put(`/cancel/${appointmentId}`);
    return response.data;
  },

  // Get specific appointment details
  getAppointment: async (appointmentId) => {
    const response = await appointmentAPI.get(`/${appointmentId}`);
    return response.data;
  },
};
```

---

## 2. React Components

### Appointment Booking Component
Create `src/components/AppointmentBooking.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import './AppointmentBooking.css';

const AppointmentBooking = ({ psychologistId, psychologistName, onBookingSuccess }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get available slots when date changes
  useEffect(() => {
    if (selectedDate && psychologistId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, psychologistId]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAvailableSlots(psychologistId, selectedDate);
      setAvailableSlots(data.availableSlots);
      setError('');
    } catch (err) {
      setError('Failed to fetch available slots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !psychologistId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const appointmentData = {
        psychologistId,
        date: selectedDate,
        timeSlot: selectedTime,
        reason: reason.trim() || undefined,
      };

      const result = await appointmentService.bookAppointment(appointmentData);
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      setAvailableSlots([]);
      
      // Notify parent component
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
      
      alert('Appointment booked successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Generate date options (next 30 days)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  return (
    <div className="appointment-booking">
      <h2>Book Appointment with {psychologistName}</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="date">Select Date *</label>
          <select
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Choose a date</option>
            {generateDateOptions().map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="time">Select Time *</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            disabled={!selectedDate || loading}
          >
            <option value="">Choose a time</option>
            {availableSlots.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {loading && selectedDate && <small>Loading available slots...</small>}
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Visit (Optional)</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe your reason for the appointment..."
            rows="3"
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="book-button"
          disabled={loading || !selectedDate || !selectedTime}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;
```

### My Appointments Component
Create `src/components/MyAppointments.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentService.cancelAppointment(appointmentId);
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: 'Cancelled' }
            : apt
        )
      );
      
      alert('Appointment cancelled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Booked': return 'status-booked';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-appointments">
      <h2>My Appointments</h2>
      
      {appointments.length === 0 ? (
        <div className="no-appointments">
          <p>You don't have any appointments yet.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>Dr. {appointment.psychologistId?.name || 'Unknown'}</h3>
                <span className={`status ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="appointment-details">
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.timeSlot}</p>
                <p><strong>Specialization:</strong> {appointment.psychologistId?.specialization || 'N/A'}</p>
                {appointment.reason && (
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                )}
              </div>
              
              {appointment.status === 'Booked' && (
                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="cancel-button"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
```

---

## 3. CSS Styles

### AppointmentBooking.css
```css
.appointment-booking {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.book-button {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.book-button:hover:not(:disabled) {
  background: #0056b3;
}

.book-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.form-group small {
  color: #666;
  font-size: 14px;
}
```

### MyAppointments.css
```css
.my-appointments {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.appointment-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.appointment-header h3 {
  margin: 0;
  color: #333;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-booked {
  background: #e3f2fd;
  color: #1976d2;
}

.status-completed {
  background: #e8f5e8;
  color: #388e3c;
}

.status-cancelled {
  background: #ffebee;
  color: #d32f2f;
}

.appointment-details {
  margin-bottom: 15px;
}

.appointment-details p {
  margin: 8px 0;
  color: #666;
}

.cancel-button {
  background: #dc3545;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background: #c82333;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
  text-align: center;
  padding: 20px;
  background: #f8d7da;
  border-radius: 4px;
}

.no-appointments {
  text-align: center;
  padding: 40px;
  color: #666;
}
```

---

## 4. Usage Examples

### In your main App.js or router:
```jsx
import React from 'react';
import AppointmentBooking from './components/AppointmentBooking';
import MyAppointments from './components/MyAppointments';

function App() {
  const handleBookingSuccess = (appointment) => {
    console.log('Appointment booked:', appointment);
    // Navigate to appointments page or show success message
  };

  return (
    <div className="App">
      {/* Example usage */}
      <AppointmentBooking 
        psychologistId="psychologist_id_here"
        psychologistName="Dr. John Doe"
        onBookingSuccess={handleBookingSuccess}
      />
      
      <MyAppointments />
    </div>
  );
}
```

---

## 5. Environment Setup

Make sure your frontend has the required dependencies:

```bash
npm install axios
```

---

## 6. Testing the Integration

1. **Start your backend server** (should be running on port 5000)
2. **Start your frontend** (should be running on port 3000)
3. **Test the booking flow**:
   - Navigate to appointment booking
   - Select a psychologist
   - Choose date and time
   - Submit booking
4. **Test appointment management**:
   - View your appointments
   - Cancel an appointment
   - Check status updates

---

## 7. Error Handling

The integration includes comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Duplicate booking errors
- Server errors

All errors are displayed to the user with appropriate messages.

---

## 8. Next Steps

1. **Customize the styling** to match your app's design
2. **Add loading states** and better UX
3. **Implement real-time updates** using WebSocket if needed
4. **Add appointment reminders** functionality
5. **Integrate with payment system** if required

The appointment system is now fully integrated and ready to use! 