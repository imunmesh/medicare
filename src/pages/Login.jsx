import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';

const PRESET_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@medicare.com', specialization: 'Cardiologist' },
  { id: 2, name: 'Dr. Michael Chen', email: 'michael@medicare.com', specialization: 'Neurologist' },
  { id: 3, name: 'Dr. Emily Williams', email: 'emily@medicare.com', specialization: 'Pediatrician' },
  { id: 4, name: 'Dr. James Anderson', email: 'james@medicare.com', specialization: 'Orthopedic Surgeon' },
  { id: 5, name: 'Dr. Lisa Martinez', email: 'lisa@medicare.com', specialization: 'Dermatologist' },
  { id: 6, name: 'Dr. Robert Taylor', email: 'robert@medicare.com', specialization: 'General Physician' },
];

const PRESET_PATIENTS = [
  { id: 1, name: 'John Doe', email: 'john@email.com' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'

  const validate = (values) => {
    const errors = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } = useForm(
    { email: '', password: '' },
    validate
  );

  const handleQuickFill = (account) => {
    setUserType(account.role);
    setValues({
      email: account.email,
      password: 'password123',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const normalizedEmail = values.email.trim().toLowerCase();
      let matchedUser = null;

      // 1. Check presets first
      if (userType === 'doctor') {
        matchedUser = PRESET_DOCTORS.find(
          (doc) => doc.email.toLowerCase() === normalizedEmail ||
                   normalizedEmail.includes(doc.name.toLowerCase().split(' ')[1])
        );
      } else {
        matchedUser = PRESET_PATIENTS.find(
          (p) => p.email.toLowerCase() === normalizedEmail
        );
      }

      // 2. Check registered users in localStorage
      if (!matchedUser) {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
          matchedUser = storedUsers.find(
            (u) => u.email.toLowerCase() === normalizedEmail && u.role === userType
          );
        } catch (err) {
          console.error('Failed to read medicare_users:', err);
        }
      }

      // 3. If still not found, construct a brand new user with a unique, persistent ID
      if (!matchedUser) {
        const emailName = normalizedEmail.split('@')[0];
        const formattedName = emailName
          .split('.')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        matchedUser = {
          id: Date.now(), // Real, unique numeric ID
          name: formattedName || (userType === 'patient' ? 'New Patient' : 'Dr. Specialist'),
          email: values.email,
          role: userType,
          ...(userType === 'doctor' && { specialization: 'General Physician' }),
        };

        // Persist to localStorage so the same email keeps its unique ID
        try {
          const storedUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
          storedUsers.push(matchedUser);
          localStorage.setItem('medicare_users', JSON.stringify(storedUsers));
        } catch (err) {
          console.error('Failed to save user in medicare_users:', err);
        }
      } else {
        matchedUser = {
          ...matchedUser,
          role: userType,
        };
      }

      login(matchedUser);
      
      // Navigate to appropriate dashboard
      if (userType === 'patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/doctor-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="card-base">
            {/* User Type Toggle */}
            <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setUserType('patient')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  userType === 'patient'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setUserType('doctor')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  userType === 'doctor'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                Doctor
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your {userType === 'patient' ? 'patient' : 'doctor'} account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${touched.email && errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${touched.password && errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            {/* Quick Demo Logins */}
            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 text-center">
                Quick Demo Logins (Unique IDs)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill({ email: 'sarah@medicare.com', role: 'doctor' })}
                  className="p-2 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-left border border-blue-200 dark:border-blue-800 transition-colors"
                >
                  <span className="font-semibold block">Dr. Sarah (ID: 1)</span>
                  <span className="text-[11px] opacity-80">Cardiologist</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill({ email: 'michael@medicare.com', role: 'doctor' })}
                  className="p-2 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-left border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  <span className="font-semibold block">Dr. Michael (ID: 2)</span>
                  <span className="text-[11px] opacity-80">Neurologist</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill({ email: 'john@email.com', role: 'patient' })}
                  className="p-2 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-left border border-emerald-200 dark:border-emerald-800 transition-colors sm:col-span-2"
                >
                  <span className="font-semibold block">John Doe (Patient ID: 1)</span>
                  <span className="text-[11px] opacity-80">john@email.com</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
