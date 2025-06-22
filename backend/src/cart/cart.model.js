// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    category: {
        type: String
    },
    coverImage: {
        type: String
    },
    newPrice: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 99,
        default: 1
    }
}, {
    _id: false // Disable _id for subdocuments
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true // Allow null for guest users
    },
    sessionId: {
        type: String,
        required: function() {
            return !this.userId; // Required if no userId (guest user)
        }
    },
    items: [cartItemSchema],
    totalItems: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to calculate totals before saving
cartSchema.pre('save', function(next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + (item.newPrice * item.quantity), 0);
    next();
});

// Index for efficient queries
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ updatedAt: 1 }); // For cleanup of old carts

// Static method to find cart by user or session
cartSchema.statics.findByUserOrSession = function(userId, sessionId) {
    if (userId) {
        return this.findOne({ userId });
    }
    return this.findOne({ sessionId });
};

// Instance method to add item to cart
cartSchema.methods.addItem = function(itemData) {
    const existingItemIndex = this.items.findIndex(
        item => item.bookId.toString() === itemData.bookId.toString()
    );

    if (existingItemIndex > -1) {
        // Update existing item quantity
        const newQuantity = Math.min(99, this.items[existingItemIndex].quantity + (itemData.quantity || 1));
        this.items[existingItemIndex].quantity = newQuantity;
    } else {
        // Add new item
        this.items.push({
            bookId: itemData.bookId,
            title: itemData.title,
            author: itemData.author,
            category: itemData.category,
            coverImage: itemData.coverImage,
            newPrice: itemData.newPrice,
            oldPrice: itemData.oldPrice,
            quantity: itemData.quantity || 1
        });
    }
    
    return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(bookId, quantity) {
    const item = this.items.find(item => item.bookId.toString() === bookId.toString());
    
    if (item) {
        item.quantity = Math.max(1, Math.min(99, quantity));
        return this.save();
    }
    
    throw new Error('Item not found in cart');
};

// Instance method to remove item
cartSchema.methods.removeItem = function(bookId) {
    this.items = this.items.filter(item => item.bookId.toString() !== bookId.toString());
    return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
    this.items = [];
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;