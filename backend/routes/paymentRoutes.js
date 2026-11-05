const express = require('express');
const router = express.Router();
const c = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/razorpay/create', protect, c.createRazorpayOrder);
router.post('/razorpay/verify', protect, c.verifyAndCreateOrder);
router.post('/simulate', protect, c.createSimulatedOrder);

module.exports = router;