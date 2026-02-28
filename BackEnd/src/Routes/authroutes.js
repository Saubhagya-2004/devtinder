const express = require("express");
const authRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const authController = require("../controllers/authController");

// Use standard routing
authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post('/logout', userAuth, authController.logout);

module.exports = authRouter;
