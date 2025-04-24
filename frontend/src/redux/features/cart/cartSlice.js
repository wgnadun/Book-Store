import {createSlice, createSlice,createSlice} from '@reduxjs/toolkit'

const intialState = {
    cartItems :[]

}

const createSlice = createSlice({
    name:'cart',
    intialState,
    reduceres:{
        addToCart:(state,action)=>{
            const existingItem = state.cartItems.find(item =>item._id === action.payload._id)
            if(!existingItem){
                state.cartItems.payload
            }
        }
    }
    
})