import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import Userreducer from "./appSlice";
import FeedSlice from "./FeedSlice"
import ConnectionSlice from "./connectionSlice"
const appstore = configureStore({
  reducer: {
    user: Userreducer,
    feed:FeedSlice,
    connection:ConnectionSlice
  },
});

export default appstore;
