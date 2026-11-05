const express = require('express');
const router = express.Router();
const c = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', c.getReviews);
router.post('/:id', protect, c.addReview);

module.exports = router;