import React, { useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

/**
 *  Pending 
 *  Does someone automatically login after signup
 * If so notification of the succesful signup where?
 * If not notification of succesful signup where?
 */
const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccess]  = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    console.log('Form submitted:', formData);
    
     // Build payload for the API
     const payload = {
      firstName: formData.firstName,
      lastName:  formData.lastName,
      email:     formData.email,
      password:  formData.password
    };

    try {
      const res = await fetch('/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        // Server‑side validation error
        throw new Error(data.message || 'Signup failed');
      }

      // Success!
      setSuccess(data.message || 'Account created!');
      // Redirect after a short pause
      setTimeout(() => navigate('/login'), 500);

    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="signup-page">
      {/* Back to Home Button */}
      <div className="back-button" onClick={() => navigate('/')}>
        <FiArrowLeft size={18} style={{ marginRight: '8px' }} />
        <span>Back to Home</span>
      </div>
      <h2>Create an Account</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 chars)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="signup-error">{error}</p>}

        <button type="submit" className="btn btn-primary">Sign Up</button>
        <p className="signup-redirect">
        Already have an account?{' '}
        <Link to="/login" className="signup-redirect__link">
        Login
        </Link>  
        </p>
      </form>
    </div>
  );
};

export default SignUp;
