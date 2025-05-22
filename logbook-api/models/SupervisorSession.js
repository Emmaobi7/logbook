// models/SupervisorSession.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const supervisorSessionSchema = new Schema({
  token: { type: String, required: true, unique: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorName: { type: String, required: true },
  supervisorEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // expires after 7 days
});

module.exports = mongoose.model('SupervisorSession', supervisorSessionSchema);
