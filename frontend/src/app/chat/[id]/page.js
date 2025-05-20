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

  // ✅ 🟢 VALID: hook is called at top level of the component
  const { sendMessage } = useWebSocket(currentUserId, (data) => {
    console.log("📥 Primljena poruka:", data);
    setMessages((prev) => [...prev, data]);
  });

  // 🔁 Load user on mount
  useEffect(() => {
    axios.get('http://localhost:8000/auth/users/me', { withCredentials: true })
      .then(res => {
        setCurrentUserId(res.data.id);
      })
      .catch(err => {
        console.error("Greška kod /auth/users/me", err);
      });
  }, []);

  // 💬 Load old messages when user info is ready
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

  if (!currentUserId) return <p>Učitavanje...</p>;

  return (
    <div>
      <h2>Chat sa korisnikom {otherUserId}</h2>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.sender_id === currentUserId ? 'Ja' : 'Oni'}:</b> {msg.content}
          </p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Pošalji</button>
    </div>
  );
}
