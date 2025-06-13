// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const ResetToken = require('../models/ResetTokens');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  let { fullName, email, password, role } = req.body;

  // Normalize the role
  if (!role || role.trim() === '') {
    role = 'student';
  }

  const allowedRoles = ['student', 'admin', 'supervisor'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid user role' });
  }

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing required fields'});
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });


    const user = await User.create({ fullName, email, password, role });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Optional: Remove password before sending response
    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: userWithoutPassword,
    });

    // Send welcome email
    await sendEmail(email, 'Welcome to Logbook App', `Hello ${fullName}, your account has been created.`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating account" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid email or password' });

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ token, user: { fullName: user.fullName, role: user.role, email: user.email, id: user._id } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};






exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account with that email." });

    // Optional: delete existing reset tokens for the user (to avoid multiple tokens)
    await ResetToken.deleteMany({ userId: user._id });

    const token = generateToken();

    // Save token to database with expiry (via TTL in schema)
    await ResetToken.create({ userId: user._id, token });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail(
      email,
      "Password Reset Request",
      `Hi ${user.fullName},\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you didn't request this, you can ignore this email.`
    );

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process request." });
  }
};




exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    return res.status(400).json({ message: "Missing token or password." });

  try {
    const tokenDoc = await ResetToken.findOne({ token });
    if (!tokenDoc)
      return res.status(400).json({ message: "Invalid or expired token." });

    const user = await User.findById(tokenDoc.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.password = newPassword;
    await user.save();

    // Delete token after successful reset
    await ResetToken.deleteOne({ _id: tokenDoc._id });

    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not reset password." });
  }
};

