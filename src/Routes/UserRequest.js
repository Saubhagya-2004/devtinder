const express = require("express");
const { userAuth } = require("../middlewares/auth");
const UserRequest = express.Router();
const Connectionreq = require("../models/connectionreq");

//get all the pending connection requests
UserRequest.get("/user/requests/recived", userAuth, async (req, res) => {
  try {
    const LoggedinUser = req.user;
    const connection = await Connectionreq.find({
      ReciverId: LoggedinUser._id,
      status: "interest",
    }).populate("senderId", ["firstName", "lastName", "profile"]);
    // }).populate("senderId","firstName lastName"); //same

    if (connection.length === 0) {
      return res.status(400).json({ message: "Invalid connection request" });
    }
    res.json({
      message: "Data fetched sucessfully",
      data: connection,
    });
  } catch (err) {
    res.status(400).json({
      message: "ERROR" + err.message,
    });
  }
});

//get user connections
UserRequest.get("/user/connections", userAuth, async (req, res) => {
  try {
    const LoggedinUser = req.user;
    const connectionreq = await Connectionreq.find({
      $or: [
        { ReciverId: LoggedinUser._id, status: "accepted" },
        { senderId: LoggedinUser._id, status: "accepted" },
      ],
    })
      .populate("senderId", "firstName LastName age gender profile Bio")
      .populate("ReciverId", "firstName LastName age gender profile Bio");
    if (connectionreq.length === 0) {
      res.json({
        message: "Connection not Found",
      });
    }
    //check from user or touser show their connection
    const data = connectionreq.map((row) => {
      // if (row.senderId._id.equals(LoggedinUser._id)) { //or
      if (row.senderId._id.toString() === LoggedinUser._id.toString()) {
        return row.ReciverId;
      } else {
        return row.senderId;
      }
    });
    res.json({
      message: "Your Connections",
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid Request",
    });
  }
});
module.exports = UserRequest;
