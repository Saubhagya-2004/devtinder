import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/RequestSlice";

const Request = () => {
  const dispatch = useDispatch();
  const request = useSelector((state) => state.request);

  const fetchreq = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recived", {
        withCredentials: true,
      });
      console.log("API Response:", res.data); // Add this for debugging
      dispatch(addRequest(res.data.data));
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

//   handle
  const handlereq= async(status,_id)=>{
    try{
        const res = await axios.post(BASE_URL+"/request/review/"+status+"/"+_id,{},{withCredentials:true});
        dispatch(removeRequest(_id))
    }catch(err){
        console.error(err)
    }
  }

  useEffect(() => {
    fetchreq();
  }, []);

  // Add debugging logs
  console.log("Request state:", request);

  // Check if request is null, undefined, or not an array
  if (!request ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Not found</h1>
      </div>
    );
  }

  if (request.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>No requests found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Your Requests!!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {request.map((req, index) => (
          <div
            key={ index} // Use _id if available
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={req.senderId?.profile || "/default-avatar.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                />
               
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {req.senderId?.firstName} {req.senderId?.lastName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Status: {req.status}
                  </p>
                </div>
                 <img
                  src={req.ReciverId?.profile || "/default-avatar.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors" onClick={()=>handlereq("accepted",req._id)}>
                  Accepted
                </button>
                <button className="px-4 py-2 border border-gray-10000 text-white bg-red-600 rounded-md hover:text-gray-100 transition-colors"  onClick={()=>handlereq("rejected",req._id)}>
                  Rejected
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Request;