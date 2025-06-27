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
      const allowed = ["ignored", "interest"];
      if (!allowed.includes(status)) {
        res.status(400).json({
          message: "Invalid status type" + status,
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
        $or:[
          //if already exist
          {senderId,ReciverId},
          //if already sender sent req
          {senderId:ReciverId,ReciverId:senderId}
        ], 
      })
      if(existingRequest){
       return res.status(400).json({
          message:"connection Request already exist"
        })
      }
      const Connectionrequest = new Connectionreq({
        senderId,
        ReciverId,
        status,
      });
      const data = await Connectionrequest.save();
      res.json({
        message: `${req.user.firstName} Connection request sent successfully to ${reciver.firstName} ` + status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error sending connection request: " + err.message);
    }
  }
);
module.exports = connectionreq;
