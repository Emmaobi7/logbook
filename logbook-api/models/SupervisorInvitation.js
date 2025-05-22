// models/SupervisorInvitation.js

const mongoose = require('mongoose');

const supervisorInvitationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  supervisorName: {
    type: String,
    required: true,
  },
  supervisorEmail: {
    type: String,
    required: true,
  },
  invitationStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  secureToken: {
    type: String,
    required: true,
    unique: true,
  },
  invitedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SupervisorInvitation', supervisorInvitationSchema);
