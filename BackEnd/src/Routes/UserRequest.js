const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestController = require("../controllers/requestController");
const UserRequest = express.Router();

//get all the pending connection requests
UserRequest.get("/user/requests/recived", userAuth, requestController.getPendingRequests);

//get user connections
UserRequest.get("/user/connections", userAuth, requestController.getUserConnections);

//Get all data feed
UserRequest.get("/feed", userAuth, requestController.getFeed);

module.exports = UserRequest;
