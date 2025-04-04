const mongoose = require('mongoose');
const userScema = new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
    }
});
module.exports = mongoose.model('User',userScema);