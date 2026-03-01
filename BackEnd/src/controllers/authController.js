const { validation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signup = async (req, res) => {
    try {
        validation(req);
        const { password } = req.body;
        //Encrypt password
        const passwordhash = await bcrypt.hash(password, 10);
        req.body.password = passwordhash;
        //user input
        const user = new User(req.body);
        const data = await user.save();
        res.json({ message: "User added successfully", data });
    } catch (err) {
        res.status(400).json({ message: "Error adding the user: " + err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const allowed = ["email", "password"];
        const isallow = Object.keys(req.body).every((key) => {
            return allowed.includes(key);
        });
        if (!isallow) {
            throw new Error("Invalid Request ");
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("invalid credentials ");
        }
        const ispasswordvalid = await user.validatepassword(password);
        if (ispasswordvalid) {
            //create jwt token
            const token = await user.getjwt();

            //duplicate login in same userid create new token
            const expiretoken = new Date(Date.now() + 8 * 3600000);
            await User.findByIdAndUpdate(user._id, {
                activeToken: token,
                expiretoken: expiretoken
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                expires: expiretoken
            });

            res.json({
                data: user,
                token,               // ← returned for React Native mobile
                message: "login sucessFully !!",
            });
        } else {
            throw new Error("invalid credentials ");
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    const user = req.user;
    res.json({ message: user.firstName + " logout successfully" });
};

const sendEmail = require('../utils/sendEmail');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Case-insensitive email search to handle any capitalization
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });

        if (!user) {
            return res.status(404).json({ message: "There is no user with that email address." });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        const message = `Your password reset OTP is: ${otp}\nIt is valid for 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message,
            });
            res.status(200).json({ message: "OTP sent to email! Check your inbox." });
        } catch (err) {
            console.error("Email Sending Error:", err.message);
            // Always fall back to showing OTP in response when email fails
            return res.status(200).json({
                message: "Your OTP is: " + otp + " (valid for 10 minutes)"
            });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Case-insensitive email lookup
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "OTP is invalid or has expired." });
        }

        res.status(200).json({ message: "OTP verified successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        // Case-insensitive email lookup
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "OTP is invalid or has expired." });
        }

        // Hash new password
        const passwordhash = await bcrypt.hash(password, 10);
        user.password = passwordhash;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully! You can now login." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        res.status(200).json({ message: "OTP verified successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        // Hash new password
        const passwordhash = await bcrypt.hash(password, 10);
        user.password = passwordhash;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully! You can now login." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
