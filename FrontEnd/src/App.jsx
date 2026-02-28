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
import Request from "./component/Request";
import Signup from "./component/Signup"
import Chat from "./component/Chat";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Dark Horizon Glow */}
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">
        <Provider store={appstore}>
          <Toaster position="top-center" reverseOrder={false} />
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                {/* These are nested routes - they will render inside <Outlet /> */}
                <Route path="/" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/connection" element={<Connection />} />
                <Route path="/request" element={<Request />} />
                <Route path="/chat/:targetuserId" element={<Chat />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </div>
    </div>
  );
};

export default App;