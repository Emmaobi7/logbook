const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Example protected route
router.get('/dashboard', auth, (req, res) => {
  res.json({ message: `Hello ${req.user.role}, welcome to your dashboard.` });
});

module.exports = router;
