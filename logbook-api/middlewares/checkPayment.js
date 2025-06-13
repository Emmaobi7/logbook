// middlewares/checkPayment.js
const User = require('../models/User');

const checkPayment = async (req, res, next) => {
  try {
    const student = await User.findById(req.user.userId);
    console.log(req.user)
    if (!student) return res.status(404).json({ message: 'Student not found middleware.' });

    if (!student.hasPaid) {
      return res.status(403).json({
        message: 'Access denied. Payment required to access your logbook.',
      });
    }

    console.log('hello4')
    next();
  } catch (err) {
    console.error('checkPayment error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = checkPayment;
