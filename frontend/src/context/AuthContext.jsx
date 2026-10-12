import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jobskillmatch_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 1,
      name: 'Arun Kumar',
      email: 'arun.candidate@example.com',
      role: 'ROLE_CANDIDATE',
    };
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('jobskillmatch_token') || 'demo_jwt_token_sample';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('jobskillmatch_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jobskillmatch_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jobskillmatch_token', token);
    } else {
      localStorage.removeItem('jobskillmatch_token');
    }
  }, [token]);

  const login = async (email, password, roleHint = 'ROLE_CANDIDATE') => {
    try {
      // Attempt backend API call
      const response = await apiClient.post('/auth/login', { email, password });
      const authData = response.data?.data || response.data;
      if (authData && authData.token) {
        setToken(authData.token);
        const userObj = {
          id: authData.userId,
          name: authData.name,
          email: authData.email,
          role: authData.role,
        };
        setUser(userObj);
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.warn('Backend login endpoint returned error or fallback needed:', err.response?.data?.message || err.message);
      if (err.response?.status === 401 || err.response?.status === 400) {
        throw new Error(err.response?.data?.message || 'Invalid email or password');
      }
    }

    // Fallback demo login for offline mode
    const isAdmin = email.toLowerCase().includes('admin') || roleHint === 'ROLE_ADMIN';
    const demoUser = {
      id: isAdmin ? 1 : 2,
      name: isAdmin ? 'Administrator' : (email.split('@')[0] || 'Candidate User'),
      email: email || (isAdmin ? 'admin@jobskillmatch.com' : 'candidate@example.com'),
      role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_CANDIDATE',
    };
    setUser(demoUser);
    setToken('demo_jwt_token_' + Date.now());
    return { success: true, user: demoUser };
  };

  const register = async (userData) => {
    try {
      const payload = {
        name: userData.fullName || userData.name || 'New Candidate',
        email: userData.email,
        password: userData.password,
        role: userData.role || 'ROLE_CANDIDATE',
      };
      const response = await apiClient.post('/auth/register', payload);
      const authData = response.data?.data || response.data;
      if (authData && authData.token) {
        setToken(authData.token);
        const userObj = {
          id: authData.userId,
          name: authData.name,
          email: authData.email,
          role: authData.role,
        };
        setUser(userObj);
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.warn('Backend register returned error or fallback needed:', err.response?.data?.message || err.message);
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
    }

    const newUser = {
      id: Date.now(),
      name: userData.fullName || userData.name || 'New Candidate',
      email: userData.email,
      role: 'ROLE_CANDIDATE',
    };
    setUser(newUser);
    setToken('demo_jwt_token_' + Date.now());
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jobskillmatch_token');
    localStorage.removeItem('jobskillmatch_user');
  };

  const switchRole = (newRole) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'ROLE_ADMIN' ? 'Platform Administrator' : 'Arun Kumar',
      email: newRole === 'ROLE_ADMIN' ? 'admin@jobskillmatch.com' : 'arun.candidate@example.com',
    }));
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    isCandidate: user?.role === 'ROLE_CANDIDATE',
    login,
    register,
    logout,
    switchRole,
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
