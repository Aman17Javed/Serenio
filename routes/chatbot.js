const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// POST /api/chatbot
router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "User message is required" });

  try {
    const python = spawn('python', ['python/chatbot_response.py', message]);

    let data = '';
    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on('data', (err) => {
      console.error("Python Error:", err.toString());
    });

    python.on('close', (code) => {
      if (code !== 0) return res.status(500).json({ message: 'Chatbot failed' });
      res.status(200).json({ response: data.trim() });
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
