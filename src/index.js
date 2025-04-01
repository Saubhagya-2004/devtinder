const express = require('express');
const app = express();
app.use('/user',(req,res,next)=>
    {
    console.log('sucessfully');
    next();
    res.send('welcome')
},
[(req,res,next)=>{
    next();
    console.log('sucessfully 2');
    // res.send('Hi 1')
},
(req,res,next)=>{
    next();
    console.log('sucessfully 3');
    // res.send('Hi 2')

}],
(req,res)=>{
    console.log('sucessfully 4');
    res.send('Hi 3')
    
    
}
);
app.listen(3333,()=>{
    console.log('server is running');
})