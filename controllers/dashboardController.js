const User = require('../models/user');
const Feedback = require('../models/feedback');
const Payment = require('../models/payment');
const Appointment = require('../models/appointment');
const Psychologist = require('../models/psychologist');
const MoodLog = require('../models/moodlog');
const Recommendation = require('../models/recommendation');
const ChatLog = require('../models/chatlog');
const Transaction = require('../models/transaction');

exports.getMoodStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodHistory = await MoodLog.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: -1 });

    const moodCounts = moodHistory.reduce(
      (acc, log) => {
        acc[log.sentiment] = (acc[log.sentiment] || 0) + 1;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const totalMoods = moodHistory.length;
    const positivePercentage = totalMoods ? ((moodCounts.positive / totalMoods) * 100).toFixed(2) : 0;

    const status = totalMoods
      ? moodCounts.positive >= moodCounts.neutral && moodCounts.positive >= moodCounts.negative
        ? 'Positive'
        : moodCounts.neutral >= moodCounts.negative
        ? 'Neutral'
        : 'Negative'
      : 'No Data';

    res.status(200).json({
      status,
      percentage: positivePercentage,
      history: moodHistory.map((log) => ({
        date: log.createdAt.toISOString().split('T')[0],
        sentiment: log.sentiment,
      })),
    });
  } catch (error) {
    console.error('Error fetching mood stats:', error.message);
    res.status(500).json({ message: 'Error fetching mood stats', error: error.message });
}};

exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(`Fetching recent activity for userId: ${userId} at ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`);

    const [sessions, appointments, payments] = await Promise.all([
      ChatLog.find({ userId }).sort({ createdAt: -1 }).limit(1).lean(),
      Appointment.find({ userId }).sort({ updatedAt: -1 }).limit(1).lean(),
      Payment.find({ userId })
        .sort({ timestamp: -1 })
        .limit(1)
        .or([{ paymentStatus: 'Success' }, { paymentStatus: 'Pending' }])
        .lean(),
    ]);

    console.log('Sessions found:', sessions.length, 'Appointments found:', appointments.length, 'Payments found:', payments.length);

    const activity = [];

    if (sessions.length) {
      const sessionDate = sessions[0].createdAt instanceof Date ? sessions[0].createdAt : new Date(sessions[0].createdAt);
      if (!isNaN(sessionDate.getTime())) {
        activity.push({
          type: 'session',
          time: sessionDate.toLocaleString('en-PK', { timeZone: 'Asia/Karachi', dateStyle: 'short', timeStyle: 'short' }),
          sentiment: sessions[0].sentiment || 'Unknown',
        });
      } else {
        console.warn(`Invalid session date for ${sessions[0]._id}: ${sessions[0].createdAt}`);
      }
    }

    if (appointments.length) {
      const psych = await Psychologist.findById(appointments[0].psychologistId).select('name').lean();
      // Validate date (YYYY-MM-DD) and timeSlot (HH:MM)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}$/;
      const isValidDate = dateRegex.test(appointments[0].date);
      const isValidTime = timeRegex.test(appointments[0].timeSlot);
      if (isValidDate && isValidTime) {
        const appointmentDateTime = new Date(`${appointments[0].date}T${appointments[0].timeSlot}:00`);
        if (!isNaN(appointmentDateTime.getTime())) {
          activity.push({
            type: 'appointment',
            time: appointmentDateTime.toLocaleString('en-PK', { timeZone: 'Asia/Karachi', dateStyle: 'short', timeStyle: 'short' }),
            psychologist: psych?.name || 'Unknown',
          });
        } else {
          console.warn(`Invalid appointment date/time for ${appointments[0]._id}: ${appointments[0].date} ${appointments[0].timeSlot}`);
        }
      } else {
        console.warn(`Malformed appointment date/time for ${appointments[0]._id}: date=${appointments[0].date}, timeSlot=${appointments[0].timeSlot}`);
      }
    }

    if (payments.length) {
      const paymentDate = payments[0].timestamp instanceof Date ? payments[0].timestamp : new Date(payments[0].timestamp);
      if (!isNaN(paymentDate.getTime())) {
        activity.push({
          type: 'payment',
          amount: payments[0].amount,
          status: payments[0].paymentStatus,
          time: paymentDate.toLocaleString('en-PK', { timeZone: 'Asia/Karachi', dateStyle: 'short', timeStyle: 'short' }),
        });
      } else {
        console.warn(`Invalid payment timestamp for ${payments[0]._id}: ${payments[0].timestamp}`);
      }
    }

    console.log('Recent activity response:', activity);
    res.json(activity);
  } catch (error) {
    console.error('Error in getRecentActivity:', error.message);
    res.status(500).json({ message: 'Error fetching recent activity', error: error.message });
  }
};

exports.getTopPsychologists = async (req, res) => {
  try {
    console.log(`Fetching top psychologists at ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`);
    const psychologists = await Psychologist.find()
      .sort({ rating: -1, reviews: -1 })
      .limit(5)
      .select('name specialization rating hourlyRate');
    console.log('Top psychologists found:', psychologists.length);
    res.json(psychologists);
  } catch (error) {
    console.error('Error in getTopPsychologists:', error.message);
    res.status(500).json({ message: 'Error fetching top psychologists', error: error.message });
  }
};

exports.getSessionInsights = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(`Fetching session insights for userId: ${userId} at ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`);
    const feedback = await Feedback.find({ userId });
    const chatLogs = await ChatLog.find({ userId });
    const recommendations = await Recommendation.find({ userId }).sort({ createdAt: -1 }).limit(1);
    console.log('Feedback found:', feedback.length, 'ChatLogs found:', chatLogs.length, 'Recommendations found:', recommendations.length);

    const totalSessions = chatLogs.length;
    const averageRating = feedback.length ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : 0;
    const latestRecommendation = recommendations.length ? recommendations[0].recommendation : null;

    console.log('Session insights response:', { total: totalSessions, averageRating, latestRecommendation });
    res.json({ total: totalSessions, averageRating, latestRecommendation });
  } catch (error) {
    console.error('Error in getSessionInsights:', error.message);
    res.status(500).json({ message: 'Error fetching session insights', error: error.message });
  }
};