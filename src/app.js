const express = require('express'); //express acess express module/package
const app =express(); //app acessing express function 
//create request
//this will only handle get call to /user
app.get('/user',(req,res)=>{
    res.send({firstName :"Saubhagya",LastName:"Baliarsingh"});
})
//dynamic Route

// app.get('/user/:userId/:user/:password',(req,res)=>{
//     console.log(req.params);
//     res.send({firstName :"Saubhagya",LastName:"Baliarsingh"});
// })

//get- get the data
//post-post/save the data so..
app.post('/user',(req,res)=>{
    res.send("Data sucessfully inserted");
})

app.delete('/user',(req,res)=>{
    res.send("Data sucessfully deleted");
})

//this will match all HTTp method Api calls to /hello but...
app.use('/hello',(req,res)=>{
    res.send('Hello world ')
});

app.listen(8888,()=>{
    console.log('Server connected sucessfully');
    
})
