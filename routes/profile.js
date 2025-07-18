// routes/profile.js

const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/authMiddleware'); // JWT middleware
const User = require('../models/User'); // Mongoose User model

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', jwtAuth, async (req, res) => {
  console.log('User role:', req.user.role);
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile GET error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', jwtAuth, async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Profile PUT error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
