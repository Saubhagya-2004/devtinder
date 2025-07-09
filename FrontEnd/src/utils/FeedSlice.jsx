import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: [], // Changed from null to empty array
    reducers: {
        addFeed: (state, action) => {
            return action.payload; // This should be an array of users
        },
        deleteuserFeed: (state, action) => {
            // Filter out the user with the given ID
            return state.filter(user => user._id !== action.payload);
        }
    }
});

export const { addFeed, deleteuserFeed } = feedSlice.actions;
export default feedSlice.reducer;