import React, { useState, useEffect } from "react";
import Usercard from "./Usercard";
import PhotoUpload from "./PhotoUpload";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/appSlice";
import { toast } from "react-hot-toast";
import { Save, User, Briefcase, Info, Wrench } from "lucide-react";

// The crash happens because `user` might be undefined on first load. Defaulting it to `{}` prevents the crash.
const Profileedit = ({ user = {} }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [gender, setGender] = useState(user.gender || "");
  const [age, setAge] = useState(user.age || "");
  const [profession, setProfession] = useState(user.profession || "");
  const [Bio, setBio] = useState(user.Bio || "");
  const [profile, setProfile] = useState(user.profile || "");
  const [skills, setSkills] = useState(Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "");
  const [isSaving, setIsSaving] = useState(false);

  // Keep local state in sync with Redux user object. 
  // Crucial for when the PhotoUpload finishes and updates Redux with a new profile image URL.
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setGender(user.gender || "");
      setAge(user.age || "");
      setProfession(user.profession || "");
      setBio(user.Bio || "");
      setProfile(user.profile || "");
      setSkills(Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "");
    }
  }, [user]);

  const saveprofile = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving profile changes...");

    try {
      // Split skills string into array if it's a string, mapping it to standard Mongoose array
      const formattedSkills = typeof skills === 'string'
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : skills;

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          gender: gender === "Other" ? "Others" : gender, // Map correctly to DB schema
          profession,
          profile, // Keep this strictly for the case where we don't use the PhotoUpload Dropzone. But PhotoUpload already updates the backend & redux independently.
          Bio,
          skills: formattedSkills,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data)); // Update Redux store
      toast.success(res?.data?.message || "Profile updated successfully!", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save profile", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Edit Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-white/10 p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Edit Profile</h2>
                    <p className="text-gray-400 font-medium mt-1">Update your personal information</p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-8 space-y-6">

                {/* Photo Upload Area */}
                <div className="pb-6 border-b border-white/10">
                  <PhotoUpload currentPhotoUrl={profile} />
                </div>

                {/* Name & Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full py-3 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full py-3 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full py-3 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300 ml-1">Gender</label>
                    <div className="relative">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full py-3 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all appearance-none outline-none"
                      >
                        <option value="" className="bg-gray-900">Select Gender</option>
                        <option value="Male" className="bg-gray-900">Male</option>
                        <option value="Female" className="bg-gray-900">Female</option>
                        <option value="Other" className="bg-gray-900">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                    <Briefcase size={14} className="text-pink-400" /> Profession
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full py-3 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                    <Wrench size={14} className="text-purple-400" /> Skills
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full py-3 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none"
                    placeholder="e.g. React, Node.js, Design"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                    <Info size={14} className="text-blue-400" /> About You (Bio)
                  </label>
                  <textarea
                    value={Bio}
                    rows="4"
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full py-3 px-4 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder-gray-500 outline-none resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>

                <button
                  onClick={saveprofile}
                  disabled={isSaving}
                  className={`w-full py-4 rounded-xl text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all mt-6 shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] ${isSaving
                    ? "bg-pink-600/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                    }`}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} /> Save Changes
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <h3 className="text-lg font-medium text-white/50 mb-4 px-2 uppercase tracking-wider text-sm">Live Preview</h3>
              <Usercard
                user={{
                  firstName: firstName || "First",
                  lastName: lastName || "Last",
                  age: age || "--",
                  gender: gender || "--",
                  profession: profession || "Profession",
                  profile,
                  Bio: Bio || "Your bio will appear here...",
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