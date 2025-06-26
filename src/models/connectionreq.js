const mongoose = require('mongoose')
const UserScema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    ReciverId:{
        type:mongoose.Schema.Types.ObjectId,
         required:true
    },
    status:{
        type:String,
        enum:{
            values:['pending','accept','interest','reject','ignored'],
            message:'{VALUE} is not a valid status'
        },
        default:'pending'
        }
    }

);
const Connectionrequest = mongoose.model('Connectionreq',UserScema);
module.exports = Connectionrequest