import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setAuthError('');
    setUserType(account.role);
    setValues({
      email: account.email,
      password: 'password123',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (validateForm()) {
      try {
        setLoading(true);
        const endpoint = userType === 'patient' ? '/auth/patients/login' : '/auth/doctors/login';
        const response = await axiosInstance.post(endpoint, {
          email: values.email.trim(),
          password: values.password,
        });

        const { user, token } = response.data;
        login(user, token);

        // Navigate to appropriate dashboard
        if (userType === 'patient') {
          navigate('/patient-dashboard');
        } else {
          navigate('/doctor-dashboard');
        }
      } catch (err) {
        console.error('Login error:', err);
        const errorMsg =
          err.response?.data?.message ||
          (err.response?.data?.errors && err.response.data.errors[0]?.msg) ||
          'Invalid email or password';
        setAuthError(errorMsg);
      } finally {
        setLoading(false);
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
                type="button"
                onClick={() => {
                  setUserType('patient');
                  setAuthError('');
                }}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  userType === 'patient'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserType('doctor');
                  setAuthError('');
                }}
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

            {authError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm text-center">
                {authError}
              </div>
            )}

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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Quick Demo Logins */}
            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5 text-center">
                Quick Demo Logins (JWT Authenticated)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill({ email: 'sarah@medicare.com', role: 'doctor' })}
                  className="p-2 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-left border border-blue-200 dark:border-blue-800 transition-colors"
                >
                  <span className="font-semibold block">Dr. Sarah Johnson</span>
                  <span className="text-[11px] opacity-80">sarah@medicare.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill({ email: 'michael@medicare.com', role: 'doctor' })}
                  className="p-2 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-left border border-purple-200 dark:border-purple-800 transition-colors"
                >
                  <span className="font-semibold block">Dr. Michael Chen</span>
                  <span className="text-[11px] opacity-80">michael@medicare.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill({ email: 'john@email.com', role: 'patient' })}
                  className="p-2 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-left border border-emerald-200 dark:border-emerald-800 transition-colors sm:col-span-2"
                >
                  <span className="font-semibold block">John Doe (Patient)</span>
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
