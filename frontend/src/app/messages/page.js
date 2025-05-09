"use client";
import { useState } from "react";
import ChatCard from "../../components/ChatCard";

export default function ChatPage() {
  const chats = [
    { id: 1, name: "Dino", lastMessage: "See you soon 👋" },
    { id: 2, name: "QueenBot", lastMessage: "Yaaas queen 💅" },
    { id: 3, name: "Client A", lastMessage: "Can you send the doc?" },
  ];

  const [selectedChat, setSelectedChat] = useState(chats[0]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-1/3 bg-white border-r overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="space-y-2">
          {chats.map((chat) => (
            <ChatCard
              key={chat.id}
              name={chat.name}
              lastMessage={chat.lastMessage}
              isActive={selectedChat?.id === chat.id}
              onClick={() => setSelectedChat(chat)}
            />
          ))}
        </div>
      </aside>

      {/* Main chat window */}
    <div className="flex h-[calc(100vh-64px)] bg-blue-50 text-black">
        {/* rest of your chat code */}

      <section className="flex-1 flex flex-col p-6">
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              {selectedChat?.name || "Select a chat"}
            </h2>
          </div>

          {/* Dummy messages */}
          <div className="space-y-4">
            <div className="bg-blue-100 p-3 rounded-lg self-start max-w-sm">
              Hello {selectedChat?.name}!
            </div>
            <div className="bg-gray-200 p-3 rounded-lg self-end max-w-sm">
              Hi Queen!
            </div>
          </div>
        </div>

        <form className="mt-4 flex">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
          >
            Send
          </button>
        </form>
      </section>
      </div>
    </div>
  );
}
