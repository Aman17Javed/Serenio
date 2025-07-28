const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('../middleware/authMiddleware');
const ChatLog = require('../models/chatlog');
const { OpenAI } = require('openai');
require('dotenv').config();

// 🔑 Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/message', authenticateToken, async (req, res) => {
  const startTime = Date.now();
  console.log('\n' + '='.repeat(50));
  console.log('🚀 NEW CHAT REQUEST RECEIVED');
  console.log('='.repeat(50));

  const { message, sessionId: clientSessionId } = req.body;
  if (!message) {
    console.log('❌ No message provided in request body');
    return res.status(400).json({ error: 'No message provided' });
  }

  const sessionId = clientSessionId || uuidv4(); // Reuse or create session ID
  console.log(`📝 User message: "${message}"`);
  console.log(`⏰ Request timestamp: ${new Date().toISOString()}`);
  console.log(`👤 User ID: ${req.user.userId}`);
  console.log(`🧾 Session ID: ${sessionId}`);

  try {
    // 🔮 GPT-4o response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive and non-judgmental mental health assistant. Respond empathetically and respectfully.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const botReply = completion.choices[0].message.content.trim();
    const sentiment = 'neutral'; // Optional: Replace with real analysis if needed

    // 💾 Save to MongoDB
    const chatLog = new ChatLog({
      userId: req.user.userId,
      sessionId,
      message,
      response: botReply,
      sentiment
    });
    await chatLog.save();

    const successResponse = {
      userMessage: message,
      botReply,
      sentiment,
      sessionId,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      responseTime: Date.now() - startTime
    };

    console.log(`✅ Chat saved with sessionId: ${sessionId}`);
    console.log('✅ SUCCESS - Sending response to client');
    console.log('='.repeat(50) + '\n');

    res.status(200).json(successResponse);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('\n' + '🔥'.repeat(20));
    console.error('❌ CHATBOT ERROR OCCURRED');
    console.error('🔥'.repeat(20));
    console.error(`⏰ Error occurred after ${responseTime}ms`);
    console.error(`📝 Error message: ${error.message}`);
    console.error('📚 Stack:', error.stack);

    res.status(200).json({
      userMessage: message,
      botReply: 'Sorry, I couldn’t respond at the moment. Please try again.',
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      error: error.message,
      responseTime
    });
  }
});

// ✅ Static health check (no Flask involved anymore)
router.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({
    status: 'healthy',
    gptModel: 'gpt-4o',
    timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })
  });
});

router.get('/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    message: 'Chatbot router is working!',
    timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })
  });
});

console.log(`🤖 Chatbot router loaded with OpenAI GPT-4o`);

module.exports = router;
