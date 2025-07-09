import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { FaTimes, FaCheck } from "react-icons/fa";
import { newUser } from "../utils/SignupSlice";

const Signup = () => {
  // Form states
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
    Bio: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await axios.post(`${BASE_URL}/signup`, formData, {
        withCredentials: true
      });
      
      dispatch(newUser(res.data));
      setSuccess("Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900">
      <div className="card bg-white/10 backdrop-blur-md shadow-xl w-full max-w-sm rounded-xl border border-gray-700">
        <div className="card-body p-8">
          <h2 className="card-title text-white text-3xl font-bold my-2 justify-center underline">
            Signup
          </h2>

          {success && (
            <div className="mb-4 p-3 bg-green-500/90 text-white rounded-lg flex items-center">
              <FaCheck className="mr-2" />
              <span>{success}</span>
              <button onClick={() => setSuccess("")} className="ml-auto">
                <FaTimes />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/90 text-white rounded-lg flex items-center">
              <FaTimes className="mr-2" />
              <span>{error}</span>
              <button onClick={() => setError("")} className="ml-auto">
                <FaTimes />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Required fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1">First Name*</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input w-full bg-gray-800 text-white rounded-2xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Last Name*</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input w-full bg-gray-800 text-white rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-1">Email*</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input w-full bg-gray-800 text-white rounded-2xl"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-1">Password*</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input w-full bg-gray-800 text-white rounded-2xl"
                  required
                />
              </div>

              {/* Optional fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1">Age</label>
                  <input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="input w-full bg-gray-800 text-white rounded-2xl"
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Gender*</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input w-full bg-gray-800 text-white rounded-2xl"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

          

              <div>
                <label className="block text-white mb-1">Profession</label>
                <input
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="input w-full bg-gray-800 text-white rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Skills</label>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="input w-full bg-gray-800 text-white rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Language</label>
                <input
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="input w-full bg-gray-800 text-white rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-white mb-1">Bio</label>
                <textarea
                  name="Bio"
                  value={formData.Bio}
                  onChange={handleChange}
                  className="textarea w-full bg-gray-800 text-white rounded-2xl"
                  rows="3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary rounded-md w-full mt-6"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;