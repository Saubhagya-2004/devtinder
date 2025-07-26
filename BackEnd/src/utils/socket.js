const socket= require("socket.io")
const crypto = require("crypto")


const getSecretRoomId = (userId,targetuserId)=>{
  return crypto
  .createHash("sha256")
  .update([userId,targetuserId].sort().join("_"))
  .digest("hex")
}
const intializesocket= (server)=>{
const io= socket(server,{
  cors:{
    origin:"http://localhost:5173",
  },
});
io.on("connection",(socket)=>{
  //handle event
  socket.on("joinChat",({firstName,userId,targetuserId})=>{
    const roomId = getSecretRoomId(userId,targetuserId);
    console.log(firstName+" joinning room "+roomId);
    socket.join(roomId)
  })
  socket.on("sendMessage",({firstName,userId,targetuserId,textmsg})=>{
    const roomId =  getSecretRoomId(userId,targetuserId);
    console.log(firstName+" ::"+ textmsg);
     io.to(roomId).emit("messageRecived", {firstName, textmsg});
    
  })
  socket.on("disconnect",()=>{})
})
}
module.exports=intializesocket; 