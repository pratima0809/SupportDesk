import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      // no token; stop loading so routes can render
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      setLoading(true);
      const response = await apiClient.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      setUser(response.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const token = localStorage.getItem('token');
      const response = await apiClient.put('/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Update failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
