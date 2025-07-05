import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import Userreducer from "./appSlice";
import FeedSlice from "./FeedSlice"
const appstore = configureStore({
  reducer: {
    user: Userreducer,
    feed:FeedSlice
  },
});

export default appstore;
