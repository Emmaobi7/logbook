const SupervisorProfile = require("../models/supervisorProfile");

exports.getSupervisorProfile = async (req, res) => {
  try {
    const profile = await SupervisorProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.updateSupervisorProfile = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      specialty: req.body.specialty,
    };

    const profile = await SupervisorProfile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
