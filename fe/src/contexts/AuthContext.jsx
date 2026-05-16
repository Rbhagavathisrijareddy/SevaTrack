import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'ngo' or 'worker'
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async (email, password, role) => {
    try {
      // Use relative path - works on any domain
      const endpoint = '/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      console.log('Login response status:', response.status);

      if (response.status === 404) {
        return { 
          success: false, 
          message: 'Backend server not running. Please start the backend.' 
        };
      }

      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        return { 
          success: false, 
          message: data?.message || 'Invalid email or password' 
        };
      }

      // Store token and user data
      localStorage.setItem('token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      setUserRole(role);
      setIsAuthenticated(true);

      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Connection error: Backend server not responding' };       
    }
  };  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};