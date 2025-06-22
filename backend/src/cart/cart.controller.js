// controllers/cartController.js
const Cart = require('../cart/cart.model');
const Book = require('../books/book.model');

class CartController {
    // Get user's cart
    async getCart(req, res) {
        try {
            const { userId } = req.user || {};
            const sessionId = req.sessionID;

            let cart = await Cart.findByUserOrSession(userId, sessionId)
                .populate('items.bookId', 'title author category coverImage newPrice oldPrice');

            if (!cart) {
                cart = new Cart({
                    userId: userId || null,
                    sessionId: userId ? null : sessionId,
                    items: []
                });
                await cart.save();
            }

            res.status(200).json({
                success: true,
                data: {
                    cart: {
                        _id: cart._id,
                        items: cart.items.map(item => ({
                            _id: item.bookId._id,
                            title: item.title,
                            author: item.author,
                            category: item.category,
                            coverImage: item.coverImage,
                            newPrice: item.newPrice,
                            oldPrice: item.oldPrice,
                            quantity: item.quantity
                        })),
                        totalItems: cart.totalItems,
                        totalAmount: cart.totalAmount
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch cart',
                error: error.message
            });
        }
    }

    // Add item to cart
    async addToCart(req, res) {
        try {
            const { bookId, quantity = 1 } = req.body;
            const { userId } = req.user || {};
            const sessionId = req.sessionID;

            // Validate book exists
            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: 'Book not found'
                });
            }

            // Find or create cart
            let cart = await Cart.findByUserOrSession(userId, sessionId);
            
            if (!cart) {
                cart = new Cart({
                    userId: userId || null,
                    sessionId: userId ? null : sessionId,
                    items: []
                });
            }

            // Add item to cart
            await cart.addItem({
                bookId: book._id,
                title: book.title,
                author: book.author,
                category: book.category,
                coverImage: book.coverImage,
                newPrice: book.newPrice,
                oldPrice: book.oldPrice,
                quantity: parseInt(quantity)
            });

            // Populate and return updated cart
            const updatedCart = await Cart.findById(cart._id)
                .populate('items.bookId', 'title author category coverImage newPrice oldPrice');

            res.status(200).json({
                success: true,
                message: 'Item added to cart successfully',
                data: {
                    cart: {
                        _id: updatedCart._id,
                        items: updatedCart.items.map(item => ({
                            _id: item.bookId._id,
                            title: item.title,
                            author: item.author,
                            category: item.category,
                            coverImage: item.coverImage,
                            newPrice: item.newPrice,
                            oldPrice: item.oldPrice,
                            quantity: item.quantity
                        })),
                        totalItems: updatedCart.totalItems,
                        totalAmount: updatedCart.totalAmount
                    }
                }
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to add item to cart',
                error: error.message
            });
        }
    }

    // Update item quantity
    async updateQuantity(req, res) {
        try {
            const { bookId } = req.params;
            const { quantity } = req.body;
            const { userId } = req.user || {};
            const sessionId = req.sessionID;

            const cart = await Cart.findByUserOrSession(userId, sessionId);
            
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            await cart.updateItemQuantity(bookId, parseInt(quantity));

            // Return updated cart
            const updatedCart = await Cart.findById(cart._id)
                .populate('items.bookId', 'title author category coverImage newPrice oldPrice');

            res.status(200).json({
                success: true,
                message: 'Quantity updated successfully',
                data: {
                    cart: {
                        _id: updatedCart._id,
                        items: updatedCart.items.map(item => ({
                            _id: item.bookId._id,
                            title: item.title,
                            author: item.author,
                            category: item.category,
                            coverImage: item.coverImage,
                            newPrice: item.newPrice,
                            oldPrice: item.oldPrice,
                            quantity: item.quantity
                        })),
                        totalItems: updatedCart.totalItems,
                        totalAmount: updatedCart.totalAmount
                    }
                }
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update quantity',
                error: error.message
            });
        }
    }

    // Remove item from cart
    async removeFromCart(req, res) {
        try {
            const { bookId } = req.params;
            const { userId } = req.user || {};
            const sessionId = req.sessionID;

            const cart = await Cart.findByUserOrSession(userId, sessionId);
            
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            await cart.removeItem(bookId);

            // Return updated cart
            const updatedCart = await Cart.findById(cart._id)
                .populate('items.bookId', 'title author category coverImage newPrice oldPrice');

            res.status(200).json({
                success: true,
                message: 'Item removed from cart successfully',
                data: {
                    cart: {
                        _id: updatedCart._id,
                        items: updatedCart.items.map(item => ({
                            _id: item.bookId._id,
                            title: item.title,
                            author: item.author,
                            category: item.category,
                            coverImage: item.coverImage,
                            newPrice: item.newPrice,
                            oldPrice: item.oldPrice,
                            quantity: item.quantity
                        })),
                        totalItems: updatedCart.totalItems,
                        totalAmount: updatedCart.totalAmount
                    }
                }
            });
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to remove item from cart',
                error: error.message
            });
        }
    }

    // Clear entire cart
    async clearCart(req, res) {
        try {
            const { userId } = req.user || {};
            const sessionId = req.sessionID;

            const cart = await Cart.findByUserOrSession(userId, sessionId);
            
            if (!cart) {
                return res.status(404).json({
                    success: false,
                    message: 'Cart not found'
                });
            }

            await cart.clearCart();

            res.status(200).json({
                success: true,
                message: 'Cart cleared successfully',
                data: {
                    cart: {
                        _id: cart._id,
                        items: [],
                        totalItems: 0,
                        totalAmount: 0
                    }
                }
            });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to clear cart',
                error: error.message
            });
        }
    }

    // Merge guest cart with user cart (for login)
    async mergeCart(req, res) {
        try {
            const { userId } = req.user;
            const { guestCartItems } = req.body;
            const sessionId = req.sessionID;

            // Find user's existing cart
            let userCart = await Cart.findOne({ userId });
            
            if (!userCart) {
                userCart = new Cart({
                    userId,
                    items: []
                });
            }

            // Merge guest cart items
            for (const guestItem of guestCartItems) {
                const book = await Book.findById(guestItem._id);
                if (book) {
                    await userCart.addItem({
                        bookId: book._id,
                        title: book.title,
                        author: book.author,
                        category: book.category,
                        coverImage: book.coverImage,
                        newPrice: book.newPrice,
                        oldPrice: book.oldPrice,
                        quantity: guestItem.quantity
                    });
                }
            }

            // Delete guest cart if exists
            await Cart.deleteOne({ sessionId });

            // Return merged cart
            const updatedCart = await Cart.findById(userCart._id)
                .populate('items.bookId', 'title author category coverImage newPrice oldPrice');

            res.status(200).json({
                success: true,
                message: 'Cart merged successfully',
                data: {
                    cart: {
                        _id: updatedCart._id,
                        items: updatedCart.items.map(item => ({
                            _id: item.bookId._id,
                            title: item.title,
                            author: item.author,
                            category: item.category,
                            coverImage: item.coverImage,
                            newPrice: item.newPrice,
                            oldPrice: item.oldPrice,
                            quantity: item.quantity
                        })),
                        totalItems: updatedCart.totalItems,
                        totalAmount: updatedCart.totalAmount
                    }
                }
            });
        } catch (error) {
            console.error('Error merging cart:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to merge cart',
                error: error.message
            });
        }
    }
}

module.exports = new CartController();