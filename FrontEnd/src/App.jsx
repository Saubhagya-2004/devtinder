import React, { useState } from "react";
import Header from "./component/Header";
import Profile from "./component/profile";
import Login from "./component/login";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
import Body from "./component/Body";
import { Provider } from "react-redux";
import appstore from "./utils/appstore";
import Feed from "./component/Feed";
import Connection from "./component/connection";
const App = () => {
  return (
    <>
    <Provider store={appstore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            {/* These are nested routes - they will render inside <Outlet /> */}
            <Route path="/" element={<Feed/>}/>
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/connection" element={<Connection/>}/>
          
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;