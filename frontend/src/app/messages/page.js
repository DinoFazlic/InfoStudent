"use client";

import ChatCard from "../../components/ChatCard";
import ChatWindow from "../../components/ChatWindow";
import React, { useEffect, useState } from "react";
import socket from "../../lib/socket"; // or "../lib/socket" based on your path


const hardcodedChats = [
  { id: 1, name: "Dino", lastMessage: "Vidimo se sutra!" },
  { id: 2, name: "Nejra", lastMessage: "Hvala ti 💙" },
  { id: 3, name: "Lejla", lastMessage: "Ok, dogovoreno." },
  { id: 13, name: "test", lastMessage: "Ok, dogovoreno." },
];

export default function MessagesPage() {
  let currentUserId = typeof window !== "undefined" && window.location.search.includes("user=13") ? 13 : 1;
 const chats = hardcodedChats.filter(chat => chat.id !== currentUserId);

  const [activeChat, setActiveChat] = useState(chats[0]);
  //const [activeChat, setActiveChat] = useState(hardcodedChats[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row relative">
      {/* Toggle button (only visible on mobile) */}
      <button
        className="absolute top-4 left-4 z-10 md:hidden bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "<" : ">"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-2/3 bg-white shadow-md transform transition-transform z-20 md:static md:translate-x-0 md:w-1/4 md:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4">Poruke</h2>
          {hardcodedChats.map((chat) => (
            <ChatCard
              key={chat.id}
              name={chat.name}
              lastMessage={chat.lastMessage}
              isActive={chat.id === activeChat.id}
              onClick={() => {
                setActiveChat(chat);
                setSidebarOpen(false); // close on mobile after click
              }}
            />
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 p-4 mt-16 md:mt-0">
        <ChatWindow chat={activeChat} currentUserId={currentUserId} />

      </div>
    </div>
  );
}
