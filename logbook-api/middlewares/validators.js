const { body } = require('express-validator');

exports.registerValidator = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').isLength({ min: 2 }).trim().matches(/^[a-zA-Z0-9 \-'.]+$/)
  .withMessage('Name contains invalid characters')
];
