import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import Userreducer from "./appSlice";
import FeedSlice from "./FeedSlice"
import ConnectionSlice from "./connectionSlice"
import RequestSlice from "./RequestSlice";
const appstore = configureStore({
  reducer: {
    user: Userreducer,
    feed:FeedSlice,
    connection:ConnectionSlice,
    request:RequestSlice
  },
});

export default appstore;
