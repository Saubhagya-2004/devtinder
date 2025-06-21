const express = require("express");
const connectionreq = express.Router();
const {userAuth} = require("../middlewares/auth");
connectionreq.post("/connection", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " send connection request sent");
});
module.exports = connectionreq;