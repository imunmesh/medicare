import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';

// Mock data for doctor appointments
const mockAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    patientEmail: 'john@email.com',
    date: '2024-08-27',
    time: '09:00 AM',
    status: 'confirmed',
    reason: 'Regular checkup'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    patientEmail: 'jane@email.com',
    date: '2024-08-27',
    time: '10:30 AM',
    status: 'confirmed',
    reason: 'Follow-up consultation'
  },
  {
    id: 3,
    patientName: 'Michael Johnson',
    patientEmail: 'michael@email.com',
    date: '2024-08-27',
    time: '02:00 PM',
    status: 'pending',
    reason: 'Initial consultation'
  },
  {
    id: 4,
    patientName: 'Sarah Williams',
    patientEmail: 'sarah@email.com',
    date: '2024-08-27',
    time: '03:30 PM',
    status: 'confirmed',
    reason: 'Prescription renewal'
  },
  {
    id: 5,
    patientName: 'David Brown',
    patientEmail: 'david@email.com',
    date: '2024-08-28',
    time: '11:00 AM',
    status: 'pending',
    reason: 'Lab results review'
  }
];

const sortOptions = [
  { value: 'time-asc', label: 'Time (Earliest First)' },
  { value: 'time-desc', label: 'Time (Latest First)' },
  { value: 'status', label: 'Status' }
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [sortBy, setSortBy] = useState('time-asc');
  const [isAvailable, setIsAvailable] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...appointments];
    
    switch (value) {
      case 'time-asc':
        sorted.sort((a, b) => a.time.localeCompare(b.time));
        break;
      case 'time-desc':
        sorted.sort((a, b) => b.time.localeCompare(a.time));
        break;
      case 'status':
        sorted.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        break;
    }
    
    setAppointments(sorted);
  };

  const openCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (appointmentToCancel) {
      setAppointments(appointments.filter(apt => apt.id !== appointmentToCancel.id));
      setCancelModalOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const confirmAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
    ));
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

  const todayAppointments = appointments.filter(apt => apt.date === '2024-08-27');
  const upcomingAppointments = appointments.filter(apt => apt.date !== '2024-08-27');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Profile Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">SJ</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Dr. Sarah Johnson</h3>
                  <p className="text-primary-600 font-medium mb-1">Cardiologist</p>
                  <p className="text-gray-600 mb-4">12 years experience</p>
                  
                  {/* Availability Toggle */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Availability</span>
                      <button
                        onClick={() => setIsAvailable(!isAvailable)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          isAvailable ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            isAvailable ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">Email</span>
                      <span className="text-gray-900 font-medium text-sm">sarah@medicare.com</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">Phone</span>
                      <span className="text-gray-900 font-medium text-sm">+1 234 567 890</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="text-gray-900 font-medium">4.9 ⭐</span>
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">Today's Appointments</h2>
                  <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Dropdown
                    label="Sort by"
                    options={sortOptions}
                    selectedValue={sortBy}
                    onSelect={handleSort}
                    className="max-w-xs"
                  />
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Today ({todayAppointments.length})</h3>
                <div className="space-y-4">
                  {todayAppointments.length === 0 ? (
                    <Card className="text-center py-8">
                      <p className="text-gray-600">No appointments scheduled for today.</p>
                    </Card>
                  ) : (
                    todayAppointments.map((appointment) => (
                      <Card key={appointment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-grow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                {appointment.patientName}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">{appointment.patientEmail}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {appointment.time}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                Reason: {appointment.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          {appointment.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => confirmAppointment(appointment.id)}
                              className="text-sm px-4 py-2"
                            >
                              Confirm
                            </Button>
                          )}
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
              </div>

              {/* Upcoming Appointments */}
              {upcomingAppointments.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming ({upcomingAppointments.length})</h3>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-grow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                {appointment.patientName}
                              </h4>
                              <p className="text-gray-600 text-sm mb-2">{appointment.patientEmail}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                              <p className="text-sm text-gray-500 mt-2">
                                Reason: {appointment.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          {appointment.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => confirmAppointment(appointment.id)}
                              className="text-sm px-4 py-2"
                            >
                              Confirm
                            </Button>
                          )}
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
                    ))}
                  </div>
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
          <p className="text-gray-700 mb-2">
            Are you sure you want to cancel the appointment with
          </p>
          <p className="font-semibold text-gray-900 mb-4">
            {appointmentToCancel?.patientName}?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
