const express = require('express');
const router = express.Router();
const { createEntry, getMyEntries, exportLogbookPDF, updateLog } = require('../controllers/logbookController');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const checkPayment = require('../middlewares/checkPayment');

router.get('/log', auth, checkPayment, getMyEntries);
router.post('/log', auth, checkPayment, createEntry);
router.get('/export-pdf', auth, checkPayment, exportLogbookPDF);
router.patch('/log/:id', auth, checkPayment, updateLog);



module.exports = router;
