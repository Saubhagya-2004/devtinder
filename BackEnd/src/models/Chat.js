const mongoose = require('mongoose');
const user = require("./user")

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }],
    messages: [messageSchema]
}, { timestamps: true })

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };