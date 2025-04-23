import React, { useEffect, useState, useContext } from 'react';
import './Dashboard.css';
import API from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    if (!user.isAdmin) {
      navigate('/not-authorized'); // redirect non-admins to custom page
      return;
    }

    API.get('/admin/metrics')
      .then(res => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch metrics:', err);
        setMetrics(null);
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <div className="dashboard-page">
      <h2>📊 Admin Dashboard</h2>

      {loading ? (
        <p className="dashboard-loading">Loading metrics...</p>
      ) : metrics ? (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>🧑‍💻 New Signups Today</h3>
            <p className="metric-value">{metrics.newSignupsToday}</p>
          </div>
          <div className="metric-card">
            <h3>🛒 Sales Today</h3>
            <p className="metric-value">{metrics.salesToday}</p>
          </div>
        </div>
      ) : (
        <p className="dashboard-error">🚨 Failed to load dashboard metrics.</p>
      )}
    </div>
  );
};

export default Dashboard;
