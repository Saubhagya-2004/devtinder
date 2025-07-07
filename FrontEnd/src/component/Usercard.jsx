import React from "react";

const Usercard = ({ user }) => {
  const { firstName, lastName, age, gender, profession, profile, Bio, skills } = user;

  const skillsDisplay = Array.isArray(skills) ? skills.join(", ") : skills;

  return (
    <div className="flex justify-center p-4">
      <div className="card w-full max-w-sm bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Profile Image */}
        <figure className=" h-70 overflow-hidden">
          <img
            src={profile}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
        </figure>

        
        <div className="p-6 space-y-4">
          {/* Name */}
          <div className="text-center ">
            <h2 className="text-2xl font-bold tracking-tight">
              {firstName} {lastName}
            </h2>
            <p className="text-gray-300 font-medium">{profession}</p>
          </div>

          {/* Bio */}
          <p className="text-gray-300 text-center italic">"{Bio}"</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-600/30 backdrop-blur-sm p-3 rounded-lg text-center">
              <p className="text-sm font-semibold text-gray-300">Age</p>
              <p className="text-lg font-bold">{age}</p>
            </div>
            <div className="bg-gray-600/30 backdrop-blur-sm p-3 rounded-lg text-center">
              <p className="text-sm font-semibold text-gray-300">Gender</p>
              <p className="text-lg font-bold">{gender}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-600/30 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-sm font-semibold text-gray-300 mb-1">Skills</p>
            <p className="text-sm">{skillsDisplay}</p>
          </div>
        </div>

        {/* Action Button */}
          <div className="grid grid-cols-2 gap-3 p-3">
            <div className="bg-info backdrop-blur-sm p-3 rounded-lg text-center">
              <button className="text-sm font-semibold text-gray-300 cursor-pointer">INTERESTED</button>
              
            </div>
            <div className="bg-red-500 backdrop-blur-sm p-3 rounded-lg text-center">
              <button className="text-sm font-semibold text-gray-300 cursor-pointer">IGNORED</button>
             
            </div>
          
        </div>
      </div>
     
    </div>
  );
};

export default Usercard;