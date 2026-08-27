import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../api/axiosInstance';

const sortOptions = [
  { value: 'date-asc', label: 'Date (Earliest First)' },
  { value: 'date-desc', label: 'Date (Latest First)' },
  { value: 'status', label: 'Status' }
];

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: appointments, loading, error, refetch } = useFetch('/appointments');
  const [sortBy, setSortBy] = useState('date-asc');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSort = (value) => {
    setSortBy(value);
  };

  const openCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (appointmentToCancel) {
      try {
        await axiosInstance.patch(`/appointments/${appointmentToCancel.id}`, { 
          status: 'cancelled' 
        });
        setMessage({ type: 'success', text: 'Appointment cancelled successfully' });
        refetch();
        setCancelModalOpen(false);
        setAppointmentToCancel(null);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to cancel appointment. Please try again.' });
        console.error('Cancel error:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort appointments based on selected option
  const sortedAppointments = appointments ? [...appointments].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Profile Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{user?.name || 'John Doe'}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Patient</p>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 dark:text-gray-400">Email</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{user?.email || 'john@email.com'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Visits</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{sortedAppointments.length}</span>
                    </div>
                  </div>

                  <Button 
                    variant="secondary" 
                    className="w-full mt-6"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content - Appointments */}
            <div className="lg:col-span-3">
              {/* Success/Error Message */}
              {message.text && (
                <div className={`mb-4 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Appointments</h2>
                  <p className="text-gray-600 dark:text-gray-400">Manage your upcoming appointments</p>
                </div>
                <Button onClick={() => navigate('/book-appointment')}>
                  Book New Appointment
                </Button>
              </div>

              <div className="mb-6">
                <Dropdown
                  label="Sort by"
                  options={sortOptions}
                  selectedValue={sortBy}
                  onSelect={handleSort}
                  className="max-w-xs"
                />
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading appointments...</p>
                </div>
              ) : error ? (
                <Card className="text-center py-12">
                  <p className="text-red-500 text-lg mb-4">Error loading appointments: {error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sortedAppointments.length === 0 ? (
                    <Card className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Appointments</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any scheduled appointments.</p>
                      <Button onClick={() => navigate('/book-appointment')}>
                        Book Your First Appointment
                      </Button>
                    </Card>
                  ) : (
                    sortedAppointments.map((appointment) => (
                      <Card key={appointment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-grow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {appointment.doctorName}
                              </h4>
                              <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                                {appointment.specialization || 'Doctor'}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(appointment.date).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {appointment.time}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                Reason: {appointment.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => openCancelModal(appointment)}
                            className="text-sm px-4 py-2"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setCancelModalOpen(false)}
            >
              Keep Appointment
            </Button>
            <Button 
              onClick={confirmCancel}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Cancel Appointment
            </Button>
          </>
        }
      >
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Are you sure you want to cancel your appointment with
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {appointmentToCancel?.doctorName}?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDashboard;
