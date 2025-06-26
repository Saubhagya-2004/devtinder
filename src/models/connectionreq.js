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
            values:['pending','accept','intrest','reject'],
            message:'{VALUE} is not a valid status'
        },
        default:'pending'
        }
    }

)