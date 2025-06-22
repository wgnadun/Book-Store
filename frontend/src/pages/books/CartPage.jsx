import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';
import Swal from 'sweetalert2';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.newPrice * (item.quantity || 1)), 0);
    const total = subtotal;
    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleClearCart = () => {
        // Using SweetAlert2 for confirmation
        Swal.fire({
            title: 'Clear Cart?',
            text: 'Are you sure you want to remove all items from your cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear cart',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(clearCart());
                Swal.fire({
                    title: 'Cart Cleared!',
                    text: 'All items have been removed from your cart.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleIncreaseQuantity = (product) => {
        const newQuantity = Math.min(99, (product.quantity || 1) + 1);
        dispatch(updateQuantity({ product, quantity: newQuantity }));
    };

    const handleDecreaseQuantity = (product) => {
        const newQuantity = (product.quantity || 1) - 1;
        if (newQuantity > 0) {
            dispatch(updateQuantity({ product, quantity: newQuantity }));
        } else {
            dispatch(removeFromCart(product));
        }
    };

    const handleQuantityChange = (product, newQuantity) => {
        const quantity = Math.max(1, Math.min(99, parseInt(newQuantity) || 1));
        dispatch(updateQuantity({ product, quantity }));
    };

    // Handle checkout process
    const handleProceedToCheckout = () => {
        // Validate cart is not empty
        if (cartItems.length === 0) {
            Swal.fire({
                title: 'Cart is Empty',
                text: 'Please add items to your cart before proceeding to checkout.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Option 1: Navigate to checkout page
        navigate('/checkout');
    };

    // Empty Cart Component
    const EmptyCart = () => (
        <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18h7" />
                </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
                Start shopping to add items to your cart
            </p>
            <Link
                to="/"
                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
            >
                Continue Shopping
            </Link>
        </div>
    );

    // Cart Item Component
    const CartItem = ({ product }) => (
        <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-md hover:shadow-sm transition-shadow duration-200">
            {/* Product Image */}
            <Link to={`/books/${product?._id}`} className="flex-shrink-0">
                <div className="w-20 h-24 overflow-hidden rounded-md bg-gray-100 hover:opacity-90 transition-opacity duration-200">
                    <img
                        src={getImgUrl(product?.coverImage)}
                        alt={product?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x300/e2e8f0/64748b?text=Book+Cover';
                        }}
                    />
                </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <Link 
                            to={`/books/${product?._id}`}
                            className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                        >
                            {product?.title}
                        </Link>
                        {product?.author && (
                            <p className="text-sm text-gray-600 mt-1 truncate">
                                by {product?.author}
                            </p>
                        )}
                        {product?.category && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                                {product.category}
                            </span>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                            <p className="text-base font-medium text-gray-900">
                                ${product?.newPrice}
                            </p>
                            {product?.oldPrice && product?.oldPrice !== product?.newPrice && (
                                <p className="text-sm text-gray-500 line-through">
                                    ${product?.oldPrice}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right ml-4">
                        <p className="text-base font-medium text-gray-900">
                            ${((product?.newPrice || 0) * (product.quantity || 1)).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            ${product?.newPrice} × {product.quantity || 1}
                        </p>
                    </div>
                </div>

                {/* Quantity and Remove */}
                <div className="mt-4 flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-3">
                            Qty:
                        </span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                                onClick={() => handleDecreaseQuantity(product)}
                                className="p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={(product.quantity || 1) <= 1}
                                title="Decrease quantity"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={product.quantity || 1}
                                onChange={(e) => handleQuantityChange(product, e.target.value)}
                                className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                onClick={() => handleIncreaseQuantity(product)}
                                className="p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={(product.quantity || 1) >= 99}
                                title="Increase quantity"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium rounded-md transition-colors duration-200"
                        title="Remove from cart"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );

    // Order Summary Component
    const OrderSummary = () => (
        <div className="bg-white border border-gray-200 rounded-md p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                        Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="text-xl font-semibold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <button
                    className="w-full flex justify-center items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200"
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                >
                    Proceed to Checkout
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                
                <Link
                    to="/"
                    className="w-full flex justify-center items-center px-6 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium rounded-md transition-colors duration-200 hover:bg-gray-50"
                >
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                </Link>
            </div>
            
            {/* Cart Summary */}
            {cartItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Items in cart:</h3>
                    <div className="space-y-1">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex justify-between text-xs text-gray-600">
                                <span className="truncate mr-2">{item.title}</span>
                                <span className="whitespace-nowrap">×{item.quantity || 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-medium text-gray-900">Shopping Cart</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {totalItems > 0 
                                    ? `${totalItems} ${totalItems === 1 ? 'item' : 'items'} • $${total.toFixed(2)} total`
                                    : 'No items in cart'
                                }
                            </p>
                        </div>
                        
                        {cartItems.length > 0 && (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/"
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors duration-200"
                                >
                                    Add More Items
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            {/* Clear Cart Button - Top Right of Cart Items */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Cart Items</h2>
                                <button
                                    onClick={handleClearCart}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Clear Cart
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {cartItems.map((product) => (
                                    <CartItem key={product?._id} product={product} />
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <OrderSummary />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;