import React, { useEffect, useState, useContext } from 'react';
import './OrderHistory.css';
import API from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (!user.isAdmin) {
      navigate('/not-authorized');
      return;
    }

    API.get('/admin/orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders.');
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <div className="order-history-page">
      <h2>📦 All Orders</h2>

      {loading ? (
        <p className="order-loading">Loading orders...</p>
      ) : error ? (
        <p className="order-error">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders have been placed yet.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total ($)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderID}>
                <td>{order.orderID}</td>
                <td>{order.userID}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
