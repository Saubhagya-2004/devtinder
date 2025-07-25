import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([{ text: "Hello !!!" }]);
  const { targetuserId } = useParams();

  return (
    <div className="w-1/2 mx-auto border border-gray-300 m-5 h-[80vh] p-5 flex flex-col rounded-2xl">
      <div className="border-b border-gray-300 pb-2 mb-2">
        <h1 className="text-lg font-medium">
          Chat with User #{targetuserId}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 p-2 rounded">
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                Anakin
                <time className="text-xs opacity-50">12:46</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen at 12:46</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;