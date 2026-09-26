import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('⚡ Socket.IO connected:', newSocket.id);
      if (user) {
        newSocket.emit('join_room', { userId: user.id, role: user.role });
      }
    });

    newSocket.on('new_nearby_donation', (data) => {
      toast.success(data.message, { icon: '🍲', duration: 5000 });
      setNotifications(prev => [{ id: Date.now(), text: data.message, time: 'Just now' }, ...prev]);
    });

    newSocket.on('donation_claimed', (data) => {
      toast.success(data.message, { icon: '🤝', duration: 5000 });
      setNotifications(prev => [{ id: Date.now(), text: data.message, time: 'Just now' }, ...prev]);
    });

    newSocket.on('delivery_assigned', (data) => {
      toast.success(data.message, { icon: '🚚', duration: 5000 });
      setNotifications(prev => [{ id: Date.now(), text: data.message, time: 'Just now' }, ...prev]);
    });

    newSocket.on('delivery_completed', (data) => {
      toast.success(data.message, { icon: '🎉', duration: 5000 });
      setNotifications(prev => [{ id: Date.now(), text: data.message, time: 'Just now' }, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
