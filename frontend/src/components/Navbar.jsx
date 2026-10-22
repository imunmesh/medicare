import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAppointments } from '../context/AppointmentContext';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { getAppointmentsForPatient, getAppointmentsForDoctor } = useAppointments();
  const {
    isConnected,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    totalUnreadMessages,
  } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  // Compute appointment badge count based on user role
  let badgeCount = 0;
  let badgeTitle = '';
  if (user?.role === 'patient' && user?.id) {
    const patientAppointments = getAppointmentsForPatient(user.id);
    const upcoming = patientAppointments.filter((app) => app.status !== 'cancelled');
    badgeCount = upcoming.length;
    badgeTitle = `${badgeCount} upcoming appointment${badgeCount === 1 ? '' : 's'}`;
  } else if (user?.role === 'doctor' && user?.id) {
    const doctorAppointments = getAppointmentsForDoctor(user.id);
    const pending = doctorAppointments.filter((app) => app.status === 'pending');
    badgeCount = pending.length;
    badgeTitle = `${badgeCount} appointment${badgeCount === 1 ? '' : 's'} pending confirmation`;
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">MediCare</span>
                {user && (
                  <span
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}
                    title={isConnected ? 'Live Socket Connected' : 'Connecting to real-time service...'}
                  />
                )}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/doctors" className="nav-link">Doctors</Link>

            {user && (
              <Link to="/chat" className="nav-link relative inline-flex items-center gap-1.5">
                <span>Chat</span>
                {totalUnreadMessages > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white animate-pulse">
                    {totalUnreadMessages}
                  </span>
                )}
              </Link>
            )}

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    const willShow = !showNotifications;
                    setShowNotifications(willShow);
                    if (willShow && unreadNotificationsCount > 0) {
                      markAllNotificationsAsRead();
                    }
                  }}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    </span>
                  )}
                </button>

                {/* Dropdown panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-slide-down">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Notifications</span>
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          title={isConnected ? 'Real-time connected' : 'Connecting...'}
                        />
                      </div>
                      {notifications.length > 0 && (
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                          {notifications.length} recent
                        </span>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-gray-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{n.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <>
                <Link 
                  to={user.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'} 
                  className="nav-link inline-flex items-center gap-2"
                >
                  <span>Dashboard</span>
                  {badgeCount > 0 && (
                    <span
                      id="navbar-appointment-badge"
                      className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                        user.role === 'doctor'
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-primary-600 text-white'
                      }`}
                      title={badgeTitle}
                    >
                      {badgeCount}
                    </span>
                  )}
                </Link>


                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-2">Login / Register</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-down">
            <Link 
              to="/" 
              className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/doctors" 
              className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Doctors
            </Link>
            {user ? (
              <>
                <Link 
                  to="/chat" 
                  className="flex items-center justify-between px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Chat</span>
                  {totalUnreadMessages > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-white">
                      {totalUnreadMessages}
                    </span>
                  )}
                </Link>
                <Link 
                  to={user.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'} 
                  className="flex items-center justify-between px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Dashboard</span>
                  {badgeCount > 0 && (
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                        user.role === 'doctor'
                          ? 'bg-amber-500 text-white'
                          : 'bg-primary-600 text-white'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-4 py-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
