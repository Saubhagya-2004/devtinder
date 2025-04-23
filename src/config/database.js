const mongoose = require('mongoose');
const connectDB = async () => {
   await mongoose.connect(
      "mongodb+srv://saubhagyabaliarsingh2:nEswultUsQF3gDKY@nodedb.yab3goi.mongodb.net/devTinder"
   );
};
module.exports =  connectDB ;