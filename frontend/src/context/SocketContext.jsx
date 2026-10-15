import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadByContact, setUnreadByContact] = useState({});
  const activeChatContactRef = useRef(null);

  // Helper to set currently opened contact in Chat page
  const setActiveChatContact = (contactId) => {
    activeChatContactRef.current = contactId;
    if (contactId) {
      setUnreadByContact((prev) => {
        if (!prev[contactId]) return prev;
        const next = { ...prev };
        delete next[contactId];
        return next;
      });
    }
  };

  const clearUnreadForContact = (contactId) => {
    setUnreadByContact((prev) => {
      if (!prev[contactId]) return prev;
      const next = { ...prev };
      delete next[contactId];
      return next;
    });
  };

  // Helper to push a temporary toast notification
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Appointment Notifications
    newSocket.on('appointmentCreated', (appointment) => {
      const patientName = appointment?.patientName || 'a patient';
      const toastText = `New appointment booked by ${patientName}`;
      addToast(toastText, 'success');
      setNotifications((prev) => [
        {
          id: Date.now() + Math.random(),
          title: 'New Appointment',
          message: toastText,
          time: new Date(),
          read: false,
          appointment,
        },
        ...prev,
      ]);
    });

    newSocket.on('appointmentUpdated', (appointment) => {
      let toastText = 'Appointment updated';
      if (appointment?.status === 'confirmed') {
        const docName = appointment.doctorName ? `Dr. ${appointment.doctorName.replace(/^Dr\.\s*/i, '')}` : 'Doctor';
        toastText = `Your appointment was confirmed by ${docName}`;
      } else if (appointment?.status === 'cancelled') {
        toastText = 'Appointment cancelled';
      } else if (appointment?.status === 'completed') {
        toastText = 'Appointment marked as completed';
      }

      addToast(toastText, appointment?.status === 'cancelled' ? 'warning' : 'success');
      setNotifications((prev) => [
        {
          id: Date.now() + Math.random(),
          title: 'Appointment Update',
          message: toastText,
          time: new Date(),
          read: false,
          appointment,
        },
        ...prev,
      ]);
    });

    // Chat Message Notifications
    newSocket.on('privateMessage', (msg) => {
      const currentSenderId = user?.id || user?._id;
      // If message is from someone else
      if (String(msg.from) !== String(currentSenderId)) {
        // If not currently in this chat conversation
        if (String(activeChatContactRef.current) !== String(msg.from)) {
          const senderName = msg.senderName || 'Someone';
          addToast(`Message from ${senderName}: ${msg.text.length > 35 ? msg.text.substring(0, 35) + '...' : msg.text}`, 'info');
          setUnreadByContact((prev) => ({
            ...prev,
            [msg.from]: (prev[msg.from] || 0) + 1,
          }));
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user?.id]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const totalUnreadMessages = Object.values(unreadByContact).reduce((a, b) => a + b, 0);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsAsRead,
        clearNotifications,
        unreadByContact,
        totalUnreadMessages,
        setActiveChatContact,
        clearUnreadForContact,
        addToast,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-in-out px-4 py-3 rounded-xl shadow-xl flex items-center justify-between text-sm text-white ${
              toast.type === 'success'
                ? 'bg-emerald-600 border border-emerald-500'
                : toast.type === 'warning'
                ? 'bg-amber-600 border border-amber-500'
                : toast.type === 'error'
                ? 'bg-rose-600 border border-rose-500'
                : 'bg-primary-600 border border-primary-500'
            }`}
          >
            <div className="flex items-center space-x-2 mr-3">
              {toast.type === 'success' && (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
