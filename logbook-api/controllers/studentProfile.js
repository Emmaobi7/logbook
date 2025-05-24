const StudentProfile = require("../models/studentProfile");
const path = require("path");
const fs = require("fs");


exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};





exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      faculty: req.body.faculty,
      specialty: req.body.specialty,
      country: req.body.country,
      residencySite: req.body.residencySite,
    };

    const profile = await StudentProfile.findOne({ user: req.user.userId });

    // If a new file is uploaded, remove the old one
    if (req.file) {
      // Delete the old passport file if it exists
      if (profile && profile.passport) {
        const oldPath = path.join(__dirname, "../public", profile.passport);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Set the new image path
      updates.passport = `/uploads/${req.file.filename}`;
    }

    // Update the profile (upsert will create it if it doesn't exist)
    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

