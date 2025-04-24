import {createSlice} from '@reduxjs/toolkit'

const intialState = {
    cartItems :[]

}

const cartSlice = createSlice({
    name:'cart',
    intialState,
    reducers:{
        addToCart:(state,action)=>{
            const existingItem = state.cartItems.find(item =>item._id === action.payload._id)
            if(!existingItem){
                state.cartItems.push(action.payload);
            } else {
                alert("Item already exists");
            }
        }
    }
    
})

///export actions

export const {addToCart} = cartSlice.actions;
export default cartSlice.reducer;