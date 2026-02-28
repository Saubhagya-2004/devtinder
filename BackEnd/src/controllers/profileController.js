const {
    validateprofileEdit,
    validatepasswordEdit,
} = require("../utils/validation");
const bcrypt = require("bcrypt");

exports.viewProfile = async (req, res) => {
    try {
        //get user from userAuth middleware
        const user = req.user;
        res.json({
            data: user,
        });
    } catch (err) {
        res.status(400).json({ message: "Error finding the user: " + err.message });
    }
};

exports.editProfile = async (req, res) => {
    try {
        validateprofileEdit(req);
        const LoggedinUser = req.user;

        Object.keys(req.body).forEach((key) => {
            LoggedinUser[key] = req.body[key];
        });

        await LoggedinUser.save();
        res.json({
            message: `${LoggedinUser.firstName}, profile Updated sucessfully`,
            data: LoggedinUser,
        });
    } catch (err) {
        res.status(400).json({ message: "Error updating the profile: " + err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        validatepasswordEdit(req);
        const User = req.user;
        const { password } = req.body;
        if (password) {
            const passwordhash = await bcrypt.hash(password, 10);
            User.password = passwordhash;
            await User.save();
        }
        res.json({ message: `${User.firstName}, password updated successfully` });
    } catch (err) {
        res.status(400).json({ message: "Error updating the password: " + err.message });
    }
};

const { uploadToCloudinary } = require("../utils/cloudinary");

exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        // Upload to Cloudinary using the buffer from multer memory storage
        const result = await uploadToCloudinary(req.file.buffer);

        // Update user profile in database
        const user = req.user;
        user.profile = result.secure_url;
        await user.save();

        res.json({
            message: "Profile photo updated successfully",
            data: user,
            photoUrl: result.secure_url
        });
    } catch (err) {
        console.error("Photo upload error:", err);
        res.status(500).json({ message: "Error uploading photo: " + err.message });
    }
};
