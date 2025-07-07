const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Connectionreq = require("../models/connectionreq");
const connectionreq = express.Router();
const User = require("../models/user");
const { connection } = require("mongoose");

connectionreq.post(
  "/request/send/:status/:ReciverId",
  userAuth,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const ReciverId = req.params.ReciverId;
      const status = req.params.status;
      const allowed = ["ignored", "interested"];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type " + status,
        });
      }
      const reciver = await User.findById(ReciverId);
      if (!reciver) {
        return res.status(404).json({
          message: "Reciver not found",
        });
      }
      //if there is existing connection request between sender and reciver
      const existingRequest = await Connectionreq.findOne({
        $or: [
          //if already exist
          { senderId, ReciverId },
          //if already sender sent req
          { senderId: ReciverId, ReciverId: senderId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          message: "connection Request already exist",
        });
      }

      const Connectionrequest = new Connectionreq({
        senderId,
        ReciverId,
        status,
      });
      const data = await Connectionrequest.save();
      res.json({
        message:
          `${req.user.firstName} Connection request sent successfully to ${reciver.firstName} ` +
          status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error sending connection request: " + err.message);
    }
  }
);

connectionreq.post(
  "/request/review/:status/:requestid",
  userAuth,
  async (req, res) => {
    try {
      const LoggedinUser = req.user;
      const { status, requestid, ReciverId } = req.params;
      const allowedstatus = ["accepted", "rejected"];
      if (!allowedstatus.includes(status)) {
        return res.status(400).json({
          message: "Request not allowed " + status,
        });
      }
      const connectionRequest = await Connectionreq.findOne({
        _id: requestid,
        ReciverId: LoggedinUser._id,
        status: "interested", // Only allow review if the status is 'interest'
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message:
          `${LoggedinUser.firstName} ` + status + "  Connection Request",
        data,
      });
    } catch (err) {
      res.status(404).json({
        message: "Invalid Request",
      });
    }
  }
);
module.exports = connectionreq;
