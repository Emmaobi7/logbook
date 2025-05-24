const mongoose = require("mongoose");

const supervisorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullName: String,
  email: String,
  phone: String,
  country: String,
  specialty: String,
});

module.exports = mongoose.model("SupervisorProfile", supervisorProfileSchema);
