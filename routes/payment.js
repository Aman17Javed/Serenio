const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const authMiddleware = require('../middleware/authMiddleware');
const appointment = require('../models/appointment')
// POST /api/payments
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { appointmentId, amount, method } = req.body;

    if (!appointmentId || !amount || !method) {
      return res.status(400).json({ message: 'Missing payment info' });
    }

    const payment = new Payment({
      userId: req.user.userId,
      appointmentId,
      amount,
      paymentMethod: method,
      paymentStatus: 'Success' // simulate successful payment
    });

    await payment.save();
    await appointment.findByIdAndUpdate(appointmentId, {
    isPaid: true,
    paymentId: payment._id
    });

    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// routes/payment.js
router.get('/', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/payment.js
router.get('/my-payments', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId })
      .populate('appointmentId'); // optional

    res.status(200).json(payments);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
