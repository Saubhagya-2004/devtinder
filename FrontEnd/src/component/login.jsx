import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/appSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age,setAge] = useState()
  const[firstName,setFirstName] = useState();
  const[lastName,setLastName] = useState()
  const[gender,setGender] = useState()
  const[profession,setProfession] = useState()
  const[Bio,setBio] = useState()
  const[skills,setSkills] = useState()
  const[language,setLanguage] = useState()
  const[loginform,setLoginform] = useState(true)
  const clearEmail = () => setEmail("");
  const clearpassword = () => setPassword("");
  const clearFirstname = () => setFirstName("");
  const navigate = useNavigate();
  //dynamic
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handlelogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      // console.log(res)
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "something Went Wrong");
      // console.error(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900">
      <div className="card bg-white/10 backdrop-blur-md shadow-xl w-full max-w-sm rounded-xl border border-gray-700">
        <div className="card-body p-8">
          <h2 className="card-title text-white text-3xl font-bold my-2 justify-center underline">
          Login
          </h2>
          <div className="mb-4 p-3">
            <label
              htmlFor="email"
              className="block text-white mb-1 cursor-pointer pb-2"
            >
              Email :
            </label>
            <div className="relative mb-4">
              <input
                id="email"
                type="email"
                value={email}
                className="input w-full bg-gray-800 text-white placeholder-gray-400 rounded-2xl pr-10"
                placeholder="Enter Your Email!!"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              {email && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={clearEmail}
                >
                  ×
                </button>
              )}
            </div>
            {/* password */}
            <label
              htmlFor="password"
              className="block text-white mb-3 cursor-pointer"
            >
              Password
            </label>

            <div className="relative ">
              <input
                id="password"
                type="password"
                value={password}
                className="input w-full bg-gray-800 text-white placeholder-gray-400 rounded-2xl pr-10"
                placeholder="Enter Your Password!!"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white "
                  onClick={clearpassword}
                >
                  ×
                </button>
              )}
            </div>
            
            
          </div>
         
          <div className="card-actions justify-center">
            {error && (
              <p className="absolute top-0  left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-50 text-rose-700 px-6 py-3 rounded-lg font-bold z-10 text-center w-max max-w-[90%] uppercase">
                {error}
              </p>
            )}
            <button
              className="btn btn-primary rounded-md w-full"
              onClick={handlelogin}
            >
              Login
            </button>
          </div>
          <Link to="/signup"><p className="text-white underline cursor-pointer">New User? Sign Up </p></Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
