const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullName: String,
  number: String,
  program: String,
  phone: String,
  faculty: String,
  specialty: String,
  country: String,
  residencySite: String,
  residencyPeriod: String,
  preceptorName: String,
  passport: String, // URL or filename of uploaded image
}, {
  timestamps: true,
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
