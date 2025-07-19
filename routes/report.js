const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const authenticateToken = require('../middleware/authMiddleware');
const Appointment = require('../models/appointment');

// Change from '/report/:appointmentId' to '/:appointmentId'
router.get('/:appointmentId', authenticateToken, async (req, res) => {
  try {
    // Add populate to get psychologist details
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('psychologistId', 'name email')
      .populate('userId', 'name email');
      
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user owns this appointment
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

    // Add content to PDF
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
    
    doc.text(`Report generated on: ${new Date().toLocaleString()}`, 100, 300);
    
    doc.end();
  } catch (err) {
    console.error('Report error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

module.exports = router;