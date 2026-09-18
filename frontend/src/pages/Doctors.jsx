import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';

const Doctors = () => {
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
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Doctors
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Meet our experienced healthcare professionals dedicated to your well-being
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            
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
            </>
          )}
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

export default Doctors;
