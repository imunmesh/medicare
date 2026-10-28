import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronously initialize user state and token from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error('Error reading user from localStorage:', err);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('activeChatContact');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (authToken) {
      setToken(authToken);
      localStorage.setItem('authToken', authToken);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    try {
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    } catch (err) {
      console.error('Error updating user in localStorage:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('activeChatContact');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
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

export default AuthContext;
