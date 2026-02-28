import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addFeed } from "../utils/FeedSlice";
import Usercard from "./Usercard";
import { Users } from 'lucide-react';

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const getfeed = async () => {
    // Check if feed is empty array or null
    if (feed && feed.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data.data || res.data));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getfeed();
  }, []);

  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-transparent flex items-center justify-center p-4 relative">
        {/* Decorative background grid (subtle) */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

        <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-10 transition-all duration-300">
          <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Users size={40} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No New Faces</h2>
          <p className="text-gray-400">You've caught up with everyone in your area. Check back later for more developers!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-transparent relative flex items-center justify-center py-10 px-4">
      {/* Decorative background grid (subtle) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        {/* Subtle decorative title */}
        <h1 className="text-sm font-semibold text-indigo-500 uppercase tracking-[0.2em] mb-6 opacity-80">Discover</h1>

        {/* The Usercard handles its own sizing now */}
        <Usercard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;