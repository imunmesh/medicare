import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Button from './Button';
import Card from './Card';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // If there is no user or token in AuthContext -> redirect to /login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If user.role is not in allowedRoles -> show Access Denied page with dashboard button
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    const userDashboard = user.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard';
    
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8 shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              You do not have permission to access this page. You are currently logged in as a{' '}
              <span className="font-semibold capitalize text-primary-600 dark:text-primary-400">
                {user.role}
              </span>
              .
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate(userDashboard)} className="w-full">
                Go to Your Dashboard
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')} className="w-full">
                Back to Home
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
