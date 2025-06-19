const express = require("express"); // Import express module
const connectDB = require("./config/database");
const app = express(); // Create an express application
//first connect to the database then listen to the server
const User = require("./models/user");
//cookies token
const cookiesparser = require("cookie-parser");
//jsonwebtoken jwt
const jwt = require("jsonwebtoken");
//validation
const { validation } = require("./utils/validation");
//use express middle-ware
app.use(express.json());
app.use(cookiesparser());
//authentication middleware
const { userAuth } = require("./middlewares/auth");
const user = require("./models/user");
//encrypt password
const bcrypt = require("bcrypt");
//add data into database
app.post("/signup", async (req, res) => {
  // console.log(req.body);
  try {
    //validation
    validation(req);
    const { password } = req.body;
    //Encrypt the password
    const passwordhash = await bcrypt.hash(password, 10);
    req.body.password = passwordhash;
    //user input
    const user = new User(req.body);
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error adding the user" + err.message);
  }
});

//get data by email
app.get("/useremail", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.find({ email: userEmail });
    if (user.length == 0) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch {
    res.status(400).send("Error finding the user");
  }
});

//get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    //get user from userAuth middleware
    const user = req.user;
    const cookies = req.token;
    console.log(cookies);
    res.send(user.firstName);
  } catch (err) {
    res.status(400).send("Error finding the user" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const allowed = ["email", "password"];
    const isallow = Object.keys(req.body).every((key) => {
      return allowed.includes(key);
    });
    if (!isallow) {
      throw new Error("Invalid Request ");
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("invalid credentials ");
    }
    const ispasswordvalid = await user.validatepassword(password);
    if (ispasswordvalid) {
      //create jwt token
      const token = await user.getjwt();
      // console.log(token);
      //add the token to the cookie and give response back
      //expire the cookie after 8 hours
      // res.cookie("token",token,{
      //   expires: new Date(Date.now() + 8 * 3600000)
      // });
      res.cookie("token", token);
      res.send("login sucessfully");
    } else {
      throw new Error("invalid credentials ");
    }
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

//sendconnection request
app.post("/connection", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " send connection request sent");
});
//delete user by name
app.delete("/userdel", async (req, res) => {
  const username = req.body.firstName;

  try {
    const user = await User.findOneAndDelete({ firstName: username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully" + user);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error deleting the user" + err);
  }
});
//duplicate
// app.patch('/change/:username',async(req,res)=>{
//   const username = req.params?.username;
//   const updatedata = req.body;
//   try{
//     const allowed = ['profession','firstName','lastName','age','language','skills','gender','profile','password'];
//     const {password} = req.body
//     const passwordhash= await bcrypt.hash(password,10);
//     req.body.password=passwordhash
//     const isallow = Object.keys(updatedata).every((key)=>{
//       return allowed.includes(key);
//     })
//     if(!isallow){
//       throw new Error('update not allowed');
//     }
//     const user = await User.updateOne({firstName:username},updatedata,{
//       runValidators:true
//     })
//     res.send('update successfully');
//   }
//   catch(err){
//     res.status(400).send('error updating: '+err.message);
//   }
// })

//login user

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
