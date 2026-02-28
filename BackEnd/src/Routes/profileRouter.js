const express = require("express");
const profilereq = express.Router();
const { userAuth } = require("../middlewares/auth");
const profileController = require("../controllers/profileController");

profilereq.get("/profile", userAuth, profileController.viewProfile);
profilereq.patch("/profile/edit", userAuth, profileController.editProfile);
profilereq.patch("/profile/password", userAuth, profileController.updatePassword);

// Include multer upload middleware (single file named 'photo')
const upload = require("../middlewares/multer");
profilereq.post("/profile/upload-photo", userAuth, upload.single('photo'), profileController.uploadPhoto);

module.exports = profilereq;
