// routes/supervisor.js

const express = require('express');
const router = express.Router();
const { inviteSupervisor, getSessionDetails, updateLogStatus } = require('../controllers/supervisorController');
const protect = require('../middlewares/auth');

router.post('/invite', protect, inviteSupervisor);
router.get('/session/:token', getSessionDetails);
router.post('/log/:logId/update', updateLogStatus);

module.exports = router;
