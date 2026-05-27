import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (adminData) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin');
  };

  // Check for saved admin on mount
  React.useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    admin,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}