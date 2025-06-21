const express = require("express");
const profilereq = express.Router();
const { userAuth } = require("../middlewares/auth");
//get profile
profilereq.get("/profile", userAuth, async (req, res) => {
  try {
    //get user from userAuth middleware
    const user = req.user;
    const cookies = req.token;
    console.log(cookies);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error finding the user: " + err.message);
  }
});
module.exports = profilereq;
