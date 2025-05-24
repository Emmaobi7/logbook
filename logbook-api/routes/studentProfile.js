const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/studentProfile");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

router.get("/profile", auth, getProfile);
router.post("/profile", auth, upload.single("passport"), updateProfile);

module.exports = router;
