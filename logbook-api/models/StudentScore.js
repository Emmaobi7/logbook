const mongoose = require('mongoose');

const studentScoreSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorName: { type: String, required: true },
  supervisorEmail: { type: String, required: true },
  punctuality: { type: Number, min: 1, max: 5, required: true },
  abilityToWorkUnsupervised: { type: Number, min: 1, max: 5, required: true },
  teamPlaying: { type: Number, min: 1, max: 5, required: true },
  initiative: { type: Number, min: 1, max: 5, required: true },
  interpersonalRelationship: { type: Number, min: 1, max: 5, required: true },
  attitudeToWork: { type: Number, min: 1, max: 5, required: true },
  senseOfResponsibility: { type: Number, min: 1, max: 5, required: true },
  appearance: { type: Number, min: 1, max: 5, required: true },
  leadershipAbilities: { type: Number, min: 1, max: 5, required: true },
  problemSolvingAbilities: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now, immutable: true }
});

studentScoreSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('StudentScore', studentScoreSchema); 