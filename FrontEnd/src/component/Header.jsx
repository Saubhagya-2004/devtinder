import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/appSlice";

const Header = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileUrl = user?.data?.profile;

  const handlelogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-400 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to={user ? "/" : "/login"}
              className="flex items-center space-x-2 text-2xl font-bold text-white transition-all duration-300"
            >
              <span className="text-3xl">🔥</span>
              <span className="hidden sm:inline">DevTinder</span>
            </Link>

          </div>


          {user && (
            <div className="flex items-center space-x-4">

              <Link
                to="/request"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300 border border-transparent hover:border-indigo-200"
              >
                Requests
              </Link>

              <Link
                to="/connection"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300 border border-transparent hover:border-indigo-200"
              >
                Connections
              </Link>


              <div className="relative">
                <div className="dropdown dropdown-end">
                  {/* Profile Avatar */}
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={profileUrl}
                        alt="User profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-300 transition-all duration-300"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Welcome text - hidden on mobile */}
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        Welcome, {user?.data?.firstName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.data?.email}
                      </p>
                    </div>

                    {/* Chevron */}
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-white rounded-xl shadow-xl border border-gray-200 z-[1] mt-3 w-56 p-2 animate-fadeIn"
                  >
                    {location.pathname !== "/profile" && (
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all duration-300"
                        >
                          <span className="flex items-center space-x-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile</span>
                          </span>
                          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">
                            New
                          </span>
                        </Link>
                      </li>
                    )}



                    <li>
                      <div className="border-t border-gray-200 my-1"></div>
                    </li>

                    <li>
                      <a
                        onClick={handlelogout}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;