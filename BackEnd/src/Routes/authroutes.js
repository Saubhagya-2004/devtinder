const express = require("express");
const authRouter = express.Router();
const { validation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { UserAuth, userAuth } = require("../middlewares/auth");
const User = require("../models/user");
//authentication middleware
authRouter.use("/signup", async (req, res) => {
  try {
    validation(req);
    const { password } = req.body;
    //Encrypt password
    const passwordhash = await bcrypt.hash(password, 10);
    req.body.password = passwordhash;
    //user input
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding the user: " + err.message);
  }
});

//login route
authRouter.post("/login", async (req, res) => {
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

      //duplicate login in same userid create new token
      const expiretoken = new Date(Date.now()+ 8 * 3600000);
      await User.findByIdAndUpdate(user._id,{
        activeToken:token,
        expiretoken:expiretoken
      })
      res.cookie("token", token,{
        httpOnly:true,
        secure:true,
         expires: expiretoken
      });
      
      const data ={
        userId:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        Profile:user.profile,
        age:user.age,
        Skill:user.skills,
        language:user.language,
        profession:user.profession,
        age:user.age
      }
      res.json({
        data:data,
        message:"login sucessFully !!",
      });
    } else {
      throw new Error("invalid credentials ");
    }
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

//logout router
authRouter.post('/logout',userAuth,async(req,res)=>{
  res.cookie('token',null,{
    expires: new Date(Date.now())
   
  });
  const user = req.user;
  res.send(user.firstName+ " logout successfully");
})
module.exports = authRouter;
