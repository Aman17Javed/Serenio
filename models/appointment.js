const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Psychologist', required: true },
  date: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Validate date format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(v)) return false;
        
        // Check if date is not in the past
        const appointmentDate = new Date(v + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return appointmentDate >= today;
      },
      message: 'Date must be in YYYY-MM-DD format and cannot be in the past'
    }
  },
  timeSlot: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Validate time format HH:MM
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(v)) return false;
        
        // Check if time is between 9 AM and 5 PM
        const hour = parseInt(v.split(':')[0]);
        return hour >= 9 && hour <= 17;
      },
      message: 'Time must be in HH:MM format and between 9:00 and 17:00'
    }
  },
  reason: { type: String },
  status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  createdAt: { type: Date, default: Date.now },
});

// Create compound index to prevent duplicate bookings
appointmentSchema.index({ psychologistId: 1, date: 1, timeSlot: 1, status: 1 }, { 
  unique: true,
  partialFilterExpression: { status: { $in: ['Booked', 'Completed'] } }
});

module.exports = mongoose.model('Appointment', appointmentSchema);