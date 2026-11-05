const express = require('express');
const router = express.Router();
const c = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', c.getProducts);
router.get('/:id', c.getProductById);
router.post('/', protect, admin, upload.single('image'), c.createProduct);
router.put('/:id', protect, admin, upload.single('image'), c.updateProduct);
router.delete('/:id', protect, admin, c.deleteProduct);

module.exports = router;