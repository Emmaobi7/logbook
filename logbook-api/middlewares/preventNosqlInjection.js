function preventNoSQLInjection(req, res, next) {
  const isMalicious = (value) =>
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).some(key => key.startsWith('$'));

  for (const key in req.body) {
    if (isMalicious(req.body[key])) {
      return res.status(400).json({ message: 'Malicious input detected' });
    }
  }

  next();
}

module.exports = preventNoSQLInjection;
