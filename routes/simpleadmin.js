const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ChatLog = require('../models/chatlog');
const Appointment = require('../models/appointment');
const Transaction = require('../models/transaction');
const Payment = require('../models/payment');
const Psychologist = require('../models/psychologist');

router.post('/simple-dashboard', async (req, res) => {
  const { email, password } = req.body;

  // Check admin credentials
  if (email !== 'admin@example.com') {
    return res.status(401).json({ message: 'Unauthorized: Invalid email' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'Admin') {
      return res.status(401).json({ message: 'Unauthorized: Not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Unauthorized: Invalid password' });
    }

    // Fetch dashboard data
    const chatLogs = await ChatLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    const appointments = await Appointment.find()
      .populate('userId', 'name email')
      .populate('psychologistId', 'name specialization hourlyRate')
      .populate('paymentId', 'amount paymentStatus')
      .sort({ createdAt: -1 })
      .limit(100);

    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('appointmentId', 'date timeSlot')
      .sort({ timestamp: -1 })
      .limit(100);

    const psychologists = await Psychologist.find()
      .select('_id name specialization rating experience availability imageUrl hourlyRate bio')
      .sort({ name: 1 });

    const users = await User.find()
      .select('_id name email role createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      chatLogs,
      appointments,
      transactions,
      payments,
      psychologists,
      users,
    });
  } catch (error) {
    console.error('Simple admin dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

module.exports = router;