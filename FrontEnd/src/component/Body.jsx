import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { addUser } from "../utils/appSlice";

const PUBLIC_ROUTES = ["/login", "/signup"];

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (userData) {
      if (isPublicRoute) {
        navigate("/", { replace: true });
      }
      return;
    }

    if (isPublicRoute) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        console.error(err);
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [dispatch, isPublicRoute, navigate, userData]);

  if (!isPublicRoute && !userData) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-128px)] flex items-center justify-center text-white">
          Checking your session...
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
