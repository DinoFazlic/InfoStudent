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

  // 1️⃣ Dohvati korisnika
  useEffect(() => {
    axios.get('http://localhost:8000/auth/users/me', { withCredentials: true })
      .then(res => {
        setCurrentUserId(res.data.id);
      })
      .catch(err => {
        console.error("Greška kod /auth/users/me", err);
      });
  }, []);

  // 2️⃣ Kad imamo usera, učitaj poruke
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

  // 3️⃣ WebSocket setup
  const { sendMessage } = useWebSocket(currentUserId, (data) => {
    setMessages((prev) => [...prev, data]);
  });

  // 4️⃣ Slanje poruke
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
