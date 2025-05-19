"use client";

import React, { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function ChatWindow({ chat, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // TEMP for testing
let testUserId  = typeof window !== "undefined" && window.location.search.includes("user=13") ? 13 : 1;


useEffect(() => {
  if (!chat) return;

  socket.emit("join", { user_id: currentUserId });
  console.log(`✅ Joined socket as user ${currentUserId}`);

  const handleReceive = (msg) => {
    console.log("📥 Received message:", msg);

    if (
      (msg.sender_id === currentUserId && msg.receiver_id === chat.id) ||
      (msg.sender_id === chat.id && msg.receiver_id === currentUserId)
    ) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  socket.on("receive_message", handleReceive);

  return () => {
    socket.off("receive_message", handleReceive);
  };
}, [chat, currentUserId]);



  const handleSend = () => {
  if (!input.trim() || !chat) return;

  const message = {
    sender_id: currentUserId,
    receiver_id: chat.id,
    content: input,
  };

  console.log("📤 Sending message:", message); // ADD THIS

  socket.emit("send_message", message);
  setMessages((prev) => [...prev, message]);
  setInput("");
 };


  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender_id === currentUserId ? "Me" : "Them"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l"
        />
        
        <button onClick={() => console.log("🟡 activeChat:", chat)}>active chat</button>
        <button onClick={() => console.log("✅ Test button works")}>Test</button>
        

        <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          handleSend();
        }}
        className="mt-4 flex"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Send
  </button>
</form>

      </div>
    </div>
  );
}
