const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.DB_CONNECTION_SECRET, { family: 4 });
   }
   catch (error) {
      console.error("MongoDB connection error:", error);
   }
}; 
module.exports = connectDB;
