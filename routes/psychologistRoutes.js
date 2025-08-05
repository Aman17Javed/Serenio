const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Psychologist = require("../models/psychologist");
const Appointment = require("../models/appointment");
const User = require("../models/user");
const ChatLog = require("../models/chatlog");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Get psychologist's appointments
router.get("/psychologists/appointments", verifyToken, async (req, res) => {
  try {
    const { psychologistId } = req.query;
    const appointments = await Appointment.find({ psychologistId })
      .populate('userId', 'name email')
      .populate('psychologistId', 'name specialization')
      .sort({ date: 1, timeSlot: 1 });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// Get psychologist's clients
router.get("/psychologists/clients", verifyToken, async (req, res) => {
  try {
    const { psychologistId } = req.query;
    
    // Get unique clients who have appointments with this psychologist
    const appointments = await Appointment.find({ psychologistId })
      .populate('userId', 'name email')
      .distinct('userId');
    
    // Get client analytics
    const clients = await Promise.all(
      appointments.map(async (userId) => {
        const user = await User.findById(userId).select('name email');
        const userAppointments = await Appointment.find({ 
          psychologistId, 
          userId 
        }).sort({ date: -1 });
        
        const lastSession = userAppointments[0]?.date || null;
        
        // Get mood data for this client
        const moodLogs = await ChatLog.find({ userId })
          .sort({ createdAt: -1 })
          .limit(5);
        
        const moodTrend = moodLogs.map(log => {
          if (log.sentiment === 'positive') return 5;
          if (log.sentiment === 'neutral') return 3;
          return 1;
        });
        
        // Calculate overall sentiment
        const positiveCount = moodLogs.filter(log => log.sentiment === 'positive').length;
        const negativeCount = moodLogs.filter(log => log.sentiment === 'negative').length;
        let sentiment = 'Neutral';
        if (positiveCount > negativeCount) sentiment = 'Positive';
        else if (negativeCount > positiveCount) sentiment = 'Negative';
        
        return {
          _id: userId,
          name: user?.name || 'Unknown',
          email: user?.email || 'Unknown',
          lastSession,
          moodTrend,
          sentiment,
          totalAppointments: userAppointments.length
        };
      })
    );
    
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
});

// Get psychologist's availability
router.get("/psychologists/my-availability", verifyToken, async (req, res) => {
  try {
    const psychologistId = req.user.userId;
    const psychologist = await Psychologist.findOne({ userId: psychologistId });
    
    if (!psychologist) {
      return res.status(404).json({ message: "Psychologist not found" });
    }
    
    // For now, return a simple availability array
    // In a real app, this would be more sophisticated
    const availability = psychologist.availability || [];
    
    res.json({ dates: availability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
});

// Toggle availability
router.put("/psychologists/toggle-availability", verifyToken, async (req, res) => {
  try {
    const { date } = req.body;
    const psychologistId = req.user.userId;
    
    const psychologist = await Psychologist.findOne({ userId: psychologistId });
    if (!psychologist) {
      return res.status(404).json({ message: "Psychologist not found" });
    }
    
    // Toggle the date in availability
    const availability = psychologist.availability || [];
    const dateIndex = availability.indexOf(date);
    
    if (dateIndex > -1) {
      availability.splice(dateIndex, 1);
    } else {
      availability.push(date);
    }
    
    psychologist.availability = availability;
    await psychologist.save();
    
    res.json({ dates: availability });
  } catch (error) {
    console.error("Error toggling availability:", error);
    res.status(500).json({ message: "Failed to toggle availability" });
  }
});

// Get psychologist's stats
router.get("/psychologists/stats", verifyToken, async (req, res) => {
  try {
    const psychologistId = req.user.userId;
    
    // Get appointments for this psychologist
    const appointments = await Appointment.find({ psychologistId });
    
    // Weekly bookings (mock data for now)
    const bookings = [
      { week: "Week 1", bookings: appointments.filter(a => a.status === 'Booked').length },
      { week: "Week 2", bookings: Math.floor(Math.random() * 10) },
      { week: "Week 3", bookings: Math.floor(Math.random() * 10) },
      { week: "Week 4", bookings: Math.floor(Math.random() * 10) }
    ];
    
    // Monthly revenue (mock data for now)
    const revenue = [
      { month: "Jan", revenue: appointments.length * 2500 },
      { month: "Feb", revenue: Math.floor(Math.random() * 50000) },
      { month: "Mar", revenue: Math.floor(Math.random() * 50000) },
      { month: "Apr", revenue: Math.floor(Math.random() * 50000) }
    ];
    
    // Appointment status distribution
    const statusCounts = {};
    appointments.forEach(appt => {
      statusCounts[appt.status] = (statusCounts[appt.status] || 0) + 1;
    });
    
    const status = Object.keys(statusCounts).map(key => ({
      status: key,
      value: statusCounts[key]
    }));
    
    res.json({ bookings, revenue, status });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.put(
  "/psychologists/profile-picture/:id",
  verifyToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const psychologist = await Psychologist.findById(req.params.id);
      if (
        !psychologist ||
        psychologist.userId.toString() !== req.user.userId ||
        req.user.role !== "Psychologist"
      ) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      psychologist.imageUrl = imageUrl;
      await psychologist.save();

      res.status(200).json({ message: "Profile picture updated", imageUrl });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/psychologists", verifyToken, async (req, res) => {
  try {
    const psychologists = await Psychologist.find().select(
      "_id name specialization rating reviews experience availability imageUrl hourlyRate sessionPrice bio"
    );
    console.log("Psychologists returned:", JSON.stringify(psychologists, null, 2));
    res.status(200).json(psychologists);
  } catch (err) {
    console.error("Error fetching psychologists:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;