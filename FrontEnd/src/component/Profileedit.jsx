import React, { useState } from "react";
import { FaUser, FaCamera, FaSave, FaTimes } from "react-icons/fa";
import Usercard from "./Usercard";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/appSlice";

const Profileedit = ({ user }) => {
  const users = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [gender, setGender] = useState(user.gender || "");
  const [age, setAge] = useState(user.age || "");
  const [profession, setProfession] = useState(user.profession || "");
  const [Bio, setBio] = useState(user.Bio || "");
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState(user.profile || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();

  const saveprofile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          gender,
          profession,
          profile,
          Bio,
          skills,
        },
        { withCredentials: true }
      );
      setSuccess(res?.data?.message);
      
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSuccess("");
    
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br to-blue-200 via-gray-300 from-gray-500 p-4 lg:p-8">
     
      {success && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <span>{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="ml-4 text-white hover:text-green-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

     
      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-4 text-white hover:text-red-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <div className="card bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-gray-700 overflow-hidden">
              {/* Profile Icon Section */}
              <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-6 flex flex-col items-center">
                <h2 className="card-title text-white text-2xl md:text-3xl font-bold mt-4 text-center">
                  Edit Profile
                </h2>
              </div>

              <div className="card-body p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-white/80 mb-1 text-sm font-medium"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        className="input w-full bg-gray-800/70 text-white placeholder-gray-400 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-white/80 mb-1 text-sm font-medium"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        className="input w-full bg-gray-800/70 text-white placeholder-gray-400 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-white/80 mb-1 text-sm font-medium"
                      >
                        Age{age}
                      </label>
                      <input
                        id="age"
                        // type="number"
                        value={age}
                        className="input w-full bg-gray-800/70 text-white placeholder-gray-400 rounded-xl px-4 py-2 text-sm md:text-base"
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-white/80 mb-1 text-sm font-medium"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        className="input w-full bg-gray-800/70 text-white placeholder-gray-400 rounded-xl px-4 py-2 text-sm md:text-base"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="profession"
                      className="block text-white/80 mb-1 text-sm font-medium"
                    >
                      Photo Url
                    </label>
                    <input
                      id="profession"
                      type="text"
                      value={profile}
                      className="input w-full bg-gray-800/70 text-white uppercase placeholder-gray-100 rounded-xl px-4 py-2 text-sm md:text-base"
                      onChange={(e) => setProfile(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profession"
                      className="block text-white/80 mb-1 text-sm font-medium"
                    >
                      Profession
                    </label>
                    <input
                      id="profession"
                      type="text"
                      value={profession}
                      className="input w-full bg-gray-800/70 text-white uppercase placeholder-gray-100 rounded-xl px-4 py-2 text-sm md:text-base"
                      onChange={(e) => setProfession(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skills"
                      className="block text-white/80 mb-1 text-sm font-medium"
                    >
                      Skills (comma separated)
                    </label>
                    <input
                      id="skills"
                      type="text"
                      value={skills}
                      className="input w-full bg-gray-800/70 text-white placeholder-gray-400 rounded-xl px-4 py-2 text-sm md:text-base"
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g., JavaScript, React, Design"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-white/80 mb-1 text-sm font-medium"
                    >
                      About You
                    </label>
                    <textarea
                      id="bio"
                      value={Bio}
                      rows="3"
                      className="input w-full bg-gray-800/70 italic text-white placeholder-gray-400 rounded-xl px-4 py-2 text-sm md:text-base"
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 md:py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity mt-4 md:mt-6 text-sm md:text-base"
                    onClick={saveprofile}
                  >
                    <FaSave size={15} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-4">
              <Usercard
                user={{
                  firstName,
                  lastName,
                  age,
                  gender,
                  profession,
                  profile,
                  Bio,
                  skills,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profileedit;