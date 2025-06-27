'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import axios from 'axios';
import { useNotification } from '@/context/NotificationContext';  // 👈 OVO DODAJ
import UserProfileCard from '@/components/UserProfileCard';



export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const otherUserId = parseInt(id);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [otherUsername, setOtherUsername] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [otherAvatarUrl, setOtherAvatarUrl] = useState(null);



  const { showNotification } = useNotification(); 


  

const { sendMessage } = useWebSocket(currentUserId, (data) => {
  console.log("Message received:", data);
  setMessages((prev) => [...prev, data]);

  showNotification(`Nova poruka: ${data.content}`);
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
        const raw = res.data.profile_photo_url;
        const fullUrl = raw?.startsWith("http")
          ? raw
          : raw
            ? `http://localhost:8000/${raw.replace(/^\/?/, '')}`
            : null;
        setOtherAvatarUrl(fullUrl);

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
      <div
        className="w-full min-h-screen bg-white bg-cover bg-center p-6"
        style={{ backgroundImage: "url('/backgrounds/post-bg4.svg')" }}
      >
        <div className="max-w-3xl mx-auto bg-white/90 rounded-lg shadow-md p-6 space-y-6">
          <button
            onClick={() => router.push('/chat')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition"
          >
            ← Back to Contacts
          </button>

          <div className="flex items-center gap-4 justify-center">
          <img
            src={otherAvatarUrl || "/default-avatar.png"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-blue-400 shadow"
          />
          <h2 className="text-2xl font-semibold text-blue-700">
            Chat with {otherUsername}
          </h2>
        </div>



          <div className="h-[400px] overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-300 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-sm max-w-[75%] break-words whitespace-pre-wrap ${
                  msg.sender_id === currentUserId
                    ? "ml-auto bg-blue-200 text-blue-900"
                    : "mr-auto bg-gray-300 text-gray-800"
                }`}
              >
                <div>{msg.content}</div>
                {msg.timestamp && (
                  <div className="text-[10px] text-right mt-1 opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
            >
              Send
            </button>
          </div>
        </div>



      </div>

      
    );

}
