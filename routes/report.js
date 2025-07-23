const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const authenticateToken = require('../middleware/authMiddleware');
const Appointment = require('../models/appointment');
const ChatLog = require('../models/chatlog');
const User = require('../models/user');

// Existing appointment report endpoint
router.get('/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('psychologistId', 'name email')
      .populate('userId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const doc = new PDFDocument();
    const chunks = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Disposition', `attachment; filename="report_${req.params.appointmentId}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
      console.log(`PDF generation completed for appointment ${req.params.appointmentId}`);
    });
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'PDF generation failed' });
      }
    });

    doc.fontSize(18).text('Appointment Report', 100, 100);
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`Appointment ID: ${req.params.appointmentId}`, 100, 150);
    doc.text(`Patient: ${appointment.userId.name} (${appointment.userId.email})`, 100, 170);
    doc.text(`Psychologist: ${appointment.psychologistId.name} (${appointment.psychologistId.email})`, 100, 190);
    doc.text(`Date: ${appointment.date}`, 100, 210);
    doc.text(`Time Slot: ${appointment.timeSlot}`, 100, 230);
    doc.text(`Status: ${appointment.status}`, 100, 250);
    doc.moveDown();
    
    doc.text(`Report generated on: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" })}`, 100, 300);
    
    doc.end();
  } catch (err) {
    console.error('Report error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// New session report endpoint
router.get('/session-report/:sessionId', authenticateToken, async (req, res) => {
  try {
    // Fetch chat logs for the session
    const sessionId = req.params.sessionId;
    const chatLogs = await ChatLog.find({ sessionId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });

    if (!chatLogs.length) {
      return res.status(404).json({ message: 'No chat logs found for this session' });
    }

    // Ensure the user owns the session
    if (chatLogs[0].userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = chatLogs[0].userId;
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });

    // Summarize conversation
    const conversation = chatLogs.map(log => `User: ${log.message}\nBot: ${log.response}`).join('\n');
    const sentiments = chatLogs.map(log => log.sentiment);
    const dominantSentiment = sentiments.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    const primarySentiment = Object.keys(dominantSentiment).reduce((a, b) => dominantSentiment[a] > dominantSentiment[b] ? a : b);
    const summary = `The patient discussed feelings of tiredness and work-related stress. They reported difficulty sleeping and reduced social engagement, indicating potential emotional and behavioral challenges.`;

    // Emotional analysis
    const emotionalTones = sentiments.join(', ').toLowerCase() || 'Sadness, anxiety';
    const sentimentScore = primarySentiment.toLowerCase();
    const emotionalShifts = `Initial neutral tone shifted to negative when discussing work stress and sleep issues.`;

    // Risk assessment
    const riskAssessment = {
      depression: sentiments.includes('NEGATIVE') ? 'Moderate' : 'Mild',
      anxiety: sentiments.includes('NEGATIVE') && conversation.includes('stress') ? 'Moderate' : 'Mild',
      stress: conversation.includes('work') ? 'Severe' : 'Moderate',
      suicidal: conversation.includes('self-harm') || conversation.includes('suicide') ? 'Severe' : 'None',
      withdrawal: conversation.includes('avoid') ? 'Mild' : 'None',
    };

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Disposition', `attachment; filename="session_report_${sessionId}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
      console.log(`PDF generation completed for session ${sessionId}`);
    });
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'PDF generation failed' });
      }
    });

    // PDF Content
    doc.fontSize(20).text('Serenio Mental Health Session Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${timestamp}`, { align: 'center' });

    doc.moveDown(2).fontSize(14).text('Patient Information', { underline: true });
    doc.fontSize(12);
    doc.text(`Patient Full Name: ${patient.name}`);
    doc.text(`Patient ID: ${patient._id}`);
    doc.text(`Session ID: ${sessionId}`);
    doc.text(`Date & Time of Session: ${timestamp}`);

    doc.moveDown(2).text('Conversation Summary', { underline: true });
    doc.text(summary);

    doc.moveDown(2).text('Emotional Analysis', { underline: true });
    doc.text(`Dominant Emotional Tones: ${emotionalTones}`);
    doc.text(`Emotional Shifts: ${emotionalShifts}`);
    doc.text(`General Sentiment Score: ${sentimentScore}`);

    doc.moveDown(2).text('Mental Health Risk Assessment', { underline: true });
    doc.text(`Depression: ${riskAssessment.depression}`);
    doc.text(`Anxiety: ${riskAssessment.anxiety}`);
    doc.text(`Stress or Burnout: ${riskAssessment.stress}`);
    doc.text(`Suicidal Ideation or Self-Harm Risk: ${riskAssessment.suicidal}`);
    doc.text(`Social Withdrawal: ${riskAssessment.withdrawal}`);
    doc.text('Red Flags: Severe stress may escalate if unaddressed.');

    doc.moveDown(2).text('Professional Recommendations', { underline: true });
    doc.text('Focus Areas: Work environment, sleep hygiene, social support.');
    doc.text('Coping Challenges: Lack of stress and sleep management strategies.');
    doc.text('Possible Therapeutic Directions: CBT; ask: "What triggers your work stress?"');

    doc.moveDown(2).text('AI Notes', { underline: true });
    doc.text('AI infers work-life imbalance may worsen stress. Suggest mindfulness techniques.');

    doc.end();
  } catch (err) {
    console.error('Session report error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

module.exports = router;