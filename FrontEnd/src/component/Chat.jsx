import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { FaCheckDouble } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewmessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { targetuserId } = useParams();
  const connections = useSelector((state) => state.connection);
  const user = useSelector((store) => store.user);

  const userId = user?.data?._id;
  const firstName = user?.data?.firstName;
 const fetchchatmessage = async () => {
  const chatmessage = await axios.get(BASE_URL + "/chat/" + targetuserId, {
    withCredentials: true,
  });

  console.log("Fetched Chat:", chatmessage.data.messages);

  const chatmsg = chatmessage?.data?.messages.map((msg) => {
    const { senderId, text, createdAt } = msg;

    return {
      firstName: senderId?.firstName,
      sender: senderId?.firstName,
      text,
      timestamp: createdAt ? new Date(createdAt).getTime() : Date.now(),
      isOwn: senderId?._id === userId,
    };
  });

  setMessages(chatmsg);
};
  useEffect(()=>{
fetchchatmessage();
  },[])

  // Find target user name
  const targetUser = connections?.find((conn) => conn._id === targetuserId);
  const targetUserName = targetUser
    ? `${targetUser.firstName} ${targetUser.lastName}`
    : "Unknown User";

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId || !targetuserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // Handle connection events
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
      socket.emit("joinChat", { firstName, userId, targetuserId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    // Handle incoming messages
    socket.on("messageRecived", ({ firstName: senderName, textmsg }) => {
      console.log(senderName + ":" + textmsg);

      setMessages((prevMessages) => {
        // Check if this message is from the current user to avoid duplicates
        // (since we already added it optimistically)
        if (senderName === firstName) {
          return prevMessages; // Don't add duplicate for own messages
        }

        return [
          ...prevMessages,
          {
            text: textmsg,
            sender: senderName,
            timestamp: Date.now(),
            isOwn: false,
          },
        ];
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [userId, targetuserId, firstName]);

  const sendMessage = () => {
    if (socketRef.current && newmessage.trim() && isConnected) {
      const optimisticMessage = {
        text: newmessage,
        sender: firstName,
        timestamp: Date.now(),
        isOwn: true,
      };

      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      socketRef.current.emit("sendMessage", {
        firstName,
        userId,
        targetuserId,
        textmsg: newmessage,
      });

      setNewmessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
<div className="w-1/2 mx-auto border border-gray-300 m-5 h-[80vh] p-5 flex flex-col rounded-2xl">
  <div className="border-b border-gray-300 pb-2 mb-2">
    <h1 className="text-lg font-medium">Chat with {targetUserName}</h1>
  </div>

  <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 p-2 rounded">
    {messages.length === 0 ? (
      <div className="text-center text-gray-500 mt-10">
        No messages yet. Start the conversation!
      </div>
    ) : (
      messages.map((msg, index) => (
        <div key={index} className={`mb-4 flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[80%] px-3 py-2 rounded-lg ${
              msg.isOwn
                ? "bg-pink-200 text-black"
                : "bg-green-300 text-black border"
            }`}
          >
            {/* Show sender name only for received messages */}
            {!msg.isOwn && (
              <div className="text-xs font-medium mb-1 text-gray-700">
                {msg.sender || targetUser?.firstName}
              </div>
            )}

            <div className="text-sm break-words">{msg.text}</div>

            <div className="flex justify-end items-end mt-1">
              <time className="text-xs opacity-100">
                {formatTime(msg.timestamp)}
              </time>
              {msg.isOwn && (
                <span className="text-xs text-black opacity-50 ml-1">
                  • seen
                </span>
              )}
            </div>
          </div>
        </div>
      ))
    )}
    <div ref={messagesEndRef} />
  </div>

  <div className="flex gap-2">
    <input
      value={newmessage}
      onChange={(e) => setNewmessage(e.target.value)}
      onKeyPress={handleKeyPress}
      type="text"
      className="flex-1 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      placeholder="Type a message..."
      disabled={!isConnected}
    />
    <button
      onClick={sendMessage}
      disabled={!newmessage.trim() || !isConnected}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
    >
      Send
    </button>
  </div>
</div>
  );
};

export default Chat;
