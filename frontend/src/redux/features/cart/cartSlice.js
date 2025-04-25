import {createSlice} from '@reduxjs/toolkit'
import  Swal  from 'sweetalert2';

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
                Swal
                .fire({
                    position: "center",
                    icon: "success",
                    title: "Successfully added to the cart !",
                    showConfirmButton: false,
                    timer: 1500
                  });            } else {
                    Swal.fire({
                        title: " Oops !",
                        text:"This products is already exists your in Cart !",
                        icon: "warning",
                        showConfirmButton:true,
                        confirmButtonColor: "#E84B3D",
                        iconColor:"#d33"
                      });
            }
        }
    }
    
})

///export actions

export const {addToCart} = cartSlice.actions;
export default cartSlice.reducer;