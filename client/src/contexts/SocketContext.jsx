import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import BASE_URL from '../config';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, user }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            const newSocket = io(BASE_URL);
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join', user.id);
            });

            newSocket.on('match_found', (data) => {
                setNotifications(prev => [{
                    id: Date.now(),
                    type: 'match',
                    message: data.message,
                    match_id: data.match_id, // Ensure this comes from backend
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: false
                }, ...prev]);

                // Play success sound for match
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.6;
                audio.play().catch(e => console.log('Audio autoplay blocked'));

                console.log('Real-time notification received');
            });

            newSocket.on('new_message', (data) => {
                setNotifications(prev => [{
                    id: Date.now() + 1,
                    type: 'message',
                    message: `New message from ${data.sender_name || 'User'}: ${data.message}`,
                    match_id: data.match_id,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: false
                }, ...prev]);

                // Play modern notification sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Audio autoplay blocked by browser'));

                console.log('New real-time message received');
            });
            
            newSocket.on('handoff_completed', (data) => {
                toast.success(data.message, { duration: 5000, icon: '✅' });
                // Force refresh to update status and trust score
                setTimeout(() => window.location.reload(), 2000);
            });

            return () => newSocket.close();
        }
    }, [user]);

    const clearNotifications = () => setNotifications([]);
    const markAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, clearNotifications, markAsRead }}>
            {children}
        </SocketContext.Provider>
    );
};
