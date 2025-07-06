import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { addFeed } from "../utils/FeedSlice";
import Usercard from "./Usercard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  
  const getfeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      // console.log(res);
      dispatch(addFeed(res.data));
      
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getfeed();
  }, []);

  return feed&&(
    <div className="min-h-screen bg-gradient-to-b from-gray-500 to-gray-300 py-4 sm:py-8 sm:px-4 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center  items-center ">
          <div className="sm:ml-3 max-w-md md:max-w-lg lg:max-w-xl w-full transition-all duration-300 my-10">
            <Usercard user={feed.data[0]}/>
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default Feed;