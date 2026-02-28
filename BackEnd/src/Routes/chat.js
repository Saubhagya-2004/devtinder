const express = require('express');
const { userAuth } = require('../middlewares/auth');
const chatController = require('../controllers/chatController');
const chatRouter = express.Router();

chatRouter.get("/chat/:targetuserId", userAuth, chatController.getChat);

module.exports = chatRouter;