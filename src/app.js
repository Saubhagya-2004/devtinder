const express = require('express'); //express acess express module/package
const app =express(); //app acessing express function 
//create request
app.use((req,res)=>{
    if(req.url==='/hello'){

        res.send('Hello world ')
    }
});
app.use('/test',(req,res)=>{
    res.send('Test page bbbb')
})
app.listen(8888,()=>{
    console.log('Server connected sucessfully');
    
})
