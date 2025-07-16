const mongoose = require('mongoose');
const connectDB = async () => {
   try{

      await mongoose.connect(process.env.DB_CONNECTION_SECRET);
   }
   catch(error){
      console.error("MongoDB connection error:", error);
   }
};
module.exports =  connectDB;
