const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Appointment = require('../models/appointment');

// @route POST /api/appointments/book
// @desc Book a new appointment
router.post('/book', verifyToken, async (req, res) => {
  try {
    const { psychologistId, date, timeSlot } = req.body;

    if (!psychologistId || !date || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAppointment = new Appointment({
      userId: req.user.userId,
      psychologistId,
      date,
      timeSlot
    });

    await newAppointment.save();

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/appointments/my
// @desc Get user's appointments
router.get('/my', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.userId }).populate('psychologistId', 'name email');

    res.status(200).json({ appointments });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/appointments/cancel/:id
// @desc Cancel an appointment
router.delete('/cancel/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
