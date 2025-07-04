import React, { useState } from "react";
import axios from 'axios'
const Login = () => {
  const [email,setEmail] = useState(" shena04@gmail.com");
  const [password,setPassword] = useState("Shena@2024^")
  const clearEmail =()=> setEmail("")
  const clearpassword =()=>setPassword("")

  const handlelogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8888/login",
        { email, password },
        { withCredentials: true }
      );
    } catch (error) {
      
      console.error(error);
    }
  }
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
              Email : {email}
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
            <button className="btn btn-primary rounded-md w-full"onClick={handlelogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
