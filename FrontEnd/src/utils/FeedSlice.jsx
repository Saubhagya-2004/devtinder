import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload
        },
        deleteFeed:(state,action)=>null
    }
});
export const{addFeed,deleteFeed} = feedSlice.actions;
export default feedSlice.reducer;