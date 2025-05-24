const express = require("express");
const router = express.Router();
const { getSupervisorProfile, updateSupervisorProfile } = require("../controllers/supervisorProfileController");
const authenticate = require("../middlewares/auth");
const requireRole = require('../middlewares/requireRole');

router.get("/profile", authenticate, requireRole("supervisor"), getSupervisorProfile);
router.put("/profile", authenticate, requireRole("supervisor"), updateSupervisorProfile);

module.exports = router;
