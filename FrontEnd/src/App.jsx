import React, { useState } from "react";
import Header from "./component/Header";
import Profile from "./component/profile";
import Login from "./component/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./component/Body";

const App = () => {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            {/* These are nested routes - they will render inside <Outlet /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
           
          
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;