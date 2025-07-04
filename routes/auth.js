const express = require('express');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  res.status(201).json({ message: `User ${name} registered successfully.` });
});

// @route   POST /api/auth/login
// @desc    Login existing user
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  res.status(200).json({ message: `User with email ${email} logged in.` });
});

module.exports = router;
