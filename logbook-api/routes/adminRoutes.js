// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/auth"); // Your auth middleware
const requireRole = require('../middlewares/requireRole');

router.get("/stats", authMiddleware, requireRole("admin"), adminController.getStats);
router.get("/users", authMiddleware, requireRole("admin"), adminController.getUsers);
router.get("/users/:id", authMiddleware, requireRole("admin"), adminController.getUserById);
router.put("/users/:id", authMiddleware, requireRole("admin"), adminController.updateUser);
router.patch("/users/:id/deactivate", authMiddleware, requireRole("admin"), adminController.deactivateUser);
router.patch("/users/:id/reactivate", authMiddleware, requireRole("admin"), adminController.reactivateUser);
router.delete("/users/:id", authMiddleware, requireRole("admin"), adminController.deleteUser);
router.post("/users/notify", authMiddleware, requireRole("admin"), adminController.sendNotifications);
router.get("/sent", authMiddleware, requireRole("admin"), adminController.getAllNotifications);
router.post("/supervisor/invite", authMiddleware, requireRole("admin"), adminController.assignStudentsToSupervisor);
router.get("/my", authMiddleware, adminController.getMyNotifications);
router.get("/students", authMiddleware, adminController.getStudentsUnderSupervisor);
router.delete('/rm-student/:studentId', authMiddleware, adminController.removeStudentFromSupervisor);







module.exports = router;
