const express = require("express");
const authRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const authController = require("../controllers/authController");

// Use standard routing
authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post('/logout', userAuth, authController.logout);

// Forgot Password Flow
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/verify-otp', authController.verifyOtp);
authRouter.post('/reset-password', authController.resetPassword);

module.exports = authRouter;
