const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { optionalAuth, authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

// Admin operations
router.post('/', authenticateToken, requireAdmin, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
