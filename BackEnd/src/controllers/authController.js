const { validation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendEmail = require('../utils/sendEmail');

exports.signup = async (req, res) => {
    try {
        validation(req);
        const { password } = req.body;
        const passwordhash = await bcrypt.hash(password, 10);
        req.body.password = passwordhash;
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
        const isallow = Object.keys(req.body).every((key) => allowed.includes(key));
        if (!isallow) throw new Error("Invalid Request ");

        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) throw new Error("invalid credentials ");

        const ispasswordvalid = await user.validatepassword(password);
        if (!ispasswordvalid) throw new Error("invalid credentials ");

        const token = await user.getjwt();
        const expiretoken = new Date(Date.now() + 8 * 3600000);
        await User.findByIdAndUpdate(user._id, { activeToken: token, expiretoken });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: expiretoken
        });

        res.json({
            data: user,
            token,        // ← Required for React Native mobile app
            message: "login sucessFully !!",
        });
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

// Helper: case-insensitive email regex
const emailRegex = (email) => ({ $regex: new RegExp(`^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required." });

        // Case-insensitive email search
        const user = await User.findOne({ email: emailRegex(email) });
        if (!user) {
            return res.status(404).json({ message: "There is no user with that email address." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const message = `Your password reset OTP is: ${otp}\nIt is valid for 10 minutes.`;

        try {
            await sendEmail({ email: user.email, subject: 'Password Reset OTP', message });
            res.status(200).json({ message: "OTP sent to email! Check your inbox." });
        } catch (emailErr) {
            console.error("Email error:", emailErr.message);
            // Always return OTP in response when email fails (no SMTP configured)
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
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

        // Case-insensitive email lookup
        const user = await User.findOne({
            email: emailRegex(email),
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
        if (!email || !otp || !password) {
            return res.status(400).json({ message: "Email, OTP and password are required." });
        }

        // Case-insensitive email lookup
        const user = await User.findOne({
            email: emailRegex(email),
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "OTP is invalid or has expired." });
        }

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
