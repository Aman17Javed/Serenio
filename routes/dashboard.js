const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/mood/stats', authenticateToken, dashboardController.getMoodStats);
router.get('/activity/recent', authenticateToken, dashboardController.getRecentActivity);
router.get('/psychologists/top', authenticateToken, dashboardController.getTopPsychologists);
router.get('/sessions/insights', authenticateToken, dashboardController.getSessionInsights);

module.exports = router;