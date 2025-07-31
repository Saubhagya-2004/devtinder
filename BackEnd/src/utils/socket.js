const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/Chat");
const connectioReq= require("../models/connectionreq")

const getSecretRoomId = (userId, targetuserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetuserId].sort().join("_"))
    .digest("hex");
};
const intializesocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    //handle event
    socket.on("joinChat", ({ firstName, userId, targetuserId }) => {
      const roomId = getSecretRoomId(userId, targetuserId);
      console.log(firstName + " joinning room " + roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetuserId, textmsg }) => {
        //save message to the database
        try {
          const roomId = getSecretRoomId(userId, targetuserId);
          console.log(firstName + " ::" + textmsg);
        const connection= await connectioReq.find({
          $or:[
            {senderId:userId,ReciverId:targetuserId,status:"accepted"},
            {senderId:targetuserId,ReciverId:userId,status:"accepted"}
          ]
          
        })
        if(connection.length==0){
           socket.emit("messageError", {
          error: "You are not connected with this user"
        });
        return;
        }
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetuserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetuserId],
              messages: [],
            });
          }
            chat.messages.push({
              senderId:userId,
              text:textmsg
            })
          
            await chat.save();
            io.to(roomId).emit("messageRecived", { firstName, textmsg });
          } catch (err) {
            console.log(err.message)
          }

      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = intializesocket;
