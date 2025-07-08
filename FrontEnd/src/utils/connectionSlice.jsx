import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name:"connection",
    initialState:null,
    reducers:{
        addconnections:(state,action)=>action.payload,
        removeconnections:(state,action)=>{
            return null
        }
    }
});
export const {addconnections,removeconnections} = connectionSlice.actions;
export default connectionSlice.reducer;