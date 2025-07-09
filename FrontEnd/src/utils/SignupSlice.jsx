import { createSlice } from "@reduxjs/toolkit";


const SignupSlice = createSlice({
    name:"signup",
    initialState:null,
    reducers:{
        newUser:(state,action)=>{
            return action.payload
        }
    }
});
export const{newUser} = SignupSlice.actions;
export default SignupSlice.reducer;