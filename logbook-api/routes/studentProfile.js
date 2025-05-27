const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, getSupervisorForStudent } = require("../controllers/studentProfile");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const requireRole = require('../middlewares/requireRole');

router.get("/profile", auth, requireRole("student"), getProfile);
router.get("/get-supervisor", auth, requireRole("student"), getSupervisorForStudent);
router.post("/profile", auth, requireRole("student"),  upload.single("passport"), updateProfile);

module.exports = router;
