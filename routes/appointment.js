const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Appointment = require('../models/appointment');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

// @route POST /api/appointments/book
// @desc Book a new appointment
router.post('/book', verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { psychologistId, date, timeSlot } = req.body;

    if (!psychologistId || !date || !timeSlot) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate psychologistId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(psychologistId)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid psychologistId format' });
    }

    const newAppointment = new Appointment({
      userId: req.user.userId,
      psychologistId,
      date,
      timeSlot
    });

    await newAppointment.save({ session });
    await session.commitTransaction();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: req.user.email,
      subject: 'Appointment Booked',
      text: `Your appointment is booked for ${date} at ${timeSlot}.`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Proceed without aborting transaction to avoid data loss
    }

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (err) {
    await session.abortTransaction();
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    session.endSession();
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