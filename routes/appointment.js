const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Appointment = require('../models/appointment');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Psychologist = require("../models/psychologist");
const User = require("../models/user"); // Added User model
require('dotenv').config();


// @route POST /api/appointments/book
router.post("/book", verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { psychologistId, date, timeSlot } = req.body;
    console.log("Booking attempt:", { psychologistId, date, timeSlot, userId: req.user.userId });

    if (!psychologistId || !date || !timeSlot) {
      await session.abortTransaction();
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(psychologistId)) {
      console.log("Invalid ObjectId format:", psychologistId);
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid psychologistId format" });
    }

    const psychologist = await Psychologist.findById(psychologistId); // Removed .session(session)
    console.log("Found psychologist for ID:", psychologistId, "Result:", psychologist);
    if (!psychologist) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid or unavailable psychologist" });
    }

    const activeBookings = await Appointment.countDocuments({
      userId: req.user.userId,
      status: "Booked",
      $nor: [{ status: "Cancelled" }],
    }).session(session);
    if (activeBookings >= 3) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Maximum 3 bookings allowed" });
    }

    const conflictingAppointment = await Appointment.findOne({
      psychologistId,
      date,
      timeSlot,
      status: "Booked",
    }).session(session);
    if (conflictingAppointment) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Time slot already booked" });
    }

    const user = await User.findById(req.user.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(400).json({ message: "User not found" });
    }

    const newAppointment = new Appointment({
      userId: req.user.userId,
      psychologistId,
      date: new Date(date),
      status: "Booked",
      timeSlot,
    });

    await newAppointment.save({ session });
    await session.commitTransaction();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const psychologistUser = await User.findById(psychologist.userId); // Removed .session(session)
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Appointment Booked",
      text: `Your appointment is booked for ${date} at ${timeSlot} with ${psychologistUser?.name || psychologist.name}.`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (err) {
    await session.abortTransaction();
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
});
// @route GET /api/appointments/my
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const appointments = await Appointment.find({ userId })
      .populate("psychologistId", "name specialization");

    res.json({ appointments });
  } catch (err) {
    console.error("Fetch appointments error:", err.message);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// @route DELETE /api/appointments/cancel/:id
router.delete('/cancel/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ message: 'Appointment already cancelled' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reminder function
async function checkReminders() {
  try {
    const upcoming = await Appointment.find({
      date: { $gt: new Date(), $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      status: 'Booked',
      'timeSlot': { $regex: /^(\d{1,2}:00|\d{1,2}:30)/ }
    }).populate('userId', 'email name').populate('psychologistId', 'name');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    for (const apt of upcoming) {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: apt.userId.email,
        subject: 'Appointment Reminder',
        text: `Hi ${apt.userId.name}, this is a reminder for your appointment on ${apt.date} at ${apt.timeSlot} with ${apt.psychologistId.name}.`
      };
      await transporter.sendMail(mailOptions);
      console.log(`Reminder sent to ${apt.userId.email} for ${apt.date} ${apt.timeSlot}`);
    }
  } catch (err) {
    console.error('Reminder error:', err);
  }
}

// Schedule the cron job to run every hour
cron.schedule('0 * * * *', async () => {
  await checkReminders();
});

module.exports = router;
module.exports.checkReminders = checkReminders;

if (require.main === module) {
  module.exports = { router, checkReminders };
}