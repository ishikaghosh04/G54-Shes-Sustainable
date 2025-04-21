import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import API from '../api';
// Pending what is the landing page after signup
const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', credentials);
    setError("");

    try {
      const res = await API.post("/login", credentials);
      const { token } = res.data;

 
      localStorage.setItem("jwt", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;


      navigate("/product");
    } catch (err) {
      // Show server‑side message or fallback to JS error
      const serverMsg = err.response?.data?.message
                      || err.response?.data?.error;
      setError(serverMsg || 'Login failed');
    }

    
  };

  return (
    <div className="login-page">
      <div className="back-button" onClick={() => navigate('/')}>
        <FiArrowLeft size={18} style={{ marginRight: '8px' }} />
        <span>Back to Home</span>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;