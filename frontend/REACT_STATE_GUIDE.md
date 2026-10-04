# CH-3: Advanced React & State Management

## Complete Implementation Guide for Medicare System

This guide covers all advanced React concepts from Chapter 3 with working code examples from your Medicare appointment booking system.

---

## Table of Contents
1. [React Hooks](#react-hooks)
2. [Global State Management](#global-state-management)
3. [Form Handling](#form-handling)
4. [Async Data Fetching](#async-data-fetching)
5. [API Integration](#api-integration)
6. [Frontend Authentication](#frontend-authentication)
7. [Protected Routes](#protected-routes)

---

## React Hooks

### What are React Hooks?

<cite index="1-2">React Hooks are functions that allow you to "hook into" React features like state and lifecycle methods from functional components.</cite>

### 1. useEffect - Side Effects in Functional Components

<cite index="1-3">Purpose: Perform side effects like data fetching, DOM updates, subscriptions, etc.</cite>

**Basic Syntax:**
```javascript
useEffect(() => {
  // Side effect code here
  
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
```

**Your Real Examples from Medicare System:**

#### Example 1: Run After Every Render (No Dependencies)
```javascript
useEffect(() => {
  console.log('Component rendered or updated');
});
```

#### Example 2: Run Once on Mount (Empty Dependencies)
```javascript
// From ThemeContext.jsx
useEffect(() => {
  // Apply theme to document
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}, [isDark]); // Only runs when isDark changes
```

#### Example 3: With Dependencies (Runs When Dependencies Change)
```javascript
// From AppointmentContext.jsx
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

  // Cleanup function to prevent memory leaks
  return () => {
    isMounted = false;
  };
}, []); // Empty array means run only once on mount
```

#### Example 4: With Cleanup (Event Listeners, Timers)
```javascript
// Example: Window resize listener
useEffect(() => {
  const handleResize = () => {
    console.log('Window resized:', window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  // Cleanup: Remove event listener when component unmounts
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

---

### 2. useContext - Access React Context

<cite index="1-4">Purpose: Consume context values without prop drilling (passing data from a parent component to deeply nested child components via props, even if intermediate components don't need that data — they just forward it).</cite>

**How it Works:**

1. **Create Context**
2. **Provide Context** (Wrap your app with Provider)
3. **Consume Context** (Use `useContext` hook)

**Your Real Example: ThemeContext**

```javascript
// 1. Create Context (ThemeContext.jsx)
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// 2. Provide Context
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom hook to consume context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

**Using the Theme Context:**

```javascript
// In any component
import { useTheme } from '../context/ThemeContext';

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

**Your Real Example: AuthContext**

```javascript
// AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error('Error reading user from localStorage:', err);
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Using AuthContext:**

```javascript
import { useAuth } from '../context/AuthContext';

function ProfileComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h2>Welcome, {user?.name}!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

### 3. Custom Hooks - Reuse Logic

<cite index="1-6,1-7">Custom Hooks are JavaScript functions that start with use and can call other Hooks (like useState, useEffect, useContext). Purpose: Share logic between components using custom functions that use hooks.</cite>

**Your Real Examples from Medicare System:**

#### Custom Hook 1: useFetch (Data Fetching)

```javascript
// hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
```

**Usage:**

```javascript
import useFetch from '../hooks/useFetch';

function DoctorsList() {
  const { data: doctors, loading, error, refetch } = useFetch('/doctors');

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {doctors?.map(doctor => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
}
```

#### Custom Hook 2: useForm (Form Handling)

```javascript
// hooks/useForm.js
import { useState } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    
    // Validate on blur
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    setValues,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  };
};

export default useForm;
```

**Usage:**

```javascript
import useForm from '../hooks/useForm';

function LoginForm() {
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

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    { email: '', password: '' },
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <p>{errors.email}</p>}
      
      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.password && errors.password && <p>{errors.password}</p>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

#### Custom Hook 3: useDebounce (Optimize API Calls)

```javascript
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Cancel the timeout if value changes before delay completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
```

**Usage (Search Input):**

```javascript
import { useState } from 'react';
import useDebounce from '../hooks/useDebounce';

function SearchDoctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // API call only happens 500ms after user stops typing
      console.log('Searching for:', debouncedSearch);
      // fetchDoctors(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      placeholder="Search doctors..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

#### Custom Hook 4: useWindowSize

```javascript
// Example custom hook (from document)
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

---

## Global State Management

<cite index="1-8,1-9">Global state - When you need to share this data across different components, it can become challenging to pass it down as props through multiple layers. This is where global state management comes into play — it allows you to centralize and share state more easily across your entire app.</cite>

### Context API vs Redux

<cite index="1-12,1-13,1-14">Redux - external library for managing state in JavaScript applications, often used with React. It is more advanced and structured than Context API, making it ideal for larger applications with more complex state requirements. A centralized brain for your app's data — where all state (like user info, cart contents, or app settings) is stored in one place and updated in a predictable way.</cite>

**Your Medicare System Uses Context API**

### Context API Architecture

**Your AppointmentContext (Complete Example):**

```javascript
// context/AppointmentContext.jsx
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

  // Add a new appointment
  const addAppointment = async (newAppointment) => {
    try {
      const response = await axiosInstance.post('/appointments', newAppointment);
      const created = response.data;
      setAppointments((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.error('Error adding appointment:', err);
      throw err;
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (id) => {
    try {
      await axiosInstance.patch(`/appointments/${id}`, { status: 'cancelled' });
      setAppointments((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) ? { ...item, status: 'cancelled' } : item
        )
      );
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      throw err;
    }
  };

  // Confirm an appointment
  const confirmAppointment = async (id) => {
    try {
      await axiosInstance.patch(`/appointments/${id}`, { status: 'confirmed' });
      setAppointments((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) ? { ...item, status: 'confirmed' } : item
        )
      );
    } catch (err) {
      console.error('Error confirming appointment:', err);
      throw err;
    }
  };

  // Helper: filter appointments for a specific patient
  const getAppointmentsForPatient = (patientId) => {
    if (!patientId && patientId !== 0) return [];
    return appointments.filter(
      (item) => String(item.patientId) === String(patientId)
    );
  };

  // Helper: filter appointments for a specific doctor
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
```

**Using AppointmentContext:**

```javascript
import { useAppointments } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';

function PatientAppointments() {
  const { user } = useAuth();
  const { 
    appointments, 
    loading, 
    error, 
    cancelAppointment,
    getAppointmentsForPatient 
  } = useAppointments();

  const myAppointments = getAppointmentsForPatient(user?.id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Appointments</h2>
      {myAppointments.map(appointment => (
        <div key={appointment.id}>
          <p>Doctor: {appointment.doctorName}</p>
          <p>Date: {appointment.date}</p>
          <p>Status: {appointment.status}</p>
          <button onClick={() => cancelAppointment(appointment.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Redux Concepts (For Reference)

<cite index="1-17,1-18,1-19,1-20">Key Concepts in Redux: Store - The single source of truth that holds your global state. Actions - Plain JavaScript objects that describe what should change in the state. Reducers - Pure functions that take the current state and an action, and return the new state. Dispatch - A method used to send an action to the store to trigger a state update.</cite>

**Redux Example (Not used in your project, but for learning):**

```javascript
// Redux Store Setup
import { createStore } from 'redux';

// 1. Actions
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// 2. Reducer
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// 3. Store
const store = createStore(counterReducer);

// 4. Dispatch
store.dispatch(increment()); // count: 1
store.dispatch(increment()); // count: 2
store.dispatch(decrement()); // count: 1

// Get current state
console.log(store.getState()); // { count: 1 }
```

### Context API vs Redux Comparison

| Feature | Context API | Redux |
|---------|-------------|-------|
| **Setup** | <cite index="1-32">Built-in: No need to install any external libraries; it's part of React.</cite> | Requires external library installation |
| **Complexity** | <cite index="1-33">Simple: Great for small-to-medium applications</cite> | <cite index="1-24,1-25">Boilerplate: Redux introduces additional boilerplate code. Complexity: For small applications, Redux can feel like overkill</cite> |
| **Performance** | <cite index="1-36">Re-rendering: Every time the state in the context changes, all components that consume that state are re-rendered</cite> | Optimized with selectors and memoization |
| **DevTools** | <cite index="1-37">Limited debugging tools</cite> | <cite index="1-22">Redux DevTools provide an excellent way to inspect and debug state changes</cite> |
| **Use Case** | Your Medicare System (small-medium app) | Large applications with complex state |

---

## Form Handling

<cite index="1-38,1-39,1-40,1-41">Form handling means capturing user input (like text, selections, checkboxes, etc.) and responding to it — like saving it, validating it, or submitting it to a server. React Forms are components used to collect and manage user inputs. These include: Multiple inputs (name, email, etc), Validation (like checking if fields are empty), File upload or dropdowns.</cite>

**Your Complete Login Form Example:**

```javascript
// pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient');

  // Validation function
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

  // Use custom form hook
  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    { email: '', password: '' },
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate login
      const userData = {
        id: Date.now(),
        email: values.email,
        role: userType,
      };
      
      login(userData);
      navigate(userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Type Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUserType('patient')}
            className={userType === 'patient' ? 'active' : ''}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setUserType('doctor')}
            className={userType === 'doctor' ? 'active' : ''}
          >
            Doctor
          </button>
        </div>

        {/* Email Field */}
        <div>
          <label>Email Address</label>
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

        {/* Password Field */}
        <div>
          <label>Password</label>
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

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
};
```

### Form with Multiple Fields (Register Example)

```javascript
// Simplified Register Form
const validate = (values) => {
  const errors = {};
  
  if (!values.name) errors.name = 'Name is required';
  if (!values.email) errors.email = 'Email is required';
  if (!values.password) errors.password = 'Password is required';
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  if (!values.phone || !/^\d{10}$/.test(values.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }
  
  return errors;
};

const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm(
  { 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    phone: '',
    specialization: '' 
  },
  validate
);
```

---

## Async Data Fetching

<cite index="1-42">Async data fetching is used to get data from an API (usually REST or GraphQL) and display it in your UI.</cite>

### 1. Axios - HTTP Client

<cite index="1-44,1-45,1-46">Axios – A Promise-based HTTP client for node.js and the browser. It simplifies the process of sending asynchronous requests to servers and handling responses. Axios is known for its ease of use, support for promises and async/await, and features like interceptors for request and response handling. Use Axios if you want full control over requests.</cite>

**Your Axios Configuration:**

```javascript
// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle global errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error logging
    if (error.response) {
      console.error('API Error:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

**HTTP Methods with Axios:**

```javascript
import axiosInstance from './api/axiosInstance';

// GET - Fetch data
const fetchDoctors = async () => {
  try {
    const response = await axiosInstance.get('/doctors');
    console.log('Doctors:', response.data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
};

// POST - Create new data
const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post('/appointments', appointmentData);
    console.log('Created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// PUT - Update entire resource
const updateDoctor = async (id, doctorData) => {
  try {
    const response = await axiosInstance.put(`/doctors/${id}`, doctorData);
    console.log('Updated:', response.data);
  } catch (error) {
    console.error('Error updating doctor:', error);
  }
};

// PATCH - Update partial data
const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/appointments/${id}`, { status });
    console.log('Status updated:', response.data);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

// DELETE - Remove data
const deleteAppointment = async (id) => {
  try {
    await axiosInstance.delete(`/appointments/${id}`);
    console.log('Deleted appointment:', id);
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
};
```

### 2. SWR - Stale While Revalidate

<cite index="1-49,1-50,1-51">SWR (Stale While Revalidate) - A modern React hook library for data fetching. It is a caching strategy that allows a web browser to provide a way for a client to use a stale (expired) version of a resource while simultaneously revalidating it with the origin server in the background. This is particularly useful for improving the performance and responsiveness of web applications. When a client makes a request for a resource and the server responds with a `stale-while-revalidate` directive, it means that the client can use the cached (stale) version of the resource even if it has technically expired.</cite>

**SWR Example (Not in your project, but for learning):**

```javascript
// Installation: npm install swr

import useSWR from 'swr';
import axiosInstance from './api/axiosInstance';

// Fetcher function
const fetcher = (url) => axiosInstance.get(url).then(res => res.data);

function DoctorsList() {
  // SWR automatically caches and revalidates data
  const { data, error, isLoading, mutate } = useSWR('/doctors', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => mutate()}>Refresh</button>
      {data.map(doctor => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
}
```

**SWR Features:**
- Automatic caching
- Automatic revalidation
- Focus revalidation (refetch when window regains focus)
- Interval polling
- Optimistic UI updates

<cite index="1-54,1-55">Cache-Control: max-age=3600, stale-while-revalidate=86400. max-age=3600: The resource is considered fresh for 3600 seconds (1 hour). stale-while-revalidate=86400: If the resource is stale (expired), the client is allowed to use it for up to 86400 seconds (24 hours) while simultaneously revalidating it with the server.</cite>

---

## API Integration

<cite index="1-56,1-57,1-58">API integration - Application Programming Interface, is a set of protocols through which applications communicate with each other. With API, your application or service can use the functions provided by another application without needing to know how that other application is implemented. APIs can also serve as an intermediary layer for data transfers between system applications, allowing businesses to open their application data and functionality to third-party developers, business partners, as well as internal departments.</cite>

<cite index="1-60,1-61">API Integration means connecting your frontend (React app) to a backend API to send or receive data. You usually: Fetch data with GET, Send data with POST, Update data with PUT/PATCH, Delete data with DELETE.</cite>

**Complete Real-World Example from Your Project:**

```javascript
// Using API in a Component
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
```

**Best Practices from Your Project:**

1. **Use try/catch with async/await** - Easier error handling
2. **Use .env file for API keys** - Keep secrets safe
3. **Use Axios interceptors** - Add tokens or global error handling
4. **Handle loading & error states** - Prevents poor user experience
5. **Debounce user input (search)** - Reduces API calls
6. **Use libraries (SWR/React Query)** - For caching, revalidation, simplicity

---

## Frontend Authentication

<cite index="1-63">Frontend authentication is the process of verifying a user's identity directly within the user interface of an application, before sending requests to the backend.</cite>

### Key Aspects

<cite index="1-65,1-66,1-67">User Interface Logic: Frontend authentication involves handling the login form, validating user input (like username and password), and managing the user's session state within the browser. Cookies and Local Storage: Cookies are commonly used to store session data (e.g., user ID, session token) on the client's machine. Alternatively, local storage can be used to store similar data, though it is generally less secure than cookies for sensitive data.</cite>

**Your Complete Authentication System:**

### 1. AuthContext (Authentication State Management)

```javascript
// context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error('Error reading user from localStorage:', err);
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Wrap Your App with AuthProvider

```javascript
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppointmentProvider } from './context/AppointmentContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppointmentProvider>
          <App />
        </AppointmentProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

### 3. Using Authentication in Components

```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name}!</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </nav>
  );
}
```

### Security Considerations

<cite index="1-77,1-78,1-79,1-80">Security Considerations: Never store sensitive data (like passwords) directly in cookies or local storage on the frontend. Use secure (HTTPS) connections to protect data in transit. Implement proper authorization on the backend to control access to resources. Consider using a backend for frontend (BFF) pattern to enhance security and optimize performance.</cite>

---

## Protected Routes

<cite index="1-81,1-82,1-83">Protected Routes are pages in a web application that only logged-in users can access. They help keep private information safe by checking if the user is authenticated (logged in) before showing the page. These are used to ensure only logged-in users can view or interact with certain parts of an app (like dashboards, profile pages, admin panels, etc.).</cite>

### Why Use Protected Routes?

<cite index="1-85,1-86,1-87">Security: Prevent unauthorized access to sensitive pages. User flow control: Guide users to login/signup if they aren't authenticated. Authorization: Sometimes, even logged-in users may not have permission to access certain areas (role-based).</cite>

### Creating a Protected Route Component

```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (optional)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
```

### Using Protected Routes in Your App

```javascript
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Patients Only */}
        <Route 
          path="/patient-dashboard" 
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Routes - Doctors Only */}
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
```

### Advanced Protected Route with Loading State

```javascript
// components/ProtectedRoute.jsx (Enhanced)
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to view this page.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 btn-primary"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return children;
};
```

### Redirecting to Original Location After Login

```javascript
// pages/Login.jsx (with redirect)
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform login
    const userData = { /* ... */ };
    login(userData);
    
    // Redirect to original location or dashboard
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

---

## Complete Real-World Example: Booking Appointment Flow

Here's how everything comes together in your Medicare system:

```javascript
// pages/BookAppointment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';

function BookAppointment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();
  const { data: doctors, loading } = useFetch('/doctors');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form validation
  const validate = (values) => {
    const errors = {};
    if (!values.doctorId) errors.doctorId = 'Please select a doctor';
    if (!values.date) errors.date = 'Please select a date';
    if (!values.time) errors.time = 'Please select a time';
    if (!values.reason) errors.reason = 'Please provide a reason';
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    { doctorId: '', date: '', time: '', reason: '' },
    validate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const selectedDoctor = doctors.find(d => d.id === parseInt(values.doctorId));
        
        const appointmentData = {
          patientId: user.id,
          patientName: user.name,
          doctorId: values.doctorId,
          doctorName: selectedDoctor.name,
          date: values.date,
          time: values.time,
          reason: values.reason,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        await addAppointment(appointmentData);
        setShowConfirmModal(true);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/patient-dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading doctors...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor Selection */}
        <Dropdown
          label="Select Doctor"
          options={doctors?.map(doctor => ({
            value: doctor.id,
            label: `${doctor.name} - ${doctor.specialization}`
          }))}
          selectedValue={values.doctorId}
          onSelect={(value) => handleChange({ target: { name: 'doctorId', value } })}
        />
        {touched.doctorId && errors.doctorId && (
          <p className="text-red-500 text-sm">{errors.doctorId}</p>
        )}

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            min={new Date().toISOString().split('T')[0]}
            className="input-field"
          />
          {touched.date && errors.date && (
            <p className="text-red-500 text-sm">{errors.date}</p>
          )}
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <select
            name="time"
            value={values.time}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field"
          >
            <option value="">Select time</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>
          {touched.time && errors.time && (
            <p className="text-red-500 text-sm">{errors.time}</p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium mb-1">Reason for Visit</label>
          <textarea
            name="reason"
            value={values.reason}
            onChange={handleChange}
            onBlur={handleBlur}
            className="input-field"
            rows="4"
            placeholder="Describe your symptoms or reason for appointment"
          />
          {touched.reason && errors.reason && (
            <p className="text-red-500 text-sm">{errors.reason}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Book Appointment
        </Button>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Appointment Booked!"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg mb-2">Your appointment has been successfully booked!</p>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </Modal>
    </div>
  );
}

export default BookAppointment;
```

---

## Summary: Key Concepts Checklist

### React Hooks ✅
- [x] `useEffect` - Side effects, data fetching, subscriptions
- [x] `useContext` - Global state without prop drilling
- [x] Custom Hooks - Reusable logic (`useFetch`, `useForm`, `useDebounce`)

### State Management ✅
- [x] Context API - Built-in, lightweight (used in your project)
- [x] Redux - External library, more structured (not used, but learned)

### Form Handling ✅
- [x] Controlled components (value + onChange)
- [x] Form validation (custom `useForm` hook)
- [x] Error handling and touched states

### Data Fetching ✅
- [x] Axios - HTTP client with interceptors
- [x] SWR - Caching and revalidation (learned, not implemented)
- [x] Loading and error states

### API Integration ✅
- [x] GET - Fetch data
- [x] POST - Create data
- [x] PATCH - Update partial data
- [x] DELETE - Remove data

### Authentication ✅
- [x] Login/Logout functionality
- [x] LocalStorage for persistence
- [x] AuthContext for global auth state
- [x] Protected routes with role-based access

---

## Best Practices from Your Medicare System

1. **Always use Context for global state** (theme, auth, appointments)
2. **Create custom hooks for reusable logic** (useFetch, useForm)
3. **Validate forms before submission** (useForm with validation)
4. **Handle loading and error states** in data fetching
5. **Use Axios interceptors** for auth tokens and global error handling
6. **Debounce search inputs** to reduce API calls
7. **Store user session in localStorage** for persistence
8. **Protect sensitive routes** with authentication checks
9. **Clean up useEffect** with return functions (prevent memory leaks)
10. **Use semantic HTML and ARIA labels** for accessibility

---

## Next Steps

- Implement Redux for more complex state (if app grows)
- Add SWR/React Query for better caching
- Implement JWT token refresh logic
- Add comprehensive error boundaries
- Implement role-based authorization (admin, doctor, patient)
- Add real-time features with WebSockets
- Implement pagination for large datasets
- Add testing (Jest, React Testing Library)

---

**Remember:** Your Medicare system already implements most of these concepts beautifully! Use this guide as a reference for understanding how everything works together. 🎉
