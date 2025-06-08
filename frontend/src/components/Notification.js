'use client';
import { useEffect } from 'react';

export default function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // automatski nestane nakon 3 sekunde
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
}
