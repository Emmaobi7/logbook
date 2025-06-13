const sanitizeHtml = require('sanitize-html');

function sanitizeBody(req, res, next) {
  const methodsToSanitize = ['POST', 'PUT', 'PATCH'];
  if (methodsToSanitize.includes(req.method) && req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
  }
  next();
}


module.exports = sanitizeBody;