import React, { useState } from 'react';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', credentials);
    // TODO: Add login API
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ display: 'block', marginBottom: '1rem', width: '100%' }} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ display: 'block', marginBottom: '1rem', width: '100%' }} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
