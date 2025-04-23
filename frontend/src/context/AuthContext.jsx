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
         .catch(() => {
          localStorage.removeItem('jwt');
          delete API.defaults.headers.common['Authorization'];
          setUser(null);
        });
    }
  }, []);

  const login = (token, profile) => {
    localStorage.setItem('jwt', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(profile);
  };
  const logout = () => {
    localStorage.removeItem('jwt');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}