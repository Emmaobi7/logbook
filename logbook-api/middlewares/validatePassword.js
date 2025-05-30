module.exports = function validatePassword(req, res, next) {
  const password = req.body.password;

  if (typeof password !== 'string') {
    return res.status(400).json({ message: 'Password must be a string.' });
  }

  const isStrong =
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (!isStrong) {
    return res.status(400).json({
      message:
        'Password must be at least 6 characters and include uppercase, lowercase, number, and special character.',
    });
  }

  next();
};
