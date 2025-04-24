import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    cartItems :[]

}

const cartSlice = createSlice({
    name:'cart',
    initialState:initialState,
    reducers:{
        addToCart:(state,action)=>{
            const existingItem = state.cartItems.find(item =>item._id === action.payload._id)
            if(!existingItem){
                state.cartItems.push(action.payload);
                alert("Item added succesfully !")
            } else {
                alert("Item already exists !");
            }
        }
    }
    
})

///export actions

export const {addToCart} = cartSlice.actions;
export default cartSlice.reducer;