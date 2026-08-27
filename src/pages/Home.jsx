import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import Button from '../components/Button';

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    rating: 4.9,
    experience: 12,
    image: null
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    rating: 4.8,
    experience: 15,
    image: null
  },
  {
    id: 3,
    name: 'Dr. Emily Williams',
    specialization: 'Pediatrician',
    rating: 4.9,
    experience: 8,
    image: null
  },
  {
    id: 4,
    name: 'Dr. James Anderson',
    specialization: 'Orthopedic Surgeon',
    rating: 4.7,
    experience: 20,
    image: null
  },
  {
    id: 5,
    name: 'Dr. Lisa Martinez',
    specialization: 'Dermatologist',
    rating: 4.8,
    experience: 10,
    image: null
  },
  {
    id: 6,
    name: 'Dr. Robert Taylor',
    specialization: 'General Physician',
    rating: 4.6,
    experience: 18,
    image: null
  }
];

const Home = () => {
  const handleViewProfile = (doctor) => {
    console.log('View profile:', doctor);
    // This would navigate to doctor profile in a real app
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-teal-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-scale-in">
              Your Health, Our Priority
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with top healthcare professionals and manage your appointments with ease. 
              Experience quality care at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="text-lg px-8 py-4">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="secondary" className="text-lg px-8 py-4">
                  View Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Doctors</h2>
            <p className="section-subtitle">
              Meet our experienced healthcare professionals dedicated to your well-being
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockDoctors.map((doctor) => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/doctors">
              <Button variant="secondary">
                View All Doctors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-teal-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose MediCare?</h2>
            <p className="section-subtitle">
              We provide comprehensive healthcare solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Book appointments anytime, anywhere with our easy-to-use platform.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Doctors</h3>
              <p className="text-gray-600">All our healthcare professionals are certified and highly experienced.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient-Centered Care</h3>
              <p className="text-gray-600">Your health and comfort are our top priorities in every interaction.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
