import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { deleteuserFeed } from "../utils/FeedSlice";
import { toast } from "react-hot-toast";
import { Heart, X as XIcon, User, Briefcase, Wrench, Calendar, Info } from "lucide-react";

const Usercard = ({ user }) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  // Return a sleek placeholder if user data is missing
  if (!user) {
    return (
      <div className="flex justify-center p-4 w-full">
        <div className="w-full h-[600px] max-w-sm bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-400">
          <User size={48} className="mb-4 opacity-50" />
          <p>No user data available</p>
        </div>
      </div>
    );
  }

  const { _id, firstName, lastName, age, gender, profession, profile, Bio, skills } = user;

  const handlesendreq = async (status, userid) => {
    if (!userid) {
      toast.error("Cannot perform action on a preview card.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading(`${status === 'interested' ? 'Sending interest...' : 'Ignoring...'}`);

    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${status}/${userid}`,
        {},
        { withCredentials: true }
      );

      toast.success(status === 'interested' ? "Interest sent!" : "Passed", { id: toastId });
      dispatch(deleteuserFeed(userid));

    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Action failed", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const skillsDisplay = Array.isArray(skills) ? skills.join(", ") : skills;

  return (
    <div className="flex justify-center p-4 w-full">
      <div className="group relative w-full h-[650px] max-w-sm bg-[#161b22]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:shadow-indigo-500/20 hover:-translate-y-2 flex flex-col">

        {/* Profile Image Section */}
        <div className="relative h-[45%] w-full shrink-0 overflow-hidden bg-gray-900">
          {profile ? (
            <img
              src={profile}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <User size={64} className="text-gray-600" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-[#161b22]/50 to-transparent opacity-90" />

          {/* Name & Title (Overlapping Image) */}
          <div className="absolute bottom-4 left-6 right-6 z-10">
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
              {firstName} {lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Briefcase size={14} className="text-indigo-400" />
              <p className="text-indigo-100/90 font-medium text-sm drop-shadow-md truncate">
                {profession || "Developer"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar">

          {/* Bio Box */}
          {Bio && (
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl relative">
              <Info size={16} className="absolute top-4 left-4 text-purple-400 opacity-50" />
              <p className="text-gray-300 text-sm leading-relaxed pl-7 italic">"{Bio}"</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-black/30 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors hover:bg-black/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Calendar size={12} className="text-blue-400" /> Age
              </div>
              <p className="text-xl font-bold text-white">{age || "--"}</p>
            </div>
            <div className="bg-black/30 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors hover:bg-black/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <User size={12} className="text-green-400" /> Gender
              </div>
              <p className="text-xl font-bold text-white capitalize">{gender || "--"}</p>
            </div>
          </div>

          {/* Skills Area */}
          {(skillsDisplay || skills) && (
            <div className="mt-auto shrink-0 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                <Wrench size={12} className="text-yellow-400" /> Top Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {typeof skillsDisplay === 'string' && skillsDisplay.split(',').map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-2 shrink-0 bg-gradient-to-t from-[#161b22] to-transparent">
          <div className="flex justify-center gap-6">
            <button
              onClick={() => handlesendreq("ignored", _id)}
              disabled={isProcessing}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:border-red-500/30 hover:scale-110 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 focus:outline-none group"
            >
              <XIcon size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <button
              onClick={() => handlesendreq("interested", _id)}
              disabled={isProcessing}
              className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 focus:outline-none group"
            >
              <Heart size={28} fill="currentColor" className="group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Usercard;