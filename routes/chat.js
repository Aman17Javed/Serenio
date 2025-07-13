// routes/chat.js
const express = require('express');
const router  = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const ChatLog = require('../models/chatlog');

/**
 * POST /api/chat
 * Body: { message: "Hi, I feel anxious" }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    /*  <<< Placeholder AI response  >>>  */
    // TODO: Replace with Hugging Face / LangChain call
    const aiResponse = `You said: "${message}". I'm here to listen.`;

    /*  (Optional) placeholder sentiment  */
    const sentiment = 'neutral';

    /*  Save chat to DB  */
    const log = await ChatLog.create({
      userId: req.user.userId,
      message,
      response: aiResponse,
      sentiment
    });

    res.status(200).json({ response: aiResponse, sentiment, logId: log._id });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
