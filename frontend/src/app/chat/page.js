'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ChatContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:8000/api/messages/contacts', {
      withCredentials: true
    })
      .then(res => setContacts(res.data))
      .catch(err => console.error("Greška pri dohvaćanju kontakata", err));
  }, []);

  const handleStartChat = () => {
    axios.get(`http://localhost:8000/api/users/email/${emailInput}`, {
      withCredentials: true
    })
      .then(res => {
        const userId = res.data.id;
        router.push(`/chat/${userId}`);
      })
      .catch(() => setError('Korisnik sa tom email adresom ne postoji.'));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Kontakti</h1>
      <ul>
        {contacts.map((c) => (
          <li key={c.id}>{c.email} → <a href={`/chat/${c.id}`}>Chat</a></li>
        ))}
      </ul>

      <h3>Nova poruka</h3>
      <input
        type="email"
        placeholder="Unesi email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
      />
      <button onClick={handleStartChat}>Započni</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
