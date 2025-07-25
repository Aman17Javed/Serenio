require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const app = express();
require('dotenv').config();
const FLASK_URL = process.env.FLASK_URL || `http://127.0.0.1:${process.env.FLASK_PORT || 5001}`;
const axios = require('axios');

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Import and use routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const privateRoutes = require('./routes/private');
app.use('/api/private', privateRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const appointmentRoutes = require('./routes/appointment');
app.use('/api/appointments', appointmentRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

const webhookRoutes = require('./routes/webhook');
app.use('/api/webhook', webhookRoutes);

const chatbotRoute = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoute);

// Base route
app.get('/', (req, res) => {
  res.send('Serenio backend is live 🚀');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const reportRoutes = require('./routes/report');
app.use('/api/report', reportRoutes);
// console.log('Routes loaded:', require('./routes/profile'));
// Start server
const recommendationRoutes = require('./routes/recommendations');
app.use('/api/recommendations', recommendationRoutes);

const feedbackRoutes = require('./routes/feedback');
app.use('/api/feedback', feedbackRoutes);



async function checkFlaskHealth() {
  try {
    const response = await axios.get(FLASK_URL + '/');
    console.log('✅ Flask server is reachable');
    return { flask_connection: true };
  } catch (error) {
    console.error('❌ Flask server is NOT reachable:', error.message);
    return { flask_connection: false };
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🤖 Chatbot health check: http://localhost:${PORT}/api/chatbot/health`);
  checkFlaskHealth().then(result => {
    console.log('🏥 Health check result:', {
      status: result.flask_connection ? 'healthy' : 'unhealthy',
      timestamp: new Date().toLocaleString(),
      flask_connection: result.flask_connection,
      flask_url: FLASK_URL
    });
  });
});