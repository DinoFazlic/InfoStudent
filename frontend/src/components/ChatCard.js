"use client";

import React from "react";

export default function ChatCard({ name, lastMessage, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition mb-2 ${
        isActive ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
    >
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
    </div>
  );
}
