const mongoose = require("mongoose");
const validator = require("validator");
const UserScema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // mongoose will convert the email to lowercase before saving it to the database
      // lowercase: true,
      //reduce space
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email " + value);
        }
        if (!validator.isLowercase(value)) {
          throw new Error("Email must be lowercase");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a strong password" + value);
        }
      },
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
      max: 100,
    },
    profession: {
      type: String,
    },
    profile: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.ZxmzSm13YnTZUqaOpae0JwAAAA?w=172&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL" + value);
        }
      },
    },
    Bio: {
      type: String,
      default: "I am good....",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 5) {
          throw new Error("skills not be more than 5");
        }
      },
    },
    language: {
      type: [String],
      validator(value){
        if(value.length>4){
          throw new Error("language not be more than 4");
        }
      }
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("user", UserScema);
