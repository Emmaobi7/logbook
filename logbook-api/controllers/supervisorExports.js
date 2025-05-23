const { Parser } = require("json2csv");
const SupervisorSession = require('../models/SupervisorSession');
const LogEntry = require('../models/LogbookEntry');
const User = require('../models/User');
const Supervisor = require("../models/User");

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

// Helper to get supervised student IDs for a supervisor email
const getSupervisedStudentIds = async (supervisorEmail) => {
  const sessions = await SupervisorSession.find({ supervisorEmail });
  return sessions.map(s => s.student.toString());
};

exports.exportAllLogs = async (req, res) => {
  try {
    // 🔥 Look up the email from the user ID
    const supervisor = await Supervisor.findById(req.user.userId); // Adjust if your model name is `User`
    if (!supervisor || !supervisor.email) {
      return res.status(401).json({ message: "Supervisor email not found" });
    }

    const studentIds = await getSupervisedStudentIds(supervisor.email);

    if (studentIds.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    const logs = await LogEntry.find({ user: { $in: studentIds } })
      .populate("user", "fullName")
      .sort({ date: -1 });

    if (logs.length === 0) {
      return res.status(404).json({ message: "No logs found" });
    }

    const data = logs.map(log => ({
      "Student Name": log.user.fullName,
      Date: formatDate(log.date),
      Activity: log.title || "",
      Competencies: log.content || "",
      Status: log.status,
      "Supervisor Comment": log.comments || "",
    }));

    const json2csvParser = new Parser({
      fields: ["Student Name", "Date", "Activity", "Competencies", "Status", "Supervisor Comment"]
    });

    const csv = json2csvParser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`all-student-logs-${formatDate(new Date())}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: "Failed to export logs" });
  }
};





exports.exportStudentLogs = async (req, res) => {
  try {
    const supervisor = await User.findById(req.user.userId); // get supervisor's email
    if (!supervisor || !supervisor.email) {
      return res.status(401).json({ message: "Supervisor email not found" });
    }

    const supervisorEmail = supervisor.email;
    const studentId = req.params.studentId;

    // Confirm student is supervised by this supervisor
    const isSupervised = await SupervisorSession.exists({ supervisorEmail, student: studentId });
    if (!isSupervised) {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await LogEntry.find({ user: studentId })
      .populate("user", "fullName")
      .sort({ date: -1 });

    if (logs.length === 0) {
      return res.status(404).json({ message: "No logs found for this student" });
    }

    const data = logs.map(log => ({
      "Student Name": log.user.fullName,
      Date: formatDate(log.date),
      Activity: log.title || "",
      Competence: log.content || "", // use 'content', not 'description' if that’s the correct field
      Status: log.status,
      "Supervisor Comment": log.comments || "",
    }));

    const json2csvParser = new Parser({
      fields: ["Student Name", "Date", "Activity", "Competence", "Status", "Supervisor Comment"]
    });
    const csv = json2csvParser.parse(data);

    const student = await User.findById(studentId);
    const filenameNamePart = student?.fullName?.toLowerCase().replace(/\s+/g, "-") || "student";

    res.header("Content-Type", "text/csv");
    res.attachment(`${filenameNamePart}-logs-${formatDate(new Date())}.csv`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to export logs" });
  }
};

