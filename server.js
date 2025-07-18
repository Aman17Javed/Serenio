require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import and use routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);  // This means your routes start with /api/auth

// Base route
app.get('/', (req, res) => {
  res.send('Serenio backend is live 🚀');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const privateRoutes = require('./routes/private');
app.use('/api/private', privateRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🤖 Chatbot health check: http://localhost:${PORT}/api/chatbot/health`);
});
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const appointmentRoutes = require('./routes/appointment');
app.use('/api/appointments', appointmentRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

const chatbotRoute = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoute);


