import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
    cartItems: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            const requestedQuantity = action.payload.quantity || 1;
            
            if (!existingItem) {
                // Add new item with the specified quantity
                state.cartItems.push({ 
                    ...action.payload, 
                    quantity: requestedQuantity 
                });
                
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${requestedQuantity} ${requestedQuantity === 1 ? 'item' : 'items'} added to cart`,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                // Update existing item quantity
                const newQuantity = Math.min(99, existingItem.quantity + requestedQuantity);
                existingItem.quantity = newQuantity;
                
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Quantity updated to ${newQuantity}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        
        addToCartWithQuantity: (state, action) => {
            // Alternative action for specific quantity handling
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            const requestedQuantity = action.payload.quantity || 1;
            
            if (!existingItem) {
                state.cartItems.push({ 
                    ...action.payload, 
                    quantity: requestedQuantity 
                });
                
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${requestedQuantity} ${requestedQuantity === 1 ? 'item' : 'items'} added to cart`,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                // Increment by the requested quantity
                const newQuantity = Math.min(99, existingItem.quantity + requestedQuantity);
                existingItem.quantity = newQuantity;
                
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Quantity updated to ${newQuantity}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        
        setCartQuantity: (state, action) => {
            // New action to set exact quantity (useful for single book page)
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            const requestedQuantity = Math.max(1, Math.min(99, action.payload.quantity || 1));
            
            if (!existingItem) {
                state.cartItems.push({ 
                    ...action.payload, 
                    quantity: requestedQuantity 
                });
                
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${requestedQuantity} ${requestedQuantity === 1 ? 'item' : 'items'} added to cart`,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                existingItem.quantity = requestedQuantity;
                
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Quantity set to ${requestedQuantity}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        
        removeFromCart: (state, action) => {
            const itemToRemove = state.cartItems.find(item => item._id === action.payload._id);
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
            
            const itemTitle = itemToRemove?.title || 'Item';
            Swal.fire({
                position: "top-end",
                icon: "info",
                title: `${itemTitle} removed from cart`,
                showConfirmButton: false,
                timer: 1500
            });
        },
        
        clearCart: (state) => {
            const itemCount = state.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
            state.cartItems = [];
            
            Swal.fire({
                position: "top-end",
                icon: "info",
                title: `Cart cleared (${itemCount} ${itemCount === 1 ? 'item' : 'items'} removed)`,
                showConfirmButton: false,
                timer: 1500
            });
        },
        
        updateQuantity: (state, action) => {
            const { product, quantity } = action.payload;
            const validQuantity = Math.max(1, Math.min(99, quantity));
            const existingItem = state.cartItems.find(item => item._id === product._id);
            
            if (existingItem) {
                existingItem.quantity = validQuantity;
                
                // Optional: Show notification for quantity updates
                // Swal.fire({
                //     position: "top-end",
                //     icon: "success",
                //     title: `Quantity updated to ${validQuantity}`,
                //     showConfirmButton: false,
                //     timer: 1000
                // });
            }
        },
        
        incrementQuantity: (state, action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            
            if (existingItem && existingItem.quantity < 99) {
                existingItem.quantity += 1;
            }
        },
        
        decrementQuantity: (state, action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    // Remove item if quantity would be 0
                    state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
                    
                    Swal.fire({
                        position: "top-end",
                        icon: "info",
                        title: "Item removed from cart",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        },
        
        // Silent actions (without notifications) for UI interactions
        updateQuantitySilent: (state, action) => {
            const { product, quantity } = action.payload;
            const validQuantity = Math.max(1, Math.min(99, quantity));
            const existingItem = state.cartItems.find(item => item._id === product._id);
            
            if (existingItem) {
                existingItem.quantity = validQuantity;
            }
        }
    }
})

// Export the actions   
export const { 
    addToCart, 
    addToCartWithQuantity, 
    setCartQuantity,
    removeFromCart, 
    clearCart, 
    updateQuantity,
    updateQuantitySilent,
    incrementQuantity,
    decrementQuantity
} = cartSlice.actions;

export default cartSlice.reducer;