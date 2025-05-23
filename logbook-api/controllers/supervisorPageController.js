// controllers/supervisorController.js
const LogEntry = require('../models/LogbookEntry');
const User = require("../models/User");
const SupervisorSession = require('../models/SupervisorSession');

// controllers/supervisorController.js
exports.getDashboardStats = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get supervisor's full user record
    const supervisor = await User.findById(userId);
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    const supervisorEmail = supervisor.email;

    // Get all students this supervisor is assigned to
    const sessions = await SupervisorSession.find({ supervisorEmail });
    const studentIds = sessions.map(session => session.student);

    const total_students = studentIds.length;

    const pending_logs = await LogEntry.countDocuments({
      user: { $in: studentIds },
      status: "pending",
    });

    const approved_logs = await LogEntry.countDocuments({
      user: { $in: studentIds },
      status: "approved",
    });

    const rejected_logs = await LogEntry.countDocuments({
      user: { $in: studentIds },
      status: "rejected",
    });

    res.status(200).json({
      total_students,
      pending_logs,
      approved_logs,
      rejected_logs,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};


exports.getRecentLogs = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get supervisor email from User
    const supervisor = await User.findById(userId);
    if (!supervisor) return res.status(404).json({ message: "Supervisor not found" });

    const supervisorEmail = supervisor.email;

    // Get all students supervised
    const sessions = await SupervisorSession.find({ supervisorEmail });
    const studentIds = sessions.map(session => session.student);

    // Fetch last 10 logs for those students, sorted by date descending
    const logs = await LogEntry.find({ user: { $in: studentIds } })
      .sort({ date: -1 })
      .limit(10)
      .populate('user', 'fullName');  // populate user to get student name

    // Map logs to desired format
    const formattedLogs = logs.map(log => ({
      student: log.user.fullName,
      date: log.date.toISOString().split('T')[0], // format date YYYY-MM-DD
      status: log.status,
    }));

    res.status(200).json(formattedLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent logs" });
  }
};



exports.getStudentLogs = async (req, res) => {
  const { status } = req.query;

  try {
    // Get supervisor email from the database
    const supervisor = await User.findById(req.user.userId);
    if (!supervisor) return res.status(404).json({ message: "Supervisor not found" });

    const sessions = await SupervisorSession.find({ supervisorEmail: supervisor.email });
    const studentIds = sessions.map(s => s.student);

    const statusFilter = status ? { status: { $in: status.split(",") } } : {};

    const logs = await LogEntry.find({
      user: { $in: studentIds },
      ...statusFilter,
    })
      .sort({ date: -1 })
      .populate("user", "fullName");

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
}




exports.updateLogStatusPage = async (req, res) => {
  const { logId } = req.params;
  const { status, supervisorComment } = req.body;
  let id = logId;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const log = await LogEntry.findById(id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    if (log.status !== "pending") {
      return res.status(400).json({ message: "Only pending logs can be updated" });
    }

    log.status = status;
    log.comments = supervisorComment || "";
    await log.save();

    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update log" });
  }
};