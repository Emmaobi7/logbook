// controllers/supervisorController.js

const SupervisorInvitation = require('../models/SupervisorInvitation');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const SupervisorSession = require('../models/SupervisorSession');
const Student = require('../models/User');
const LogEntry = require('../models/LogbookEntry');

exports.inviteSupervisor = async (req, res) => {
  const { name, email } = req.body;
  const studentId = req.user.userId;

  if (!name || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const token = generateToken();
  const invitation = new SupervisorInvitation({
    student: studentId,
    supervisorName: name,
    supervisorEmail: email,
    secureToken: token,
  });

  await invitation.save();


   // Create SupervisorSession
  const session = new SupervisorSession({
    student: studentId,
    supervisorName: name,
    supervisorEmail: email,
    token
  });

  await session.save();

  const link = `${process.env.CLIENT_URL}/supervisor/review/${token}`;
  await sendEmail(
    email,
    'Logbook Review Invitation',
    `Hi ${name},\n\nYou’ve been invited to review a student's logbook.\nClick the link below to get started:\n\n${link}`
  );

  return res.json({ message: 'Preceptor invited successfully.' });
};




exports.getSessionDetails = async (req, res) => {
  const { token } = req.params;

  try {
    const session = await SupervisorSession.findOne({ token }).populate('student');
    if (!session) return res.status(404).json({ message: 'Invalid or expired session link.' });

    const logs = await LogEntry.find({ user: session.student._id }).sort({ date: -1 });


    return res.json({
      supervisorName: session.supervisorName,
      student: {
        name: session.student.fullName,
        email: session.student.email,
      },
      logEntries: logs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching session.' });
  }
};





exports.updateLogStatus = async (req, res) => {
  const { logId } = req.params;
  const { status, comment, token } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    const session = await SupervisorSession.findOne({ token }).populate('student');
    if (!session) {
      return res.status(403).json({ message: 'Invalid or expired session.' });
    }

    const log = await LogEntry.findById(logId);
    if (!log || log.user.toString() !== session.student._id.toString()) {
      return res.status(404).json({ message: 'Log entry not found for this student.' });
    }

    log.status = status;
    if (comment) log.comments = comment;

    await log.save();

    // Prepare email content
    const subject = `Your logbook entry has been ${status}`;
    const message = `
      Hi ${session.student.fullName || 'Student'},

      Your logbook entry dated ${new Date(log.date).toLocaleDateString()} has been ${status} by your supervisor.

      ${comment ? `Supervisor's comments: ${comment}` : ''}

      Please log in to your account for more details.

      Regards,
      Your Logbook Team
    `;

    // Send notification email
    await sendEmail(session.student.email, subject, message);

    return res.json({ message: `Log ${status}.`, log });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not update log.' });
  }
};

