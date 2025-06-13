const { body, validationResult } = require('express-validator');

module.exports = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ min: 5 }).withMessage('Description too short'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];
