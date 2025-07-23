const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const authenticateToken = require('../middleware/authMiddleware');
const Transaction = require('../models/transaction');

// Currency-specific minimums (in smallest unit, e.g., paisa for PKR, cents for USD)
const MINIMUM_AMOUNT = {
  usd: 100, // 100 cents = $1.00
  pkr: 10000, // 100 PKR = 10,000 paisa (approx. £0.30)
};

// Create payment intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }

    const { amount, currency = 'usd' } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const minAmount = MINIMUM_AMOUNT[currency.toLowerCase()];
    if (!minAmount) {
      return res.status(400).json({ error: `Unsupported currency: ${currency}` });
    }
    if (amount < minAmount) {
      return res.status(400).json({ error: `Amount must be at least ${minAmount} ${currency.toUpperCase()}` });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: req.user.userId },
    });

    const transaction = new Transaction({
      userId: req.user.userId,
      stripePaymentId: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status
    });
    await transaction.save();

    console.log(`💸 Payment intent created: ${paymentIntent.id}`);
    res.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id
    });
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({ error: 'Payment failed: ' + error.message });
  }
});

// Get transaction history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (error) {
    console.error('Transaction history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});

module.exports = router;