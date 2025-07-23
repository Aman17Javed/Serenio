const express = require('express');
const router = express.Router();
const { generateReply } = require('../services/chatbotService');
const ChatLog = require('../models/chatlog');
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('../middleware/authMiddleware');
const axios = require('axios');

const FLASK_HOST = '127.0.0.1';
const FLASK_PORT = 7000;
const FLASK_URL = `http://${FLASK_HOST}:${FLASK_PORT}`;

const testFlaskConnection = async () => {
  try {
    console.log(`🔍 Testing Flask connection via GET to ${FLASK_URL}/...`);
    const response = await axios.get(`${FLASK_URL}/`, { timeout: 30000 });
    if (response.data?.status === 'ok') {
      console.log('✅ Flask server is reachable and responded');
      return true;
    } else {
      console.log('⚠️ Flask did not return a proper response');
      return false;
    }
  } catch (error) {
    console.log('❌ Flask server is NOT reachable:', error.message);
    return false;
  }
};

router.post('/message', authenticateToken, async (req, res) => {
  const startTime = Date.now();
  console.log('\n' + '='.repeat(50));
  console.log('🚀 NEW CHAT REQUEST RECEIVED');
  console.log('='.repeat(50));

  const { message } = req.body;
  if (!message) {
    console.log('❌ No message provided in request body');
    return res.status(400).json({ error: 'No message provided' });
  }

  console.log(`📝 User message: "${message}"`);
  console.log(`⏰ Request timestamp: ${new Date().toISOString()}`);
  console.log(`👤 User ID: ${req.user.userId}`);

  try {
    const isFlaskReachable = await testFlaskConnection();
    if (!isFlaskReachable) {
      throw new Error('Flask server is not reachable');
    }

    console.log(`➡️ Sending message to Flask via chatbotService`);
    const flaskResponse = await generateReply(message);

    // Check if flaskResponse is a string (error case) or object
    if (typeof flaskResponse === 'string') {
      throw new Error('Invalid response from Flask: ' + flaskResponse);
    }

    const { response: botReply, sentiment, confidence } = flaskResponse;
    if (!botReply) {
      throw new Error('No bot reply received from Flask');
    }

    const sessionId = uuidv4();

    const chatLog = new ChatLog({
      userId: req.user.userId,
      sessionId,
      message,
      response: botReply,
      sentiment: sentiment || 'neutral'
    });
    await chatLog.save();

    console.log(`💾 Chat log saved with sessionId: ${sessionId}`);

    const successResponse = {
      userMessage: message,
      botReply,
      sessionId,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      responseTime: Date.now() - startTime
    };

    console.log('✅ SUCCESS - Sending response to client');
    console.log('='.repeat(50) + '\n');

    res.status(200).json(successResponse);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.log('\n' + '🔥'.repeat(20));
    console.log('❌ CHATBOT ERROR OCCURRED');
    console.log('🔥'.repeat(20));
    console.log(`⏰ Error occurred after ${responseTime}ms`);
    console.log(`📝 Error message: ${error.message}`);
    console.log(`🔍 Error code: ${error.code || 'N/A'}`);

    if (error.response) {
      console.log(`📊 HTTP Status: ${error.response.status}`);
      console.log(`📋 Response data:`, error.response.data);
    }

    if (error.request) {
      console.log('📡 Request was made but no response received');
      console.log('🔧 Check if Flask server is running on port 7000');
    }

    console.log('📚 Full error stack:', error.stack);
    console.log('🔥'.repeat(20) + '\n');

    const errorResponse = {
      userMessage: message,
      botReply: 'Sorry, I couldn’t respond at the moment. Please try again.',
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      error: error.message,
      responseTime
    };

    res.status(200).json(errorResponse);
  }
});

router.get('/health', async (req, res) => {
  console.log('🏥 Health check requested');

  try {
    const isFlaskReachable = await testFlaskConnection();

    const healthStatus = {
      status: isFlaskReachable ? 'healthy' : 'unhealthy',
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      flask_connection: isFlaskReachable,
      flask_url: FLASK_URL
    };

    console.log('🏥 Health check result:', healthStatus);

    res.status(isFlaskReachable ? 200 : 503).json(healthStatus);
  } catch (error) {
    console.log('🏥 Health check failed:', error.message);
    res.status(503).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })
    });
  }
});

router.get('/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    message: 'Chatbot router is working!',
    timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
    flask_url: FLASK_URL
  });
});

console.log(`🤖 Chatbot router loaded - Flask target: ${FLASK_URL}`);

module.exports = router;