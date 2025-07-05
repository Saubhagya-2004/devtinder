const jwt = require('jsonwebtoken');
const User = require('../models/user')
const userAuth =async(req,res,next)=>{
  try{
    //get token from user cookies
    const cookies =req.cookies;
    const {token} = cookies;
    if(!token){
     return res.status(401).send('Unauthorized Access: Token not found')
    }
    //validate my token
    const decodedMessage = await jwt.verify(token,'Dev@$Tinder2004*');
    const {_id} = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
      return res.status(404).send('User not found')
    }
    req.user = user
    req.token = token;
    next();

  }catch(err){
    res.status(400).send('Unauthorized access, please login ' + err.message);
  }
}


module.exports = { userAuth };
