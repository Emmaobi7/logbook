// models/ResetToken.js
const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 900 }, // auto-delete after 15 minutes
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
