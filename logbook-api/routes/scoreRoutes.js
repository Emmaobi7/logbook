const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const protect = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

// Submit a score (supervisor only)
router.post('/:studentId', protect, requireRole('supervisor'), scoreController.submitScore);

// Get all scores for a student (student, admin, or assigned supervisor)
router.get('/student/:studentId', protect, scoreController.getScoresForStudent);

// Get all scores given by a supervisor (supervisor or admin)
router.get('/supervisor/:supervisorId', protect, scoreController.getScoresBySupervisor);

// Get all scores (admin only)
router.get('/', protect, requireRole('admin'), scoreController.getAllScores);

module.exports = router; 