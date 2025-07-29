    const express = require('express');
    const router = express.Router();
    const authenticateToken = require('../middleware/authMiddleware');
    const { OpenAI } = require('openai');
    require('dotenv').config();

// 🔑 Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env
});

router.post('/sentiment', authenticateToken, async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a sentiment analysis expert. Provide a dominant sentiment (POSITIVE, NEUTRAL, NEGATIVE) and a single concise recommendation sentence based on the conversation." },
        ...messages,
      ],
    });
    const content = response.choices[0].message.content;
    const [sentimentLine, recommendationLine] = content.split("\n").filter(line => line);
    const sentiment = sentimentLine.split(": ")[1] || "NEUTRAL";
    const recommendation = recommendationLine.split(": ")[1] || "No recommendation available.";
    res.status(200).json({ sentiment, recommendation });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing sentiment', error: error.message });
  }
});

module.exports = router;