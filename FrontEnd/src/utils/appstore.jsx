import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import Userreducer from "./appSlice";
const appstore = configureStore({
  reducer: {
    user: Userreducer,
  },
});

export default appstore;
