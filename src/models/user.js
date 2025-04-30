const mongoose = require("mongoose");
const UserScema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 25,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // mongoose will convert the email to lowercase before saving it to the database
    lowercase: true,
    //reduce space
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    required: true,
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender is not valid");
      }
    },
  },
  age: {
    type: Number,
    min: 18,
  },
  profession: {
    type: String,
  },
  profile: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.ZxmzSm13YnTZUqaOpae0JwAAAA?w=172&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  },
  Bio: {
    type: String,
    default: "I am good....",
  },
  skills: {
    type: [String],
  },
});
module.exports = mongoose.model("user", UserScema);
