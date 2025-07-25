import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addconnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connection = () => {
  const connections = useSelector((state) => state.connection);
  const dispatch = useDispatch();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchedconnection = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addconnections(res.data.data));
    } catch (err) {
      console.error("Fetch error:", err.message);
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

  if (!connections) return <div className="flex justify-center items-center h-screen"><h1>Loading...</h1></div>;
  if (connections.length === 0) return <div className="flex justify-center items-center h-screen"><h1>No connections found</h1></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">Your Connections</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection, _id) => (
          <div 
            key={connection._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={connection.profile} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {connection.firstName} {connection.lastName}
                  </h2>
                  <div className="flex space-x-2 mt-1">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {connection.age} years
                    </span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                      {connection.gender}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 cursor-pointer">
                <Link to={'/chat/'+connection._id}><button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Message
                </button></Link>
                <button 
                  onClick={() => openProfileModal(connection)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  View Profile
                </button>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedProfile.firstName} {selectedProfile.lastName}'s Profile
                </h2>
                <button 
                  onClick={closeProfileModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={selectedProfile.profile } 
                    alt="Profile" 
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-indigo-200 mx-auto"
                  />
                </div>

                <div className="flex-grow">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Age</p>
                          <p className="font-medium">{selectedProfile.age}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{selectedProfile.gender}</p>
                        </div>
                        {selectedProfile.Bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">About</h3>
                        <p className="mt-2 text-gray-600">{selectedProfile.Bio}</p>
                      </div>
                    )}
                        <div>
                          <p className="text-sm text-gray-500">Occupation</p>
                          <p className="font-medium uppercase">{selectedProfile.profession || "Not specified"}</p>
                        </div>
                      </div>
                    </div>

                   

                 
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Send Message
                </button>
                <button 
                  onClick={closeProfileModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connection;