const mongoose = require("mongoose");
const UserScema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ReciverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "interest", "rejected", "ignored"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

//compound index  it will help find query in db
//putting index 
UserScema.index({ senderId: 1, ReciverId: 1 });
// check validation before saving
UserScema.pre("save", function (next) {
  const connection = this;
  if (connection.senderId.equals(connection.ReciverId)) {
    throw new Error("cannot send request Yourself");
  }
  next();
});

const Connectionrequest = mongoose.model("Connectionreq", UserScema);
module.exports = Connectionrequest;
