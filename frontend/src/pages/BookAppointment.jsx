import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data: doctors, loading: doctorsLoading, error: doctorsError } = useFetch('/doctors');
  
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const validate = (values) => {
    const errors = {};
    
    if (!values.doctorId) {
      errors.doctorId = 'Please select a doctor';
    }
    
    if (!values.date) {
      errors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(values.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Please select a future date';
      }
    }
    
    if (!values.timeSlot) {
      errors.timeSlot = 'Please select a time slot';
    }
    
    if (!values.reason) {
      errors.reason = 'Please provide a reason for the appointment';
    }
    
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    { 
      doctorId: preselectedDoctorId || '', 
      date: '', 
      timeSlot: '', 
      reason: '' 
    },
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        setSubmitError(null);

        const doctor = doctors?.find((d) => String(d.id || d._id) === String(values.doctorId));
        const newAppointment = {
          patientId: user.id || user._id,
          patientName: user.name,
          patientEmail: user.email,
          doctorId: values.doctorId,
          doctorName: doctor?.name || 'Doctor',
          specialization: doctor?.specialization || 'General Physician',
          date: values.date,
          time: values.timeSlot,
          status: 'pending',
          reason: values.reason,
        };

        await addAppointment(newAppointment);
        navigate('/patient-dashboard');
      } catch (err) {
        setSubmitError(err.message || 'Failed to book appointment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // If user is not logged in: show clear login screen
  if (!user || !user.id) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="card-base max-w-md w-full text-center p-8 shadow-xl">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Please Log In to Book
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              You must be logged in to book an appointment with our specialists.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/login')} className="w-full">
                Log In as Patient
              </Button>
              <Button variant="secondary" onClick={() => navigate('/doctors')} className="w-full">
                Browse Doctors
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (doctorsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (doctorsError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Error loading doctors: {doctorsError}</p>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-base">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Book Appointment
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Schedule your appointment with a healthcare professional
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Doctor
                </label>
                <select
                  name="doctorId"
                  value={values.doctorId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${touched.doctorId && errors.doctorId ? 'input-error' : ''}`}
                >
                  <option value="">Choose a doctor</option>
                  {doctors?.map((doctor) => (
                    <option key={doctor.id || doctor._id} value={doctor.id || doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                {touched.doctorId && errors.doctorId && (
                  <p className="text-red-500 text-sm mt-1">{errors.doctorId}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={new Date().toISOString().split('T')[0]}
                    className={`input-field ${touched.date && errors.date ? 'input-error' : ''}`}
                  />
                  {touched.date && errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    value={values.timeSlot}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${touched.timeSlot && errors.timeSlot ? 'input-error' : ''}`}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {touched.timeSlot && errors.timeSlot && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={`input-field ${touched.reason && errors.reason ? 'input-error' : ''}`}
                  placeholder="Please describe the reason for your appointment"
                />
                {touched.reason && errors.reason && (
                  <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
                )}
              </div>

              {submitError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Booking...' : 'Book Appointment'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/patient-dashboard')}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
