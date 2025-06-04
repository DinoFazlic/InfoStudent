'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import axios from 'axios';

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const otherUserId = parseInt(id);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [otherUsername, setOtherUsername] = useState("");

  const { sendMessage } = useWebSocket(currentUserId, (data) => {
    console.log("Message received:", data);
    setMessages((prev) => [...prev, data]);
  });

  useEffect(() => {
    axios.get('http://localhost:8000/auth/users/me', { withCredentials: true })
      .then(res => {
        setCurrentUserId(res.data.id);
      })
      .catch(err => {
        console.error("Error fetching /auth/users/me", err);
      });
  }, []);

  useEffect(() => {
    if (!otherUserId) return;
    axios.get(`http://localhost:8000/auth/users/${otherUserId}`, { withCredentials: true })
      .then(res => {
        setOtherUsername(res.data.first_name + " " + res.data.last_name);
      })
      .catch(err => {
        setOtherUsername(`User ${otherUserId}`);
      });
  }, [otherUserId]);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;
    axios.get(`http://localhost:8000/api/messages/chat/${otherUserId}`, {
      withCredentials: true
    })
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => {
        console.error("Error loading messages", err);
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
      Loading...
    </div>
  );

  return (
    <div className="w-full min-h-[60vh] max-h-screen-lg bg-white shadow-md p-6" style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')", backgroundPosition: "center" }}>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/chat')}
          className="max-w-7xl mx-auto mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md inline-flex items-center transition cursor-pointer"
        >
          Back to Contacts
        </button>
      </div>
      
      <h2 className="text-4xl font-semibold text-blue-600 mb-4 max-w-7xl mx-auto">
        Chat with {otherUsername}
      </h2>

      <div className="h-96 overflow-y-auto min-h-[70vh] max-w-7xl mx-auto rounded-md p-4 mb-4 bg-gray-100 bg-cover bg-center bg-no-repeat border border-gray-800 shadow-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 p-3 rounded-3xl text-md max-w-xs break-words whitespace-pre-wrap ${
              msg.sender_id === currentUserId
                ? "ml-auto bg-blue-300 text-blue-950"
                : "mr-auto bg-gray-300 text-gray-750"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
          className="bg-gray-100 flex-1 border border-black rounded-md px-4 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-xl font-bold cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
