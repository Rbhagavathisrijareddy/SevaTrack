import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'ngo' or 'worker'

  const login = (email, password, role) => {
    // Demo authentication
    if (email && password) {
      if (role === 'ngo') {
        setUser({ email, name: 'NGO Admin', role: 'ngo' });
        setUserRole('ngo');
      } else if (role === 'worker') {
        setUser({ 
          email, 
          name: email.split('@')[0], 
          workerId: `WRK-${Math.floor(Math.random() * 9000) + 1000}`,
          role: 'worker' 
        });
        setUserRole('worker');
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};