import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/appointments');
        if (isMounted) {
          setAppointments(response.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch appointments');
          console.error('Error fetching appointments:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  // Add a new appointment: POST to /appointments (Protected)
  const addAppointment = async (newAppointment) => {
    try {
      const response = await axiosInstance.post('/appointments', newAppointment);
      const created = response.data;
      setAppointments((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Error adding appointment:', err);
      throw err;
    }
  };

  // Cancel an appointment: PATCH status to 'cancelled' (Protected)
  const cancelAppointment = async (id) => {
    try {
      await axiosInstance.patch(`/appointments/${id}`, { status: 'cancelled' });
      setAppointments((prev) =>
        prev.map((item) =>
          String(item.id || item._id) === String(id) ? { ...item, status: 'cancelled' } : item
        )
      );
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      throw err;
    }
  };

  // Confirm an appointment: PATCH status to 'confirmed' (Protected)
  const confirmAppointment = async (id) => {
    try {
      await axiosInstance.patch(`/appointments/${id}`, { status: 'confirmed' });
      setAppointments((prev) =>
        prev.map((item) =>
          String(item.id || item._id) === String(id) ? { ...item, status: 'confirmed' } : item
        )
      );
    } catch (err) {
      console.error('Error confirming appointment:', err);
      throw err;
    }
  };

  // Derived helper: filter appointments for a specific patient
  const getAppointmentsForPatient = (patientId) => {
    if (!patientId && patientId !== 0) return [];
    return appointments.filter(
      (item) => String(item.patientId) === String(patientId)
    );
  };

  // Derived helper: filter appointments for a specific doctor
  const getAppointmentsForDoctor = (doctorId) => {
    if (!doctorId && doctorId !== 0) return [];
    return appointments.filter(
      (item) => String(item.doctorId) === String(doctorId)
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        addAppointment,
        cancelAppointment,
        confirmAppointment,
        getAppointmentsForPatient,
        getAppointmentsForDoctor,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

export default AppointmentContext;
