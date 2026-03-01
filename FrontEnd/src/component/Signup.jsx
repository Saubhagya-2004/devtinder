import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Calendar, Briefcase, Wrench, Globe, Info } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    profession: "",
    skills: "",
    language: "",
    Bio: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Explicit client-side validation for age
    if (!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      toast.error("Age must be between 18 and 100");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating your account...");

    try {
      // Prepare payload to match backend schema exactly (e.g., removing empty optional strings, parsing age)
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
      };

      // Strip empty optional fields before sending so backend doesn't throw validation errors
      Object.keys(payload).forEach(key => {
        if (payload[key] === "" && key !== "email" && key !== "password" && key !== "firstName" && key !== "lastName" && key !== "gender") {
          delete payload[key];
        }
      });

      const res = await axios.post(`${BASE_URL}/signup`, payload, {
        withCredentials: true,
      });

      toast.success("Account created successfully! Redirecting to login...", { id: toastId });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data || "Something went wrong creating your account", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-transparent relative">
      {/* Decorative background grid (subtle) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-10 mx-auto transition-all duration-300">

        <div className="text-center pt-10 pb-6 px-10 border-b border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-4">
            <span className="text-3xl">💻</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Join DevTinder</h2>
          <p className="text-gray-400 font-medium">Create your developer match profile</p>
        </div>

        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Required Section Wrapper */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-pink-500 uppercase tracking-wider mb-2">Required Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">First Name *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-pink-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Last Name *</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-pink-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-pink-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="developer@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-pink-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full py-3.5 pl-11 pr-12 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 my-8"></div>

            {/* Optional Section Wrapper */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Optional Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Age</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                      <Calendar size={18} />
                    </div>
                    <input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-500 outline-none"
                      placeholder="25"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Gender *</label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full py-3.5 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none outline-none"
                    >
                      <option value="" className="bg-gray-900">Select Gender</option>
                      <option value="Male" className="bg-gray-900">Male</option>
                      <option value="Female" className="bg-gray-900">Female</option>
                      <option value="Others" className="bg-gray-900">Others</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profession */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Profession</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                    <Briefcase size={18} />
                  </div>
                  <input
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
              </div>

              {/* Skills and Language Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Skills</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                      <Wrench size={18} />
                    </div>
                    <input
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-500 outline-none"
                      placeholder="React, Node.js..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1">Language</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                      <Globe size={18} />
                    </div>
                    <input
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-500 outline-none"
                      placeholder="English, Spanish..."
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                  Bio
                </label>
                <div className="relative group">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                    <Info size={18} />
                  </div>
                  <textarea
                    name="Bio"
                    value={formData.Bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full py-3.5 pl-11 pr-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-500 outline-none resize-none"
                    placeholder="Tell about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl text-white font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${isSubmitting
                  ? "bg-indigo-600/70 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-500 font-medium hover:text-indigo-400 transition-colors ml-1">
                Sign in here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;
