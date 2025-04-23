import React, { useState,useContext,useEffect } from 'react';
import './Login.css';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import API from '../api';
import { AuthContext }            from '../context/AuthContext';


const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();    // ← grab incoming location state
  const [error, setError] = useState('');
  const { setUser }                   = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
     // optional: clear it so it doesn’t persist if they click back
      navigate(location.pathname, { replace: true, state: {} });
      }
    }, [location, navigate]);

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post('/login', credentials);
      const { token } = res.data;

 
      localStorage.setItem('jwt', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const profileRes = await API.get('/profile');
      setUser(profileRes.data);

      navigate('/product');
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
         <p className="login-redirect"> New User?{' '}
                <Link to="/signup" className="login-redirect__link"> Sign Up</Link>  
          </p>
      </form>
    </div>
  );
};

export default Login;