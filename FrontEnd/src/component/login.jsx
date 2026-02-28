import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/appSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { toast } from "react-hot-toast";
import { Mail, Lock, ArrowRight, X } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearEmail = () => setEmail("");
  const clearPassword = () => setPassword("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlelogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      toast.success("Welcome back!", { id: loadingToast });
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data || err?.response?.data?.message || "Invalid Email or Password", {
        id: loadingToast
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlelogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 sm:p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-10 mx-4 transition-all duration-300 transform hover:scale-[1.01]">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mb-4 shadow-lg shadow-pink-500/30">
            <span className="text-3xl">🔥</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 font-medium">Please sign in to your account</p>
        </div>

        <div className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-pink-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                className="w-full py-3.5 pl-11 pr-10 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                placeholder="developer@example.com"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              {email && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                  onClick={clearEmail}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <a href="#" className="text-xs font-semibold text-pink-500 hover:text-pink-400 transition-colors">Forgot?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-pink-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                className="w-full py-3.5 pl-11 pr-10 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              {password && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                  onClick={clearPassword}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handlelogin}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all mt-6 shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] ${isLoading
              ? "bg-pink-600/70 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-pink-500 font-semibold hover:text-pink-400 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
