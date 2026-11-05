const express = require('express');
const router = express.Router();
const c = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', c.getCart);
router.post('/', c.addToCart);
router.put('/:productId', c.updateCartItem);
router.delete('/:productId', c.removeCartItem);
router.delete('/', c.clearCart);

module.exports = router;