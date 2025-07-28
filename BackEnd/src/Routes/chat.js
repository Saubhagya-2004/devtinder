const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { Chat } = require('../models/Chat');
const chatRouter = express.Router();
chatRouter.get("/chat/:targetuserId",userAuth,async(req,res)=>{
    const{targetuserId} = req.params;
    const userId = req.user._id;
    try{
let chat = await Chat.findOne({
    participants:{$all:[userId,targetuserId]},
}).populate({
    path:"messages.senderId",
    select:"firstName lastName"
})
if(!chat){
    chat= new Chat({
        participants:[userId,targetuserId],
        messages:[],
    });
    await chat.save();
}
res.json(chat)

    }
    catch(err){
res.status(400).send("Bad request")
    }
})
module.exports=chatRouter