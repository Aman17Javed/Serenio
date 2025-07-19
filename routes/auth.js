require('dotenv').config();
console.log("JWT_SECRET is:", process.env.JWT_SECRET);
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user'); // Ensure this path is correct
const jwt =require('jsonwebtoken')

// 


// ✅ Register Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database or secure cookie (simplified here)
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ message: 'Login successful', accessToken, refreshToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: `User ${name} registered successfully.` });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;

