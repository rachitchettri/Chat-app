import userAvatar from './assets/images.jpeg';
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:4000", {
  transports: ["websocket"],
  withCredentials: true,
});
function Navbar({ username, isActive }) {
  return (
    <div className="navbar bg-gray-800 p-4 text-white flex items-center justify-between rounded-t-md">
      <div className="flex items-center">
        <img
          src={userAvatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-2" 
        />
        <div className="username font-semibold">{username}</div>
      </div>
      <div className={`status ${isActive ? "bg-green-500" : "bg-red-500"} w-3 h-3 rounded-full`}></div>
    </div>
  );
}
function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("Rachit Chettri"); 
  const [isActive, setIsActive] = useState(true); 
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsActive(true); 
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsActive(false); 
    });

    return () => {
      socket.off("message");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
<div className="App min-h-screen bg-gray-900 flex flex-col">
      <div className="chat-container flex flex-col flex-1 overflow-hidden">
        <Navbar username={username} isActive={isActive} />
        <div className="messages-container flex-1 overflow-y-auto p-4 bg-black flex flex-col items-end">
          <div className="messages w-full flex flex-col items-end">
  
            {messages.map((msg, index) => (
                
              <div key={index}className="message mb-2 p-2 bg-blue-800 text-white rounded-xl shadow-sm flex items-center">
                {msg}
             
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="message-form flex bg-black p-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder=""
            className="flex-1 p-2 border border-gray-700 bg-gray-800 rounded-l-md text-white "
          />
          <button
            type="submit"
            className="bg-blue-800 text-white  p-2 rounded-r-md hover:bg-blue-900 transition duration-300 "
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;