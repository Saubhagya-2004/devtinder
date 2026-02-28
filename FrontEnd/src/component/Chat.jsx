import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { FaCheckDouble } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { Send, ArrowLeft, MoreVertical, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
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
  useEffect(() => {
    fetchchatmessage();
  }, [])

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
    <div className="min-h-screen bg-transparent p-4 md:p-8 mt-16 relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto h-[82vh] flex flex-col relative z-10">

        {/* Main Chat Container - Glassmorphic */}
        <div className="flex-1 flex flex-col bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">

          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <Link to="/connections" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-3">
                {/* User Avatar Placeholder */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-[2px]">
                    <div className="w-full h-full bg-[#0d1117] rounded-full flex items-center justify-center flex-shrink-0">
                      {targetUser?.photoUrl ? (
                        <img src={targetUser.photoUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {targetUserName.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  {isConnected && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0d1117] rounded-full"></span>
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white tracking-tight leading-tight glow-text-subtle">
                    {targetUserName}
                  </h1>
                  <span className="text-xs text-green-400 font-medium tracking-wide flex items-center gap-1">
                    {isConnected ? "● Online" : <span className="text-gray-500">○ Offline</span>}
                  </span>
                </div>
              </div>
            </div>

            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 animate-pulse">
                <Code2 size={48} className="text-white mb-4 opacity-50" />
                <p className="text-xl font-medium text-white mb-2">Start Collaborating</p>
                <p className="text-sm text-gray-400 max-w-sm">Say hello and start planning your next big feature with {targetUserName}.</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isLatestOwn = msg.isOwn && index === messages.length - 1;
                return (
                  <div
                    key={index}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {!msg.isOwn && (
                      // Optional: small avatar next to received messages
                      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 mr-3 mt-auto mb-1 flex items-center justify-center border border-white/5">
                        {targetUser?.photoUrl ? (
                          <img src={targetUser.photoUrl} className="w-full h-full rounded-full object-cover opacity-80" alt="" />
                        ) : (
                          <span className="text-xs font-bold text-white/50">{msg.sender?.charAt(0) || targetUserName.charAt(0)}</span>
                        )}
                      </div>
                    )}

                    <div className="max-w-[75%] md:max-w-[65%] flex flex-col group">
                      {/* Name for received msgs in group chats, hidden in 1-on-1 but kept for structure */}
                      {!msg.isOwn && (
                        <span className="text-xs text-gray-400 ml-1 mb-1 font-medium">{msg.sender || targetUser?.firstName}</span>
                      )}

                      <div
                        className={`px-4 py-3 relative ${msg.isOwn
                          ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(249,115,22,0.2)]"
                          : "bg-white/10 backdrop-blur-md border border-white/10 text-gray-100 rounded-2xl rounded-tl-sm hover:bg-white-[0.15] transition-colors"
                          }`}
                      >
                        <p className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {/* Time & Status */}
                      <div className={`flex items-center gap-1 mt-1 text-[11px] ${msg.isOwn ? 'justify-end text-orange-200/70 mr-1' : 'justify-start text-gray-500 ml-1'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        <time>{formatTime(msg.timestamp)}</time>
                        {msg.isOwn && (
                          <FaCheckDouble className={isLatestOwn ? "text-orange-400" : "text-white/40"} size={10} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} className="h-4" /> {/* Extra padding at bottom */}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-5 bg-white/5 border-t border-white/10 backdrop-blur-xl">
            <div className="flex items-end gap-3 max-w-5xl mx-auto align-middle relative">
              <textarea
                value={newmessage}
                onChange={(e) => setNewmessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isConnected ? "Write a message..." : "Connecting..."}
                disabled={!isConnected}
                rows={1}
                className="flex-1 max-h-32 min-h-[52px] resize-none bg-[#0d1117]/80 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all scrollbar-thin shadow-inner"
              />
              <button
                onClick={sendMessage}
                disabled={!newmessage.trim() || !isConnected}
                className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${newmessage.trim() && isConnected
                  ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-95 cursor-pointer"
                  : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
                  }`}
              >
                <Send size={20} className={newmessage.trim() && isConnected ? "ml-1" : ""} />
              </button>
            </div>
            {/* Tiny helper text */}
            <div className="text-center mt-2 hidden md:block">
              <span className="text-[10px] text-gray-500">Press <kbd className="font-mono bg-white/10 px-1 rounded">Enter</kbd> to send, <kbd className="font-mono bg-white/10 px-1 rounded">Shift + Enter</kbd> for new line.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
