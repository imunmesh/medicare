import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'

  const validate = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
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
    
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!values.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(values.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    if (userType === 'doctor' && !values.specialization) {
      errors.specialization = 'Specialization is required for doctors';
    }
    
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, validateForm, resetForm } = useForm(
    { name: '', email: '', password: '', confirmPassword: '', phone: '', specialization: '' },
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate registration - in real app would make API call
      const userData = {
        id: Date.now(),
        name: values.name,
        email: values.email,
        role: userType,
        ...(userType === 'doctor' && { specialization: values.specialization })
      };
      
      login(userData);
      
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
                onClick={() => {
                  setUserType('patient');
                  resetForm();
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
                onClick={() => {
                  setUserType('doctor');
                  resetForm();
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
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Register as a {userType === 'patient' ? 'patient' : 'doctor'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${touched.name && errors.name ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm your password"
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${touched.phone && errors.phone ? 'input-error' : ''}`}
                  placeholder="Enter 10-digit phone number"
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {userType === 'doctor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    value={values.specialization}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${touched.specialization && errors.specialization ? 'input-error' : ''}`}
                  >
                    <option value="">Select specialization</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="General Physician">General Physician</option>
                  </select>
                  {touched.specialization && errors.specialization && (
                    <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
                >
                  Sign In
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

export default Register;
