const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { verifyPayment, handleWebhook } = require('../controllers/paymentController');

router.post('/verify', auth, verifyPayment);
router.post('/webhook', handleWebhook); // No auth middleware!
module.exports = router;
