// ============================================
// CUSTOM HOOKS - Complete Examples
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

// ============================================
// CUSTOM HOOK 1: useFetch - Data Fetching
// ============================================

function useFetch(url) {
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
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Usage Example
function DoctorsList() {
  const { data: doctors, loading, error, refetch } = useFetch('/doctors');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {doctors?.map((doctor) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
}

// ============================================
// CUSTOM HOOK 2: useForm - Form Handling
// ============================================

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Clear error for this field
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
}

// Usage Example
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

  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useForm({ email: '', password: '' }, validate);

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

// ============================================
// CUSTOM HOOK 3: useDebounce - Delay Input
// ============================================

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage Example
function SearchDoctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      console.log('Searching for:', debouncedSearch);
      // API call here
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search doctors..."
    />
  );
}

// ============================================
// CUSTOM HOOK 4: useLocalStorage - Persist State
// ============================================

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage Example
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}

// ============================================
// CUSTOM HOOK 5: useWindowSize - Responsive Design
// ============================================

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Usage Example
function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}

// ============================================
// CUSTOM HOOK 6: useToggle - Boolean State
// ============================================

function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState((s) => !s);
  }, []);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return [state, toggle, setTrue, setFalse];
}

// Usage Example
function ModalToggle() {
  const [isOpen, toggle, open, close] = useToggle(false);

  return (
    <div>
      <button onClick={open}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={close}>Close</button>
        </div>
      )}
    </div>
  );
}

// ============================================
// CUSTOM HOOK 7: useOnClickOutside - Close on Outside Click
// ============================================

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Usage Example
function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && (
        <ul className="dropdown">
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      )}
    </div>
  );
}

// ============================================
// CUSTOM HOOK 8: useAsync - Async Operations
// ============================================

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

// Usage Example
function FetchUserData({ userId }) {
  const fetchUser = useCallback(
    () => axiosInstance.get(`/users/${userId}`).then((res) => res.data),
    [userId]
  );

  const { data, status, error } = useAsync(fetchUser);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;
  if (status === 'success') return <div>User: {data.name}</div>;

  return null;
}

// ============================================
// CUSTOM HOOK 9: usePrevious - Previous Value
// ============================================

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage Example
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// ============================================
// CUSTOM HOOK 10: useInterval - Repeated Actions
// ============================================

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Usage Example
function AutoRefreshAppointments() {
  const [appointments, setAppointments] = useState([]);

  useInterval(() => {
    // Fetch appointments every 30 seconds
    axiosInstance.get('/appointments').then((res) => {
      setAppointments(res.data);
    });
  }, 30000); // 30 seconds

  return (
    <div>
      <h2>Appointments (Auto-refresh)</h2>
      {appointments.map((apt) => (
        <div key={apt.id}>{apt.date}</div>
      ))}
    </div>
  );
}

// ============================================
// CUSTOM HOOK 11: useMediaQuery - Responsive Breakpoints
// ============================================

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

// Usage Example
function ResponsiveNavigation() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <nav>
      {isMobile && <MobileMenu />}
      {isTablet && <TabletMenu />}
      {isDesktop && <DesktopMenu />}
    </nav>
  );
}

// ============================================
// CUSTOM HOOK 12: useArray - Array Helpers
// ============================================

function useArray(initialArray = []) {
  const [array, setArray] = useState(initialArray);

  const push = (element) => {
    setArray((a) => [...a, element]);
  };

  const remove = (index) => {
    setArray((a) => a.filter((_, i) => i !== index));
  };

  const filter = (callback) => {
    setArray((a) => a.filter(callback));
  };

  const update = (index, newElement) => {
    setArray((a) => [
      ...a.slice(0, index),
      newElement,
      ...a.slice(index + 1),
    ]);
  };

  const clear = () => {
    setArray([]);
  };

  return { array, set: setArray, push, remove, filter, update, clear };
}

// Usage Example
function TodoList() {
  const { array: todos, push, remove, clear } = useArray([]);

  return (
    <div>
      <button onClick={() => push({ id: Date.now(), text: 'New Todo' })}>
        Add Todo
      </button>
      <button onClick={clear}>Clear All</button>
      {todos.map((todo, index) => (
        <div key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => remove(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// CUSTOM HOOK 13: useCopyToClipboard - Copy Text
// ============================================

function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

// Usage Example
function ShareAppointmentLink({ appointmentId }) {
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = () => {
    const link = `https://medicare.com/appointments/${appointmentId}`;
    copy(link);
  };

  return (
    <div>
      <button onClick={handleCopy}>Copy Link</button>
      {copiedText && <span>Copied: {copiedText}</span>}
    </div>
  );
}

// ============================================
// CUSTOM HOOK 14: useTimeout - Delayed Action
// ============================================

function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

// Usage Example
function SuccessMessage() {
  const [show, setShow] = useState(true);

  useTimeout(() => {
    setShow(false);
  }, 3000); // Hide after 3 seconds

  if (!show) return null;

  return <div className="alert-success">Appointment booked successfully!</div>;
}

// ============================================
// CUSTOM HOOK 15: useHover - Hover State
// ============================================

function useHover() {
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef(null);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return [ref, isHovering];
}

// Usage Example
function DoctorCard({ doctor }) {
  const [hoverRef, isHovering] = useHover();

  return (
    <div ref={hoverRef} className={isHovering ? 'card-hover' : 'card'}>
      <h3>{doctor.name}</h3>
      <p>{doctor.specialization}</p>
      {isHovering && <button>Book Appointment</button>}
    </div>
  );
}

// ============================================
// EXPORT ALL HOOKS
// ============================================

export {
  useFetch,
  useForm,
  useDebounce,
  useLocalStorage,
  useWindowSize,
  useToggle,
  useOnClickOutside,
  useAsync,
  usePrevious,
  useInterval,
  useMediaQuery,
  useArray,
  useCopyToClipboard,
  useTimeout,
  useHover,
};

// ============================================
// SUMMARY: Custom Hooks Best Practices
// ============================================

/*
1. Start name with "use" - useFetch, useForm, etc.
2. Extract reusable logic from components
3. Can call other hooks inside
4. Return values/functions for component use
5. Keep hooks focused on one responsibility
6. Test hooks independently

Common Use Cases:
- Data fetching (useFetch)
- Form handling (useForm)
- API calls (useAsync)
- UI interactions (useToggle, useHover)
- Browser APIs (useLocalStorage, useMediaQuery)
- Performance (useDebounce, useInterval)
*/
