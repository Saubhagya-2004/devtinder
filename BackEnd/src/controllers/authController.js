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
                expires: expiretoken
            });

            res.json({
                data: user,
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
        expires: new Date(Date.now())
    });
    const user = req.user;
    res.json({ message: user.firstName + " logout successfully" });
};
