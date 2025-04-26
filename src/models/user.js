const mongoose = require('mongoose');
const UserScema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        // required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        required:true, 
        type:String,
       },
    age:{
        type:Number
    },
    profession:{
        type:String
    }
});
module.exports = mongoose.model('user',UserScema)