const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, getSupervisorForStudent } = require("../controllers/studentProfile");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const requireRole = require('../middlewares/requireRole');




/**
 * @swagger
 * /student/profile:
 *   get:
 *     summary: Get the authenticated student's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - user does not have student role
 */
router.get("/profile", auth, requireRole("student"), getProfile);


/**
 * @swagger
 * /student/get-supervisor:
 *   get:
 *     summary: Get the supervisor assigned to the authenticated student
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supervisor info retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - user does not have student role
 */
router.get("/get-supervisor", auth, requireRole("student"), getSupervisorForStudent);





/**
 * @swagger
 * /student/profile:
 *   post:
 *     summary: Update authenticated student's profile including uploading passport photo
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               passport:
 *                 type: string
 *                 format: binary
 *             required:
 *               - passport
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request - invalid data
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - user does not have student role
 */
router.post("/profile", auth, requireRole("student"),  upload.single("passport"), updateProfile);

module.exports = router;
