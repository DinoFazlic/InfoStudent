'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { HiOutlineMail } from 'react-icons/hi';

export default function ChatContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:8000/api/messages/contacts', {
      withCredentials: true,
    })
      .then(res => setContacts(res.data))
      .catch(err => console.error("Greška pri dohvaćanju kontakata", err));
  }, []);

  const handleStartChat = () => {
    setError(null);
    axios.get(`http://localhost:8000/auth/users/email/${emailInput}`, {
      withCredentials: true
    })
      .then(res => {
        const userId = res.data.id;
        if (!userId) throw new Error("User ID not found");
        router.push(`/chat/${userId}`);
      })
      .catch(err => {
        console.error(err);
        setError('Korisnik sa tom email adresom ne postoji.');
      });
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-3xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Kontakti</h1>
        <p className="text-gray-500 mb-8">Izaberi kontakt za nastavak razgovora ili započni novi.</p>

        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-10">
          {/* Lista kontakata */}
          <div>
            <ul className="space-y-5">
              {contacts.slice(0, 6).map((c) => (
                <Link href={`/chat/${c.id}`} key={c.id}>
                  <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mb-6 hover:bg-gray-200 transition cursor-pointer shadow-sm">
                    <HiOutlineMail className="text-blue-600 text-xl" />
                    <span className="text-gray-800 font-medium">{c.email}</span>
                  </div>
                </Link>
              ))}
            </ul>
          </div>

          {/* Forma + ilustracija */}
          <div className='p-2'>
            <div className="h-92 rounded-2xl overflow-hidden">
              <img
                src="/illustrations/chaticon.PNG"
                alt="Student illustration"
                className="h-full w-full object-contain"
              />
            </div>

            <h3 className="text-xl font-semibold text-blue-700 mb-4">Nova poruka</h3>
            <input
              type="email"
              placeholder="Unesi email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleStartChat}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
            >
              Započni
            </button>
            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
