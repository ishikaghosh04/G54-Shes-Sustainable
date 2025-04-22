import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {

      API.get('/profile')             
         .then(res => setUser(res.data))  
         .catch(() => localStorage.removeItem('jwt'));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('jwt');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
