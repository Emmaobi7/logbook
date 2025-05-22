// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'supervisor', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now },

  hasPaid: {
    type: Boolean,
    default: false,
  },
  paymentDetails: {
    amount: Number,
    date: Date,
    method: String, // e.g., "Paystack", "Flutterwave", etc.
    ref: String,    // Payment reference/transaction ID
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
