import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/appSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { toast } from "react-hot-toast";
import { Mail, Lock, ArrowRight, X, Code2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password States
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: login, 1: req otp, 2: verify otp, 3: reset
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  const handleForgotPasswordRequest = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    setIsLoading(true);
    const loadingToast = toast.loading("Sending OTP...");
    try {
      const res = await axios.post(BASE_URL + "/forgot-password", { email });
      const msg = res.data.message || "OTP sent to your email!";
      const isDevMode = msg.includes("Dev Mode");
      toast.success(msg, {
        id: loadingToast,
        duration: isDevMode ? 10000 : 4000
      });
      setForgotPasswordStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!resetOtp) {
      toast.error("Please enter the OTP");
      return;
    }
    setIsLoading(true);
    const loadingToast = toast.loading("Verifying OTP...");
    try {
      const res = await axios.post(BASE_URL + "/verify-otp", { email, otp: resetOtp });
      toast.success(res.data.message || "OTP verified!", { id: loadingToast });
      setForgotPasswordStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    const loadingToast = toast.loading("Resetting password...");
    try {
      const res = await axios.post(BASE_URL + "/reset-password", { email, otp: resetOtp, password: newPassword });
      toast.success(res.data.message || "Password reset successfully! Please login.", { id: loadingToast });
      setForgotPasswordStep(0);
      setPassword("");
      setResetOtp("");
      setNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password", { id: loadingToast });
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
    <div className="min-h-screen flex bg-transparent relative">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center p-12 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')" }}
      >
        {/* Gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117]/90 via-[#0d1117]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-indigo-900/20 mix-blend-multiply"></div>

        <div className="relative z-10 text-white max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
            <Code2 size={32} className="text-white" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-6 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Connect. <br />
            Collaborate. <br />
            <span className="text-orange-400">Code.</span>
          </h1>
          <p className="text-gray-200 text-xl leading-relaxed drop-shadow-md font-light max-w-sm">
            Join the ultimate platform for finding your next project collaborator or coding buddy. Seamless matchmaking for engineers.
          </p>

          {/* Minimalist decorative elements */}
          <div className="mt-12 flex items-center gap-4">
            <div className="h-1 w-12 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <div className="h-1 w-4 bg-white/40 rounded-full"></div>
            <div className="h-1 w-4 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            {/* Mobile-only logo */}
            <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 mb-6">
              <Code2 size={28} className="text-indigo-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-400">Please sign in to your account</p>
          </div>

          {forgotPasswordStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    className="w-full py-3.5 pl-12 pr-10 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="developer@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  {email && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                      onClick={clearEmail}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <button
                    onClick={() => setForgotPasswordStep(1)}
                    type="button"
                    className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className="w-full py-3.5 pl-12 pr-12 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handlelogin}
                disabled={isLoading}
                className={`w-full py-3.5 rounded-lg text-white font-semibold tracking-wide flex items-center justify-center gap-2 transition-all mt-8 border-2 ${isLoading
                  ? "border-orange-500/50 bg-transparent text-gray-400 cursor-not-allowed"
                  : "border-orange-500 bg-transparent hover:bg-orange-500/10 active:scale-[0.99] shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]"
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
          )}

          {forgotPasswordStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Enter your email for OTP</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    className="w-full py-3.5 pl-12 pr-10 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="developer@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setForgotPasswordStep(0)}
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-lg text-white font-medium border border-white/10 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPasswordRequest}
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-lg text-white font-semibold tracking-wide border-2 border-orange-500 bg-transparent hover:bg-orange-500/10 transition-all flex justify-center items-center gap-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-2xl animate-spin" /> : "Send OTP"}
                </button>
              </div>
            </div>
          )}

          {forgotPasswordStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Enter the 6-digit OTP sent to your email</label>
                <input
                  type="text"
                  value={resetOtp}
                  maxLength={6}
                  className="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white text-center tracking-[0.5em] text-xl rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                  placeholder="------"
                  onChange={(e) => setResetOtp(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setForgotPasswordStep(1)}
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-2xl text-white font-medium border border-white/10 hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-lg text-white font-semibold tracking-wide border-2 border-orange-500 bg-transparent hover:bg-orange-500/10 transition-all flex justify-center items-center gap-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {forgotPasswordStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Enter New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    className="w-full py-3.5 pl-12 pr-12 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="New password (min 8 chars)"
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full py-3.5 rounded-lg text-white font-semibold tracking-wide border-2 border-orange-500 bg-transparent hover:bg-orange-500/10 transition-all flex justify-center items-center gap-2 mt-4"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Reset Password"}
              </button>
            </div>
          )}

          <div className="mt-10 text-center lg:text-left">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
