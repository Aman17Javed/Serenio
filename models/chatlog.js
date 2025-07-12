// models/ChatLog.js
const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message:  { type: String, required: true },
  response: { type: String, required: true },
  sentiment:{ type: String, default: 'neutral' },   // placeholder
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
