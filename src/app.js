const express = require("express"); // Import express module
const connectDB = require("./config/database");
const app = express(); // Create an express application
//first connect to the database then listen to the server
const User = require("./models/user");

//use express middle-ware
app.use(express.json());
//authentication
const { admin, userAuth } = require("./middlewares/auth");

//admin authentication
app.use("/admin", admin, (req, res) => {
  res.send("Admin route accessed successfully");
});

//user authentication
app.get("/user", userAuth, (req, res) => {
  res.send({ firstName: "Saubhagya", LastName: "Baliarsingh" });
});

//add data into database
app.post('/signup',async(req,res)=>{
const user = new User(req.body);
console.log(req.body);
try{
  await user.save();
  res.send('user added successfully');
}
catch(err){
  res.status(400).send('Error adding the user');
}
});

//get data by email
app.get('/useremail',async(req,res)=>{
  const userEmail = req.body.email;
  try{
    const user = await User.find({email:userEmail});
    if(user.length==0){
      return res.status(404).send('User not found');
    }
    res.send(user);
  }
  catch{
    res.status(400).send('Error finding the user');
  }
})

//get data by id
app.get('/userid',async(req,res)=>{
  const userid = req.body._id;
  try{
    const user= await User.findById({_id:userid});
    res.send(user);
  }
  catch{
    res.status(400).send('Error finding the user');
  }
})

//get all data
app.get('/feed',async(req,res)=>{
  try{
    const user = await User.find({});
    res.send(user);
  }
  catch{
    res.status(400).send('Error not get Data');
  }
})

//delete user by name
app.delete("/userdel", async (req, res) => {
  const username = req.body.firstName; 

  try {
    const user = await User.findOneAndDelete({firstName:username}); 
    if (!user) {
      return res.status(404).send("User not found");
    }
   
    res.send('User deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(400).send("Error deleting the user");
  }
});

//update by id
app.patch('/update',async(req,res)=>{
  const userId = req.body._id;
  const updatedata = req.body;
  try{
    const user = await User.findByIdAndUpdate(userId,updatedata)
    console.log(user);
    
    res.send('user updated sucessfully')
  }
  catch (err) {
    console.error(err);
    res.status(400).send("Error updating the user");
  }
})

connectDB()
  .then(() => {
    console.log("Database connection sucessfully...");
    app.listen(8888, () => {
      console.log("Server connected successfully on port 8888");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });
