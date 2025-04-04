const admin = (req, res, next) => {
  console.log("Admin middleware triggered");
  const token = req.headers["authorization"];
  // Go to the Headers tab and add Key: Authorization Value: xyz;
  if (token === "xyz") {
    console.log("Authorized");
    next(); // Pass control to the next middleware or route
  } else {
    console.log("Unauthorized");
    res.status(401).send("Unauthorized"); // Send unauthorized response
  }
};


//user
const userAuth =(req,res,next)=>{
    console.log("User Auth middleware triggered");
    const token = req.headers['authorization'];
    if(token === "abc"){
        console.log('authorized');
        next();
}
else{
    console.log('unauthorized');
    res.status(401).send('unauthorized')
}
}

module.exports = { admin,userAuth };
