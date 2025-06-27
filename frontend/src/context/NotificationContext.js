'use client';
import { createContext, useContext, useState } from 'react';
import Notification from '@/components/Notification';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState(null);

  const showNotification = (msg) => {
    setMessage(msg);
  };

  const hideNotification = () => {
    setMessage(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {message && (
        <Notification message={message} onClose={hideNotification} />
      )}
    </NotificationContext.Provider>
  );
}

// Hook
export const useNotification = () => {
  return useContext(NotificationContext);
};
