const { body, validationResult } = require('express-validator');

module.exports = [
  body('title')
    .exists().withMessage('all fields is required')
    .isString().withMessage('Title must be a string'),

  body('description')
    .exists().withMessage('all fields is required')
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
