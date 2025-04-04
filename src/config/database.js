const mongoose = require('mongoose');
const connectDB = async () => {
   await mongoose.connect(
      "mongodb+srv://Saubhagya:Baliar%402004@cluster0.mby9c.mongodb.net/devTinder"
   );
};
module.exports =  connectDB ;