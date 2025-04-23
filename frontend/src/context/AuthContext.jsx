// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, use } from 'react';
import API from '../api';

export const AuthContext = createContext();

function decodeToken(token) {
  try {
   
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const { userID } = decodeToken(token);

    API.get('/profile')
      .then(res => setUser({ ...res.data, userID }))
      .catch(() => {
    
        localStorage.removeItem('jwt');
        delete API.defaults.headers.common['Authorization'];
        setUser(null);
      });
  }, []);

  const login = async (token) => {
    localStorage.setItem('jwt', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const { userID } = decodeToken(token);
    const profileRes = await API.get('/profile');
    setUser({ ...profileRes.data, userID });
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
