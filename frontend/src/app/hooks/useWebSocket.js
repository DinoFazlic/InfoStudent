import { useEffect, useRef } from 'react';

export function useWebSocket(userId, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    socket.onopen = () => {
      console.log('🟢 Connected WebSocket');
    };

    socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data); // šalje poruku u ChatPage
  };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [userId]);

  const sendMessage = (receiverId, message) => {
    socketRef.current?.send(JSON.stringify({ receiver_id: receiverId, message }));
  };

  return { sendMessage };
}
