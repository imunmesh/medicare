import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  
  const { data: doctors, loading, error } = useFetch('/doctors');

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const filteredDoctors = doctors?.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesAvailability = !showAvailableOnly || doctor.available;
    
    return matchesSearch && matchesAvailability;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 animate-scale-in">
              Your Health, Our Priority
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
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
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Doctors</h2>
            <p className="section-subtitle">
              Meet our experienced healthcare professionals dedicated to your well-being
            </p>
            
            {/* Search Input with Debounce */}
            <div className="max-w-md mx-auto mt-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctors by name or specialization..."
                className="input-field"
              />
            </div>

            {/* Availability Filter */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Show available doctors only
                </span>
              </label>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading doctors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">Error loading doctors: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No doctors found matching your search.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDoctors.map((doctor) => (
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
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-teal-50 to-primary-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose MediCare?</h2>
            <p className="section-subtitle">
              We provide comprehensive healthcare solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">24/7 Availability</h3>
              <p className="text-gray-600 dark:text-gray-400">Book appointments anytime, anywhere with our easy-to-use platform.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Verified Doctors</h3>
              <p className="text-gray-600 dark:text-gray-400">All our healthcare professionals are certified and highly experienced.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Patient-Centered Care</h3>
              <p className="text-gray-600 dark:text-gray-400">Your health and comfort are our top priorities in every interaction.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Doctor Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Doctor Profile"
        footer={
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        }
      >
        {selectedDoctor && (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">
                {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {selectedDoctor.name}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium text-lg mb-4">
              {selectedDoctor.specialization}
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedDoctor.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedDoctor.rating} ⭐</p>
                </div>
              </div>
            </div>

            <Link to="/login">
              <Button className="w-full">Book Appointment</Button>
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
