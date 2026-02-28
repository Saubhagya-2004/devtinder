import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addconnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { Users, Filter, MessageCircle, User as UserIcon, X, Calendar, Wrench, Briefcase, Info } from "lucide-react";

const Connection = () => {
  const connections = useSelector((state) => state.connection);
  const dispatch = useDispatch();

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchedconnection = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addconnections(res.data.data));
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openProfileModal = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  useEffect(() => {
    fetchedconnection();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-transparent flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Loading connections...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-transparent flex justify-center items-center relative p-4">
        {/* Decorative background grid (subtle) */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

        <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-10 transition-all duration-300">
          <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Users size={40} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Connections Yet</h2>
          <p className="text-gray-400 mb-6">Start exploring the feed to find potential collaborators and friends.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 transition-all active:scale-95">
            Explore Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-transparent relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background grid (subtle) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              My Connections <span className="bg-white/10 text-indigo-400 text-sm py-1 px-3 rounded-full">{connections.length}</span>
            </h1>
            <p className="text-gray-400 mt-2">People you've successfully matched with.</p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:shadow-[0_8px_32px_0_rgba(79,70,229,0.15)] hover:border-indigo-500/30 transition-all duration-300 group flex flex-col"
            >
              {/* Card Header (Image + Basic Info) */}
              <div className="p-5 flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={connection.profile}
                    alt={connection.firstName}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg bg-gray-900 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#161b22] rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h2 className="text-lg font-bold text-white truncate">
                    {connection.firstName} {connection.lastName}
                  </h2>
                  <p className="text-sm text-indigo-400 truncate">
                    {connection.profession || "Developer"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-300 text-[10px] uppercase tracking-wider rounded-md">
                      {connection.age} yrs
                    </span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-300 text-[10px] uppercase tracking-wider rounded-md">
                      {connection.gender}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto p-4 pt-0 flex gap-2">
                <button
                  onClick={() => openProfileModal(connection)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <UserIcon size={16} /> Profile
                </button>
                <Link to={'/chat/' + connection._id} className="flex-1 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-400 hover:text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={16} /> Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal - Glassmorphic overlay */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeProfileModal}></div>

          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#161b22]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserIcon className="text-indigo-500" />
                {selectedProfile.firstName}'s Profile
              </h2>
              <button
                onClick={closeProfileModal}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex flex-col md:flex-row gap-8">

                {/* Left/Top: Avatar */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={selectedProfile.profile}
                      alt="Profile"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] object-cover border border-white/10 shadow-lg bg-gray-900"
                    />
                    <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] pointer-events-none"></div>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white text-center">
                    {selectedProfile.firstName} {selectedProfile.lastName}
                  </h3>
                  <p className="text-indigo-400 font-medium text-center">
                    {selectedProfile.profession || "Developer"}
                  </p>
                </div>

                {/* Right/Bottom: Details */}
                <div className="flex-grow space-y-6">

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-start gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <Calendar size={14} className="text-blue-400" /> Age
                      </div>
                      <p className="text-lg font-bold text-white">{selectedProfile.age}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-start gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <UserIcon size={14} className="text-green-400" /> Gender
                      </div>
                      <p className="text-lg font-bold text-white capitalize">{selectedProfile.gender}</p>
                    </div>
                  </div>

                  {selectedProfile.Bio && (
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative">
                      <Info size={16} className="absolute top-5 left-5 text-purple-400 opacity-50" />
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 pl-7 uppercase tracking-wider">About</h4>
                      <p className="text-gray-400 text-sm leading-relaxed pl-7 italic">"{selectedProfile.Bio}"</p>
                    </div>
                  )}

                  {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        <Wrench size={16} className="text-yellow-400" /> Skills
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfile.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <button
                onClick={closeProfileModal}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
              <Link to={'/chat/' + selectedProfile._id}>
                <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all flex items-center gap-2">
                  <MessageCircle size={18} /> Send Message
                </button>
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Connection;