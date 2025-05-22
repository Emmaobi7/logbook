// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const role = "student";

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ fullName, email, password, role });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
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
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid email or password' });

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
