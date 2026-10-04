// ============================================
// useContext HOOK - Complete Examples
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// EXAMPLE 1: Theme Context (Light/Dark Mode)
// ============================================

// Step 1: Create Context
const ThemeContext = createContext(null);

// Step 2: Create Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage
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

// Step 3: Create Custom Hook to Use Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Step 4: Using Theme Context in Components
function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

function ThemedCard() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
      <h2>Themed Card</h2>
      <p>This card changes with the theme</p>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Auth Context (User Authentication)
// ============================================

// Step 1: Create Context
const AuthContext = createContext(null);

// Step 2: Create Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage
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
    localStorage.setItem('authToken', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Create Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Step 4: Using Auth Context
function LoginButton() {
  const { login } = useAuth();

  const handleLogin = () => {
    const userData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'patient',
      token: 'fake-jwt-token',
    };
    login(userData);
  };

  return <button onClick={handleLogin}>Login</button>;
}

function ProfileComponent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function ProtectedContent() {
  const { user } = useAuth();

  if (!user) {
    return <p>Access Denied. Please login.</p>;
  }

  return <p>This is protected content for {user.name}</p>;
}

// ============================================
// EXAMPLE 3: Appointment Context (App State)
// ============================================

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add appointment
  const addAppointment = (newAppointment) => {
    setAppointments([...appointments, { ...newAppointment, id: Date.now() }]);
  };

  // Cancel appointment
  const cancelAppointment = (id) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      )
    );
  };

  // Get appointments for a patient
  const getPatientAppointments = (patientId) => {
    return appointments.filter((apt) => apt.patientId === patientId);
  };

  // Get appointments for a doctor
  const getDoctorAppointments = (doctorId) => {
    return appointments.filter((apt) => apt.doctorId === doctorId);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        error,
        addAppointment,
        cancelAppointment,
        getPatientAppointments,
        getDoctorAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider');
  }
  return context;
};

// Using Appointment Context
function BookAppointmentForm() {
  const { addAppointment } = useAppointments();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      patientId: user.id,
      doctorId: 5,
      date: '2024-03-20',
      time: '10:00',
      reason: 'Regular checkup',
      status: 'pending',
    };
    addAppointment(newAppointment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Book Appointment</button>
    </form>
  );
}

function MyAppointments() {
  const { getPatientAppointments } = useAppointments();
  const { user } = useAuth();

  const myAppointments = getPatientAppointments(user?.id);

  return (
    <div>
      <h2>My Appointments</h2>
      {myAppointments.map((apt) => (
        <div key={apt.id}>
          <p>Date: {apt.date}</p>
          <p>Time: {apt.time}</p>
          <p>Status: {apt.status}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 4: Language Context (Internationalization)
// ============================================

const LanguageContext = createContext(null);

const translations = {
  en: {
    welcome: 'Welcome',
    logout: 'Logout',
    appointments: 'Appointments',
  },
  es: {
    welcome: 'Bienvenido',
    logout: 'Cerrar sesión',
    appointments: 'Citas',
  },
  hi: {
    welcome: 'स्वागत है',
    logout: 'लॉग आउट',
    appointments: 'नियुक्तियाँ',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Using Language Context
function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
}

function TranslatedContent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('appointments')}</p>
      <button>{t('logout')}</button>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Notification Context (Toast Messages)
// ============================================

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const showSuccess = (message) => addNotification(message, 'success');
  const showError = (message) => addNotification(message, 'error');
  const showInfo = (message) => addNotification(message, 'info');

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, showSuccess, showError, showInfo }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Using Notification Context
function NotificationDisplay() {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded ${
            notif.type === 'success'
              ? 'bg-green-500'
              : notif.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          } text-white`}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
}

function ActionButtons() {
  const { showSuccess, showError, showInfo } = useNotification();

  return (
    <div>
      <button onClick={() => showSuccess('Appointment booked!')}>
        Book Appointment
      </button>
      <button onClick={() => showError('Failed to cancel')}>
        Cancel (will fail)
      </button>
      <button onClick={() => showInfo('Loading doctors...')}>
        Load Doctors
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Nested Contexts (Multiple Providers)
// ============================================

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppointmentProvider>
              <MainApp />
            </AppointmentProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function MainApp() {
  // All contexts are available here
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { appointments } = useAppointments();

  return (
    <div>
      <h1>{t('welcome')}, {user?.name}!</h1>
      <p>Theme: {isDark ? 'Dark' : 'Light'}</p>
      <p>Appointments: {appointments.length}</p>
    </div>
  );
}

// ============================================
// EXAMPLE 7: Context with Reducer (Advanced)
// ============================================

import { useReducer } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_ITEM':
      const item = state.items.find((i) => i.id === action.payload);
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        total: state.total - (item?.price || 0),
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Using Cart Context
function ShoppingCart() {
  const { items, total, removeItem, clearCart } = useCart();

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      <p>Total: ${total}</p>
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name} - ${item.price}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

// ============================================
// SUMMARY: Context Pattern
// ============================================

/*
1. Create Context: const MyContext = createContext(null);
2. Create Provider: Wrap app/component tree
3. Create Custom Hook: useMyContext() for easy access
4. Use Context: const { value } = useMyContext();

Benefits:
- No prop drilling
- Global state management
- Easy to use
- Built into React

When to use:
- Theme/Language settings
- User authentication
- Global app state
- Notification system
*/
