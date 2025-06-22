// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../cart/cart.controller');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const { validateCart, validateQuantityUpdate } = require('../middleware/validation');

// Apply optional authentication to all cart routes
// This allows both authenticated users and guests to use the cart
router.use(optionalAuth);

// GET /api/cart - Get user's cart
router.get('/', cartController.getCart);

// POST /api/cart/add - Add item to cart
router.post('/add', validateCart, cartController.addToCart);

// PUT /api/cart/update/:bookId - Update item quantity
router.put('/update/:bookId', validateQuantityUpdate, cartController.updateQuantity);

// DELETE /api/cart/remove/:bookId - Remove item from cart
router.delete('/remove/:bookId', cartController.removeFromCart);

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', cartController.clearCart);

// POST /api/cart/merge - Merge guest cart with user cart (after login)
router.post('/merge', authenticateToken, cartController.mergeCart);

module.exports = router;