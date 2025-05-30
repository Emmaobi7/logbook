const sanitizeHtml = require('sanitize-html');

function sanitizeBody(req, res, next) {
  if (req.method === 'POST' && req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],       // remove all tags
          allowedAttributes: {}, // remove all attributes
        });
      }
    }
  }
  next();
}

module.exports = sanitizeBody;