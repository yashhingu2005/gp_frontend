import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const { data, error } = await apiService.verifyToken();
      
      if (error || !data) {
        localStorage.removeItem('auth_token');
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await apiService.signIn(email, password);
      
      if (error) {
        throw new Error(error);
      }
      
      if (data && data.user) {
        setUser(data.user);
        return { data, error: null };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await apiService.signOut();
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    apiService, // Provide apiService to components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};