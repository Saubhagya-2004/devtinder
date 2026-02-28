const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserScema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 25,
      trim: true,
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
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },
    profession: {
      type: String,
    },
    profile: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX7HRicGdWDIgAs9L2WZqSw-rpPd7VWrD0pvS0gQmc0hzoi9zJJA0ZEXH7aExSmGP1ZCU&usqp=CAU",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL" + value);
        }
      },
    },
    Bio: {
      type: String,
      maxLength: 100,
      trim: true,
      default: "I am good....",
    },
    skills: {
      type: [String],
      trim: true,
      validate(value) {
        if (value.length > 5) {
          throw new Error("skills not be more than 5");
        }
      },
    },
    language: {
      type: [String],
      validator(value) {
        if (value.length > 4) {
          throw new Error("language not be more than 4");
        }
      },
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
UserScema.methods.getjwt = async function () {
  const userAuth = this;
  //this represent instance usermodel
  const token = await jwt.sign({ _id: userAuth._id }, process.env.JWT_SECRET, {
    expiresIn: "27d",
  });
  return token;
};
//compound index  it will help find query in db
//putting index 
UserScema.index({ email: 1, firstName: 1, lastName: 1 });
//password validate scema
UserScema.methods.validatepassword = async function (passwordinputByuser) {
  const user = this;
  const passwordhash = user.password;
  //password hash here saved in db hashing password
  const ispasswordvalid = await bcrypt.compare(
    passwordinputByuser,
    passwordhash
  );
  return ispasswordvalid;
};

module.exports = mongoose.model("user", UserScema);
