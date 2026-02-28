import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/RequestSlice";
import { UserPlus, Check, X, Calendar, User as UserIcon, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const [isLoading, setIsLoading] = useState(true);

  const fetchreq = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recived", {
        withCredentials: true,
      });
      dispatch(addRequest(res.data.data));
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlereq = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      toast.success(`Request ${status} successfully`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchreq();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-transparent flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Checking your network...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-transparent flex justify-center items-center relative p-4">
        {/* Decorative background grid (subtle) */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

        <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-10 transition-all duration-300">
          <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
            <UserPlus size={40} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Pending Requests</h2>
          <p className="text-gray-400">You're all caught up! Keep exploring the feed to connect with more amazing developers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-transparent relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background grid (subtle) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Connection Requests <span className="bg-white/10 text-indigo-400 text-sm py-1 px-3 rounded-full">{requests.length}</span>
            </h1>
            <p className="text-gray-400 mt-2">People who want to connect with you.</p>
          </div>
        </div>

        {/* List Layout */}
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:shadow-[0_8px_32px_0_rgba(79,70,229,0.15)] hover:border-indigo-500/30 transition-all duration-300 group p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              {/* Profile Image */}
              <div className="relative shrink-0">
                <img
                  src={req.senderId?.profile}
                  alt={req.senderId?.firstName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem] object-cover shadow-lg border border-white/10 bg-gray-900 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate flex items-center gap-2">
                  {req.senderId?.firstName} {req.senderId?.lastName}
                </h2>

                {req.senderId?.profession && (
                  <p className="text-sm text-indigo-400 font-medium truncate mb-2 mt-0.5">
                    {req.senderId.profession}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-2">
                  {req.senderId?.age && (
                    <span className="flex items-center gap-1 bg-white/5 py-1 px-2.5 rounded-md border border-white/5">
                      <Calendar size={12} className="text-blue-400" /> {req.senderId.age} yrs
                    </span>
                  )}
                  {req.senderId?.gender && (
                    <span className="flex items-center gap-1 bg-white/5 py-1 px-2.5 rounded-md border border-white/5 capitalize">
                      <UserIcon size={12} className="text-green-400" /> {req.senderId.gender}
                    </span>
                  )}
                  {req.status === "interested" && (
                    <span className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-1 px-2.5 rounded-md">
                      <MessageSquare size={12} /> Interested
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full sm:w-auto gap-3 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-white/10 shrink-0">
                <button
                  onClick={() => handlereq("rejected", req._id)}
                  className="flex-1 sm:w-12 sm:flex-none h-12 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all group/reject"
                  title="Reject"
                >
                  <X size={20} className="group-hover/reject:rotate-90 transition-transform duration-300" />
                  <span className="sm:hidden ml-2 font-medium">Reject</span>
                </button>
                <button
                  onClick={() => handlereq("accepted", req._id)}
                  className="flex-1 sm:w-auto px-6 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all group/accept gap-2"
                >
                  <Check size={18} className="group-hover/accept:scale-125 transition-transform" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Request;