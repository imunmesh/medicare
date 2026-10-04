// ============================================
// useEffect HOOK - Complete Examples
// ============================================

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

// ============================================
// EXAMPLE 1: Run After Every Render
// ============================================
function Example1_RunEveryRender() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component rendered or updated');
    console.log('Current count:', count);
  }); // No dependency array = runs after every render

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Run Once on Mount (Component Did Mount)
// ============================================
function Example2_RunOnce() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Component mounted');
    setMessage('Welcome to Medicare System!');
    
    // This only runs once when component mounts
  }, []); // Empty dependency array = runs only once

  return <div>{message}</div>;
}

// ============================================
// EXAMPLE 3: Fetch Data on Mount
// ============================================
function Example3_FetchDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); // Empty array = fetch only once on mount

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Doctors List</h2>
      {doctors.map(doctor => (
        <div key={doctor.id}>
          {doctor.name} - {doctor.specialization}
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 4: Run When Specific Value Changes
// ============================================
function Example4_SearchDoctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log('Searching for:', searchTerm);
    
    if (searchTerm) {
      // API call would go here
      console.log('Making API call for:', searchTerm);
    }
  }, [searchTerm]); // Runs when searchTerm changes

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search doctors..."
      />
      <div>Results: {results.length}</div>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Multiple Dependencies
// ============================================
function Example5_FilterAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('');

  useEffect(() => {
    console.log('Fetching appointments with filters');
    console.log('Status:', status, 'Date:', date);
    
    // Fetch filtered appointments
    const fetchFilteredAppointments = async () => {
      const response = await axiosInstance.get('/appointments', {
        params: { status, date }
      });
      setAppointments(response.data);
    };

    fetchFilteredAppointments();
  }, [status, date]); // Runs when status OR date changes

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <div>Appointments: {appointments.length}</div>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Cleanup Function (Event Listeners)
// ============================================
function Example6_WindowResize() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      console.log('Window resized:', window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup function - removes event listener
    return () => {
      console.log('Cleaning up resize listener');
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array = add listener once, remove on unmount

  return (
    <div>
      <p>Window Width: {windowWidth}px</p>
      {windowWidth < 768 ? <p>Mobile View</p> : <p>Desktop View</p>}
    </div>
  );
}

// ============================================
// EXAMPLE 7: Cleanup with Timer
// ============================================
function Example7_AutoRefresh() {
  const [appointments, setAppointments] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await axiosInstance.get('/appointments');
      setAppointments(response.data);
      setLastUpdated(new Date());
    };

    // Fetch immediately
    fetchAppointments();

    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchAppointments, 30000);

    // Cleanup: Clear interval when component unmounts
    return () => {
      console.log('Clearing interval');
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <p>Last Updated: {lastUpdated.toLocaleTimeString()}</p>
      <p>Appointments: {appointments.length}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 8: Prevent Memory Leaks with Cleanup Flag
// ============================================
function Example8_PreventMemoryLeak() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/doctors');
        
        // Only update state if component is still mounted
        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error:', error);
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: Set flag to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>Data loaded: {data?.length} items</div>;
}

// ============================================
// EXAMPLE 9: Document Title Update
// ============================================
function Example9_UpdateTitle() {
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Update document title when notifications change
    if (notifications > 0) {
      document.title = `(${notifications}) Medicare - New Notifications`;
    } else {
      document.title = 'Medicare - Appointment System';
    }

    // Cleanup: Reset title when component unmounts
    return () => {
      document.title = 'Medicare - Appointment System';
    };
  }, [notifications]);

  return (
    <div>
      <p>Notifications: {notifications}</p>
      <button onClick={() => setNotifications(notifications + 1)}>
        Add Notification
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 10: Theme Application (from ThemeContext)
// ============================================
function Example10_ApplyTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]); // Runs when theme changes

  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

// ============================================
// EXAMPLE 11: Focus Input on Mount
// ============================================
function Example11_FocusInput() {
  const [inputRef, setInputRef] = useState(null);

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef) {
      inputRef.focus();
    }
  }, [inputRef]);

  return (
    <div>
      <label>Patient Name:</label>
      <input
        ref={setInputRef}
        type="text"
        placeholder="Enter your name"
      />
    </div>
  );
}

// ============================================
// EXAMPLE 12: Lock Body Scroll (from Modal)
// ============================================
function Example12_ModalWithScrollLock({ isOpen }) {
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup: Restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Modal Content</h2>
        <p>Body scroll is locked</p>
      </div>
    </div>
  );
}

// ============================================
// EXPORT ALL EXAMPLES
// ============================================
export {
  Example1_RunEveryRender,
  Example2_RunOnce,
  Example3_FetchDoctors,
  Example4_SearchDoctors,
  Example5_FilterAppointments,
  Example6_WindowResize,
  Example7_AutoRefresh,
  Example8_PreventMemoryLeak,
  Example9_UpdateTitle,
  Example10_ApplyTheme,
  Example11_FocusInput,
  Example12_ModalWithScrollLock,
};
