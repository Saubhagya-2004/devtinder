const express = require("express");
const profilereq = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateprofileEdit, validatepasswordEdit} = require("../utils/validation");
const bcrypt = require("bcrypt");
//get profile
profilereq.get("/profile", userAuth, async (req, res) => {
  try {
    //get user from userAuth middleware
    const user = req.user;
    const cookies = req.token;
    // console.log(cookies);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error finding the user: " + err.message);
  }
});
//profile edit
profilereq.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateprofileEdit(req);
    const LoggedinUser = req.user;
    //before
    // console.log(LoggedinUser);

    Object.keys(req.body).forEach((key) => {
      LoggedinUser[key] = req.body[key];
    });
    //after
    // console.log(LoggedinUser);
    await LoggedinUser.save();
    res.json({
      message: `${LoggedinUser.firstName}, profile Updated sucessfully`,
      data: LoggedinUser,
    });
  } catch (err) {
    res.status(400).send("Error updating the profile: " + err.message);
  }
});
//password edit
profilereq.patch('/profile/password',userAuth, async(req,res)=>{
  try{
    validatepasswordEdit(req);
    const User = req.user;
    const {password } = req.body;
    if(password){
      const passwordhash = await bcrypt.hash(password, 10);
      User.password = passwordhash;
      await User.save();
    }
    res.send(`${User.firstName}, password updated successfully`);
  }
  catch(err){
    res.status(400).send("Error updating the password: " + err.message);
  }
})
module.exports = profilereq;
