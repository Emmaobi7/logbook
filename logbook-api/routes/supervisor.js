// routes/supervisor.js

const express = require('express');
const router = express.Router();
const { exportAllLogs, exportStudentLogs } = require("../controllers/supervisorExports");
const { inviteSupervisor, getSessionDetails, updateLogStatus } = require('../controllers/supervisorController');
const { getDashboardStats, getRecentLogs, getStudentLogs, updateLogStatusPage } = require('../controllers/supervisorPageController');
const protect = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

router.post('/invite', protect, inviteSupervisor);
router.get('/session/:token', getSessionDetails);
router.post('/log/:logId/update', updateLogStatus);


router.get("/dashboard-stats", protect, requireRole("supervisor"), getDashboardStats);
router.get("/recent-logs", protect, requireRole("supervisor"), getRecentLogs);
router.get("/student-logs", protect, requireRole("supervisor"), getStudentLogs);
router.patch("/student-logs/:logId", protect, requireRole("supervisor"), updateLogStatusPage);



router.get("/export/logs/all", protect, requireRole("supervisor"), exportAllLogs);
router.get("/export/logs/student/:studentId", protect, requireRole("supervisor"), exportStudentLogs);

module.exports = router;
