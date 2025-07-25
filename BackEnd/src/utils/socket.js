const socket= require("socket.io")

const intializesocket= (server)=>{
const io= socket(server,{
  cros:{
    origin:"http://localhost:5173",
  },
});
io.on("connection",(socket)=>{
  //handle
})
}
module.exports=intializesocket;