const express = require('express');
const router = express.Router();
const c = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/my', protect, c.getMyOrders);
router.get('/', protect, admin, c.getAllOrders);
router.put('/:id/status', protect, admin, c.updateOrderStatus);

module.exports = router;