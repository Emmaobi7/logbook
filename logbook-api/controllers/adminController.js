// controllers/adminController.js
const User = require("../models/User");
// controllers/adminController.js
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const SupervisorInvitation = require('../models/SupervisorInvitation');
const SupervisorSession = require('../models/SupervisorSession');
const generateToken = require('../utils/generateToken');
const Logbook = require('../models/LogbookEntry');
const StudentProfile = require("../models/studentProfile");



exports.getStats = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();

    // Count supervisors
    const supervisors = await User.countDocuments({ role: "supervisor" });

    // Count students
    const students = await User.countDocuments({ role: "student" });

    res.json({
      users: totalUsers,
      supervisors,
      students,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};





exports.getUsers = async (req, res) => {
  try {
    const { role, isActive, hasPaid, search } = req.query;

    const filters = {};

    if (role) filters.role = role;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (hasPaid !== undefined) filters.hasPaid = hasPaid === 'true';

    if (search) {
      // Case-insensitive partial match on email or fullName
      filters.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filters).select('-password').sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};




exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id if you want (optional)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
};





exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      role,
      isActive,
      hasPaid,
      paymentDetails, // should be an object { amount, date, method, ref }
    } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (typeof hasPaid === 'boolean') user.hasPaid = hasPaid;

    if (hasPaid && paymentDetails) {
      user.paymentDetails = {
        amount: paymentDetails.amount,
        date: paymentDetails.date || new Date(),
        method: paymentDetails.method || 'manual',
        ref: paymentDetails.ref || 'manual-entry',
      };
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        hasPaid: user.hasPaid,
        paymentDetails: user.paymentDetails,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};


exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = false;
    await user.save();

    res.json({ message: 'User has been deactivated', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to deactivate user' });
  }
};



exports.reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = true;
    await user.save();

    res.json({ message: 'User has been reactivated', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reactivate user' });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete related notifications (sent to or about the user)
    await Notification.deleteMany({ user: id });

    // Delete supervisor invitations where the user is a student or email matches supervisor
    await SupervisorInvitation.deleteMany({
      $or: [{ student: id }, { supervisorEmail: user.email }]
    });

    // Delete supervisor sessions
    await SupervisorSession.deleteMany({
      $or: [{ student: id }, { supervisorEmail: user.email }]
    });

    // Optional: delete user's logbook entries
    await Logbook.deleteMany({ user: id });

    // Delete the user itself
    await User.findByIdAndDelete(id);

    res.json({ message: 'User and related data permanently deleted', userId: id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user and related data' });
  }
};




exports.sendNotifications = async (req, res) => {
  try {
    const { title, message, sendEmail: emailFlag, criteria, userIds = [] } = req.body;

    let users = [];

    if (criteria === 'single' && userIds.length === 1) {
      users = await User.find({ _id: userIds[0] });
    } else if (criteria === 'multiple') {
      users = await User.find({ _id: { $in: userIds } });
    } else if (criteria === 'students') {
      users = await User.find({ role: 'student' });
    } else if (criteria === 'supervisors') {
      users = await User.find({ role: 'supervisor' });
    } else {
      return res.status(400).json({ message: 'Invalid criteria' });
    }

    const notifications = users.map(user => ({
      user: user._id,
      title,
      message,
    }));

    await Notification.insertMany(notifications);

    if (emailFlag) {
      for (const user of users) {
        await sendEmail(
          user.email,
          title,
          `Hi ${user.fullName},\n\n${message}`
        );
      }
    }

    res.status(200).json({ message: 'Notification(s) sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
};


exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .populate('user', 'fullName email role') // populate recipient info
      .sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};







exports.assignStudentsToSupervisor = async (req, res) => {
  const { supervisorId, studentIds } = req.body;

  if (!supervisorId || !Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ message: 'Supervisor and students are required.' });
  }

  const supervisor = await User.findById(supervisorId);
  if (!supervisor || supervisor.role !== 'supervisor') {
    return res.status(404).json({ message: 'Supervisor not found or invalid.' });
  }

  try {
    for (const studentId of studentIds) {
      const student = await User.findById(studentId);
      if (!student) continue; // skip if student not found

      const token = generateToken();

      // Create SupervisorInvitation
      const invitation = new SupervisorInvitation({
        student: studentId,
        supervisorName: 'Assigned by admin', // not important
        supervisorEmail: supervisor.email,
        secureToken: token,
      });

      await invitation.save();

      // Create SupervisorSession
      const session = new SupervisorSession({
        student: studentId,
        supervisorName: supervisor.fullName || 'Supervisor',
        supervisorEmail: supervisor.email,
        token,
      });

      await session.save();

      // Send invitation email
      const link = `${process.env.CLIENT_URL}/supervisor/review/${token}`;
      await sendEmail(
        supervisor.email,
        'New Logbook Review Invitation',
        `Hi ${supervisor.fullName || 'Supervisor'},\n\nYou’ve been assigned to review a student’s logbook.\nClick the link below to begin:\n\n${link}`
      );
    }

    return res.status(200).json({ message: 'Students assigned to supervisor successfully.' });
  } catch (err) {
    console.error('Error assigning students:', err);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};




exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve notifications' });
  }
};





exports.getStudentsUnderSupervisor = async (req, res) => {
  const supervisorEmail = req.query.email;

  try {
    const sessions = await SupervisorSession.find({ supervisorEmail })
      .populate('student', 'fullName email department') // choose fields you want to expose

    const students = sessions.map(session => ({
      studentId: session.student._id,
      fullName: session.student.fullName,
      email: session.student.email,
      department: session.student.department,
      sessionToken: session.token,
    }));

    return res.status(200).json({ students });
  } catch (err) {
    console.error('Error fetching students:', err);
    return res.status(500).json({ message: 'Failed to fetch students.' });
  }
};




exports.removeStudentFromSupervisor = async (req, res) => {

  const studentId = req.params.studentId;
  const supervisorEmail = req.query.email;


  if (!studentId || !supervisorEmail) {
    return res.status(400).json({ message: 'Student ID and supervisor email are required.' });
  }

  try {
    // Remove session
    const session = await SupervisorSession.findOneAndDelete({
      student: studentId,
      supervisorEmail
    });

    // Optional: Also remove pending invitations (if needed)
    await SupervisorInvitation.deleteMany({
      student: studentId,
      supervisorEmail,
      invitationStatus: 'pending',
    });


    if (!session) {
      return res.status(404).json({ message: 'No session found for this student and supervisor.' });
    }

    // Optionally: notify student here
    const student = await User.findById(studentId);
    await sendEmail(
      student.email,
      'You have been unassigned from your supervisor',
      `Hello ${student.fullName},\n\nYou have been removed from supervision by ${supervisorEmail}. Please contact your coordinator if this was a mistake.`
    );

    return res.status(200).json({ message: 'Student removed from supervisor successfully.' });
  } catch (err) {
    console.error('Error removing student:', err);
    return res.status(500).json({ message: 'Failed to remove student.' });
  }
};
