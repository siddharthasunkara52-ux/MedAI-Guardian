import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('medai-token')));

  const isAuthenticated = !!user;

  const loadUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user || response.data);
    } catch {
      localStorage.removeItem('medai-token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('medai-token')) {
      const timer = window.setTimeout(loadUser, 0);
      return () => window.clearTimeout(timer);
    }
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('medai-token', token);
    setUser(userData);
    toast.success('Welcome back!');
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('medai-token', token);
    setUser(userData);
    toast.success('Account created successfully!');
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('medai-token');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
