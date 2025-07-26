import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewmessage] = useState("");
  const socketRef = useRef(null);
  
  const { targetuserId } = useParams();
  const connections = useSelector((state) => state.connection);
  const user = useSelector((store) => store.user);
  
  const userId = user?.data?._id;
  const firstName = user?.data?.firstName;
  
  // Find target user name
  const targetUser = connections?.find(conn => conn._id === targetuserId);
  const targetUserName = targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Unknown User";

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;
    
    socket.emit("joinChat", { firstName, userId, targetuserId });
    
    socket.on("messageRecived", ({ firstName: senderName, textmsg }) => {
      console.log(senderName + ":" + textmsg);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: textmsg, sender: senderName }
      ]);
    });
    
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetuserId, firstName]);

  const sendMessage = () => {
    if (socketRef.current && newmessage.trim()) {
      socketRef.current.emit("sendMessage", {
        firstName,
        userId,
        targetuserId,
        textmsg: newmessage
      });
      setNewmessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="w-1/2 mx-auto border border-gray-300 m-5 h-[80vh] p-5 flex flex-col rounded-2xl">
      
      <div className="border-b border-gray-300 pb-2 mb-2">
        <h1 className="text-lg font-medium">
          Chat with {targetUserName}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className={`chat ${msg.sender === firstName ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-header">
                {msg.sender === firstName ? firstName : targetUser?.firstName || msg.sender}
                <time className="text-xs opacity-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
              <div className="chat-bubble bg-pink-200 text-black">{msg.text}</div>
              <div className="chat-footer opacity-50">
                {msg.sender === firstName ? 'Sent' : 'Delivered'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newmessage}
          onChange={(e) => setNewmessage(e.target.value)}
          onKeyPress={handleKeyPress}
          type="text"
          className="flex-1 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={!newmessage.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;