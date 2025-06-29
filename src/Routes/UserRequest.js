const express = require('express');
const {userAuth} = require('../middlewares/auth');
const UserRequest = express.Router();
const  Connectionreq = require('../models/connectionreq');

//get all the pending connection requests
UserRequest.get('/user/requests/recived',userAuth,async(req,res)=>{
    try{
const LoggedinUser = req.user;
const connection = await Connectionreq.find({
    ReciverId:LoggedinUser._id,
    status:"interest"
}).populate("senderId",["firstName","lastName","profile"]);
// }).populate("senderId","firstName lastName"); //same

if(connection.length===0){
    return res.status(400).json({message:"Invalid connection request"})
}
res.json({
    message:"Data fetched sucessfully",
    data:connection
})
    }
    catch(err){
        res.status(400).json({
            message:"ERROR"+err.message
        })
    }
})
module.exports = UserRequest;