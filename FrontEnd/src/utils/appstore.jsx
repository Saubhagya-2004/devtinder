import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import Userreducer from "./appSlice";
import FeedSlice from "./FeedSlice"
import ConnectionSlice from "./connectionSlice"
import RequestSlice from "./RequestSlice";
import Signupslice from "./SignupSlice"
const appstore = configureStore({
  reducer: {
    user: Userreducer,
    feed:FeedSlice,
    connection:ConnectionSlice,
    request:RequestSlice,
    signup:Signupslice
  },
});

export default appstore;
