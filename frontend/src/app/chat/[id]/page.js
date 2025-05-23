'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import axios from 'axios';

export default function ChatPage() {
  const { id } = useParams();
  const otherUserId = parseInt(id);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const { sendMessage } = useWebSocket(currentUserId, (data) => {
    console.log("📥 Primljena poruka:", data);
    setMessages((prev) => [...prev, data]);
  });

  useEffect(() => {
    axios.get('http://localhost:8000/auth/users/me', { withCredentials: true })
      .then(res => {
        setCurrentUserId(res.data.id);
      })
      .catch(err => {
        console.error("Greška kod /auth/users/me", err);
      });
  }, []);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;
    axios.get(`http://localhost:8000/api/messages/chat/${otherUserId}`, {
      withCredentials: true
    })
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => {
        console.error("Greška kod učitavanja poruka", err);
      });
  }, [currentUserId, otherUserId]);

  const handleSend = () => {
    if (!input) return;
    sendMessage(otherUserId, input);
    setMessages((prev) => [
      ...prev,
      { sender_id: currentUserId, receiver_id: otherUserId, content: input }
    ]);
    setInput('');
  };

  if (!currentUserId) return (
    <div className="flex items-center justify-center h-screen bg-white text-blue-500 text-lg">
      Učitavanje...
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full min-h-[80vh] max-h-screen-lg bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Chat sa korisnikom user.id = {otherUserId}
        </h2>

        <div className="h-96 overflow-y-auto border border-gray-200 min-h-[80vh] rounded-lg p-4 mb-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded-md text-sm max-w-x break-words max-w-sm whitespace-pre-wraps ${
                msg.sender_id === currentUserId
                  ? "ml-auto bg-blue-100 text-blue-800"
                  : "mr-auto bg-gray-200 text-gray-700"
              }`}
            >
              <span className="block font-medium">
                {msg.sender_id === currentUserId ? 'Ja' : 'Oni'}
              </span>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Napiši poruku..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Pošalji
          </button>
        </div>
      </div>
    </div>
  );
}
