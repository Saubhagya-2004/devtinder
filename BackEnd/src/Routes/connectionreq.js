const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionController = require("../controllers/connectionController");
const connectionreq = express.Router();

connectionreq.post(
  "/request/send/:status/:ReciverId",
  userAuth,
  connectionController.sendConnectionRequest
);

connectionreq.post(
  "/request/review/:status/:requestid",
  userAuth,
  connectionController.reviewConnectionRequest
);

module.exports = connectionreq;
