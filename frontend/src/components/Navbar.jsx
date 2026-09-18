import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAppointments } from '../context/AppointmentContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { getAppointmentsForPatient, getAppointmentsForDoctor } = useAppointments();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleSwitch = () => {
    if (user?.role === 'patient') {
      login({
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah@medicare.com',
        role: 'doctor',
        specialization: 'Cardiologist',
      });
      navigate('/doctor-dashboard');
    } else {
      login({
        id: 1,
        name: 'John Doe',
        email: 'john@email.com',
        role: 'patient',
      });
      navigate('/patient-dashboard');
    }
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
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">MediCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/doctors" className="nav-link">Doctors</Link>
            
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

                {/* Role switcher for quick testing and live lab demonstration */}
                <button
                  onClick={handleRoleSwitch}
                  className="text-xs px-2.5 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Switch role in-memory without refreshing"
                >
                  Switch to {user.role === 'patient' ? 'Doctor' : 'Patient'}
                </button>

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
                    handleRoleSwitch();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                >
                  Switch to {user.role === 'patient' ? 'Doctor View' : 'Patient View'}
                </button>
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

