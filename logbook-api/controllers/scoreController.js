const StudentScore = require('../models/StudentScore');
const SupervisorSession = require('../models/SupervisorSession');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');

// Helper: Check if supervisor is assigned to student
async function isSupervisorAssigned(supervisorId, studentId) {
  const supervisor = await User.findById(supervisorId);
  if (!supervisor) return false;
  const session = await SupervisorSession.findOne({
    student: studentId,
    supervisorEmail: supervisor.email,
  });
  return !!session;
}

// POST /api/scores/:studentId
exports.submitScore = async (req, res) => {
  try {
    const supervisorId = req.user.userId;
    const { studentId } = req.params;
    const {
      punctuality,
      abilityToWorkUnsupervised,
      teamPlaying,
      initiative,
      interpersonalRelationship,
      attitudeToWork,
      senseOfResponsibility,
      appearance,
      leadershipAbilities,
      problemSolvingAbilities,
      comment
    } = req.body;

    // Check assignment
    const assigned = await isSupervisorAssigned(supervisorId, studentId);
    if (!assigned) {
      return res.status(403).json({ message: 'You are not assigned to this student.' });
    }

    // Check 28-day rule
    const lastScore = await StudentScore.findOne({ student: studentId })
      .sort({ createdAt: -1 });
    if (lastScore && (Date.now() - lastScore.createdAt.getTime()) < 7 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Student has already been scored in the last 7 days.' });
    }

    // Get supervisor info
    const supervisor = await User.findById(supervisorId);
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    // Create score
    const score = await StudentScore.create({
      student: studentId,
      supervisor: supervisorId,
      supervisorName: supervisor.fullName,
      supervisorEmail: supervisor.email,
      punctuality,
      abilityToWorkUnsupervised,
      teamPlaying,
      initiative,
      interpersonalRelationship,
      attitudeToWork,
      senseOfResponsibility,
      appearance,
      leadershipAbilities,
      problemSolvingAbilities,
      comment
    });

    // Notification (in-app)
    await Notification.create({
      user: studentId,
      title: 'You have been scored by your preceptor',
      message: `Your monthly evaluation has been submitted by ${supervisor.fullName}.`,
    });

    // Notification (email)
    await sendEmail(
      student.email,
      'You have been scored by your preceptor',
      `Hello ${student.fullName},\n\nYour monthly evaluation has been submitted by ${supervisor.fullName} (${supervisor.email}).\n\nPlease log in to view your score.\n\nRegards,\nLogbook Team`
    );

    res.status(201).json({ message: 'Score submitted successfully.', score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit score.' });
  }
};

// GET /api/scores/student/:studentId
exports.getScoresForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Only allow: student (self), admin, or assigned supervisor
    if (userRole === 'student' && userId !== studentId) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    if (userRole === 'supervisor') {
      const assigned = await isSupervisorAssigned(userId, studentId);
      if (!assigned) {
        return res.status(403).json({ message: 'Forbidden.' });
      }
    }
    // Admin can view all

    const scores = await StudentScore.find({ student: studentId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
    res.json({ scores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch scores.' });
  }
};

// GET /api/scores/supervisor/:supervisorId
exports.getScoresBySupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Only allow: supervisor (self) or admin
    if (userRole === 'supervisor' && userId !== supervisorId) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    // Admin can view all

    const scores = await StudentScore.find({ supervisor: supervisorId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .populate('student', 'email fullName')
      .lean();
    res.json({ scores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch scores.' });
  }
};

// GET /api/scores (admin only)
exports.getAllScores = async (req, res) => {
  try {
    const scores = await StudentScore.find({})
      .sort({ createdAt: -1 })
      .populate('student', 'fullName email')
      .populate('supervisor', 'fullName email')
      .select('-__v')
      .lean();
    res.json({ scores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch all scores.' });
  }
}; 