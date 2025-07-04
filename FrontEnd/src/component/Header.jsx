import React from 'react'
import image from "../assets/image-1.webp"
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Header = () => {
  const location = useLocation()
  const user = useSelector((state) => state.user);
  const profileUrl = user?.data?.Profile || image; 
  
  return (
    <div className="navbar bg-base-300 shadow-md px-4 sm:px-6">
      <div className="flex-1">
        <Link to="/" className="btn bg-secondary-content text-xl hover:bg-gray-500 hover:text-white">
          🔥 Tinder
        </Link>
      </div>
      
      {user && (
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            {/* Mobile*/}
            <div className="md:hidden ">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mt-1 hover:scale-102">
                <div className="w-10 rounded-full">
                  <img src={profileUrl} alt="User profile" className="object-cover" />
                </div>
           
              </div>
            </div>
            
         
            <div className="hidden md:flex md:flex-col md:items-center">
              <div tabIndex={0} role="button" className="btn btn- btn-circle avatar mt-1 hover:scale-102">
                <div className="w-10 rounded-full">
                  <img src={profileUrl} alt="User profile" className="object-cover" />
                </div>
              </div>
              <p className="mt-1 md:text-sm lg:text-md font-medium text-center hidden lg:block">
                Welcome {user?.data?.firstName}
              </p>
            </div>
            
            {/* Dropdown menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {location.pathname !== '/profile' && (
                <li>
                  <Link to="/profile" className="justify-between hover:bg-gray-200">
                    Profile
                    <span className="badge bg-red-200">New</span>
                  </Link>
                </li>
              )}
              <li><a className="hover:bg-gray-200">Settings</a></li>
              <li><a className="hover:bg-gray-200">Logout</a></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header