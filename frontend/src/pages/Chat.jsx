import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axiosInstance from '../api/axiosInstance';

const Chat = () => {
  const { user } = useAuth();
  const {
    socket,
    isConnected,
    unreadByContact,
    setActiveChatContact,
    clearUnreadForContact,
  } = useSocket();

  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist selected contact across page refreshes
  const [selectedContact, setSelectedContact] = useState(() => {
    try {
      const stored = localStorage.getItem('activeChatContact');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const messagesEndRef = useRef(null);
  const currentUserId = user?.id || user?._id;

  // Auto-scroll to bottom of chat
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Fetch contacts on mount and reconcile with persisted contact
  useEffect(() => {
    let isMounted = true;

    const fetchContacts = async () => {
      try {
        setContactsLoading(true);
        const res = await axiosInstance.get('/chat/contacts');
        const list = res.data || [];
        if (!isMounted) return;

        setContacts(list);

        // Check if there was an active contact or URL param
        const params = new URLSearchParams(window.location.search);
        const urlContactId = params.get('user');

        const stored = localStorage.getItem('activeChatContact');
        let targetId = urlContactId;
        if (!targetId && stored) {
          try {
            targetId = JSON.parse(stored)?._id;
          } catch {}
        }

        if (targetId) {
          const match = list.find((c) => String(c._id) === String(targetId));
          if (match && isMounted) {
            setSelectedContact(match);
            localStorage.setItem('activeChatContact', JSON.stringify(match));
          }
        }
      } catch (err) {
        console.error('Failed to load chat contacts:', err);
      } finally {
        if (isMounted) setContactsLoading(false);
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Set active chat contact in SocketContext when selected contact changes
  useEffect(() => {
    if (selectedContact?._id) {
      setActiveChatContact(selectedContact._id);
      clearUnreadForContact(selectedContact._id);
    } else {
      setActiveChatContact(null);
    }

    return () => {
      setActiveChatContact(null);
    };
  }, [selectedContact?._id]);

  // Load message history when selected contact changes
  useEffect(() => {
    if (!selectedContact?._id) {
      setMessages([]);
      return;
    }

    let isMounted = true;

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);
        setErrorMessage('');
        const res = await axiosInstance.get(`/chat/${selectedContact._id}`);
        if (isMounted) {
          setMessages(res.data || []);
          setTimeout(() => scrollToBottom('auto'), 50);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load chat messages:', err);
          setErrorMessage('Failed to load conversation history.');
        }
      } finally {
        if (isMounted) {
          setMessagesLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedContact?._id]);

  // Listen for live incoming private messages
  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (msg) => {
      if (!selectedContact) return;

      const contactId = String(selectedContact._id);
      const myId = String(currentUserId);
      const msgFrom = String(msg.from?._id || msg.from);
      const msgTo = String(msg.to?._id || msg.to);

      const isForCurrentChat =
        (msgFrom === contactId && msgTo === myId) ||
        (msgFrom === myId && msgTo === contactId);

      if (isForCurrentChat) {
        setMessages((prev) => {
          // Avoid duplicate message if already added
          if (prev.some((m) => m._id && msg._id && String(m._id) === String(msg._id))) {
            return prev;
          }
          return [...prev, msg];
        });
        setTimeout(() => scrollToBottom('smooth'), 50);
      }
    };

    socket.on('privateMessage', handlePrivateMessage);

    return () => {
      socket.off('privateMessage', handlePrivateMessage);
    };
  }, [socket, selectedContact?._id, currentUserId]);

  // Handle contact selection and persistence
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    if (contact) {
      localStorage.setItem('activeChatContact', JSON.stringify(contact));
    } else {
      localStorage.removeItem('activeChatContact');
    }
  };

  // Handle sending private message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();

    const trimmed = inputText.trim();
    if (!trimmed || !selectedContact || !socket) return;

    // Client-side rule check: patient cannot message another patient
    if (user?.role === 'patient' && selectedContact?.role === 'patient') {
      setErrorMessage('Patient-to-patient direct chat is restricted. You can communicate with doctors.');
      return;
    }

    socket.emit('privateMessage', {
      to: selectedContact._id,
      text: trimmed,
    });

    setInputText('');
    setErrorMessage('');
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter((c) => {
    const query = searchQuery.toLowerCase();
    const nameMatches = c.name?.toLowerCase().includes(query);
    const roleMatches = c.role?.toLowerCase().includes(query);
    const specMatches = c.specialization?.toLowerCase().includes(query);
    return nameMatches || roleMatches || specMatches;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Page Title & Connection Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>💬 Real-Time Messaging</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Secure private communication between healthcare providers and patients.
            </p>
          </div>

          <div className="mt-2 sm:mt-0 flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {isConnected ? 'Socket Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Chat Main Container */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row h-[650px]">
          {/* Left Pane: Contacts List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-800/50">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-100"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Contacts Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/60">
              {contactsLoading ? (
                <div className="p-8 text-center text-sm text-gray-400">Loading contacts...</div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No contacts found</div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = selectedContact?._id === contact._id;
                  const unreadCount = unreadByContact[contact._id] || 0;
                  const isPatientToPatient =
                    user?.role === 'patient' && contact?.role === 'patient';

                  return (
                    <button
                      key={contact._id}
                      onClick={() => handleSelectContact(contact)}
                      className={`w-full text-left p-3.5 transition-colors flex items-center justify-between group ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600'
                          : 'hover:bg-gray-100/70 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${
                            contact.role === 'doctor'
                              ? 'bg-emerald-600'
                              : 'bg-indigo-600'
                          }`}
                        >
                          {contact.name ? contact.name.charAt(0).toUpperCase() : 'U'}
                        </div>

                        {/* Name and Meta */}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {contact.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                                contact.role === 'doctor'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                              }`}
                            >
                              {contact.role}
                            </span>
                            {contact.specialization && (
                              <span className="text-xs text-gray-400 truncate">
                                • {contact.specialization}
                              </span>
                            )}
                          </div>
                          {isPatientToPatient && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">
                              Restricted
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unread Badge */}
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 shadow-sm animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Conversation Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {selectedContact ? (
              <>
                {/* Active Chat Header */}
                <div className="px-6 py-3.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 z-10">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                        selectedContact.role === 'doctor' ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}
                    >
                      {selectedContact.name ? selectedContact.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {selectedContact.name}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            selectedContact.role === 'doctor'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                          }`}
                        >
                          {selectedContact.role}
                        </span>
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedContact.specialization || (selectedContact.role === 'doctor' ? 'Healthcare Provider' : 'Patient')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-6 overflow-y-auto space-y-3.5 bg-gray-50/30 dark:bg-gray-900/30">
                  {messagesLoading && messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-gray-400">
                      Loading conversation...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6">
                      <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-gray-700 flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">No messages yet with {selectedContact.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Send a message below to begin consultation.</p>
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const senderId = String(m.from?._id || m.from || '');
                      const currentUserIdStr = String(user?.id || user?._id || '');
                      const isMe = Boolean(currentUserIdStr && senderId === currentUserIdStr);
                      const timeStr = m.createdAt
                        ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '';

                      return (
                        <div
                          key={m._id || idx}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm break-words ${
                              isMe
                                ? 'bg-primary-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-bl-none'
                            }`}
                          >
                            {!isMe && (
                              <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 mb-0.5">
                                {m.senderName || selectedContact.name}
                              </p>
                            )}
                            <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                            <span
                              className={`text-[10px] block text-right mt-1 ${
                                isMe ? 'text-primary-100' : 'text-gray-400 dark:text-gray-400'
                              }`}
                            >
                              {timeStr}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="px-6 py-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs border-t border-rose-200 dark:border-rose-800">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center space-x-3"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${selectedContact.name}... (Press Enter to send)`}
                    disabled={!isConnected || (user?.role === 'patient' && selectedContact?.role === 'patient')}
                    maxLength={1000}
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={
                      !inputText.trim() ||
                      !isConnected ||
                      (user?.role === 'patient' && selectedContact?.role === 'patient')
                    }
                    className="btn-primary px-5 py-2.5 text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                  >
                    <span>Send</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              /* Empty Selection State */
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                  Select a contact to start messaging
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Choose a doctor or patient from the left panel to review past conversations or send real-time instant messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
