import React from 'react'
import image from "../assets/image-1.webp"
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
const Header = () => {
  const location = useLocation()
  return (
    <div>
        <div className="navbar bg-base-300 shadow-md">
        <div className="flex-1">
          <a className="btn bg-secondary-content text-xl hover:bg-gray-500 hover:text-white">🔥 Tinder</a>
        </div>
        <div className="flex gap-2">
         
          <div className="dropdown dropdown-end mx-10">
            <div tabIndex={0} role="button" className="btn btn-accent btn-circle avatar ">
              <div className="w-100 rounded-full ">
               <img src={image} alt="icon" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-sm ">
              {location.pathname !== '/profile' && (
              <li>
                <a className="justify-between hover:bg-gray-400">
                  Profile
                  <span className="badge bg-red-200">New</span>
                </a>
              </li>
              )}  
              <li><a  className="justify-between hover:bg-gray-400">Settings</a></li>
              <li><a  className="justify-between hover:bg-gray-400">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Header
