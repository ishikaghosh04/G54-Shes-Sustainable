import React, { useState, useEffect, useContext } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [editingField, setEditing] = useState(null); 
  const [form, setForm] = useState({});
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    API.get('/profile')
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => {});
 
    API.get('/profile/orders/history')
      .then(res => setOrders(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    orders.forEach((order, oIdx) => {
      API.get(`/shipping/order/${order.orderID}`)
         .then(res => {
           const shipments = res.data;
           // for each shipment, try to fetch its review
           Promise.all(shipments.map(s =>
             API.get(`/reviews?productID=${s.productID}&orderID=${order.orderID}`)
               .then(r => ({ ...s, review: r.data[0] }))     // r.data is an array
               .catch(() => ({ ...s, review: null }))
           )).then(withReviews => {
             setOrders(prev => {
               const copy = [...prev];
               copy[oIdx].shipments = withReviews;
               return copy;
             });
           });
         })
         .catch(() => {});
    });
  }, [orders.length]);

  
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const saveProfile = () => {
    const payload = {
      phoneNumber: form.phoneNumber,
      city:        form.city,
      province:    form.province,
      street:      form.street,
      postalCode:  form.postalCode
    };
    API.patch('/profile/update', payload)
      .then(() => {
        setProfile(p => ({ ...p, ...payload }));
        setEditing(null);
      })
      .catch(err => alert(err.response?.data?.message || err.message));
  };

  const deleteAccount = () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    API.delete('/profile/delete')
      .then(() => {
        logout();
        navigate('/');
      })
      .catch(err => alert(err.response?.data?.message || err.message));
  };

  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="profile-back" onClick={() => navigate('/product')}>
        <FiArrowLeft size={20} /><span>Back to Products</span>
      </div>
      <h2>Your Profile</h2>

      {/* Personal Info */}
      <div className="profile-card">
        <h3>Personal Information</h3>
        {editingField === 'personal' ? (
          <>
            <label>First Name</label>
            <input name="firstName" value={form.firstName} disabled />
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} disabled />
            <label>Email</label>
            <input name="email" value={form.email} disabled />
            <label>Phone</label>
            <input name="phoneNumber" value={form.phoneNumber||''} onChange={handleChange} />
            <button className="btn btn-primary" onClick={saveProfile}>Save</button>
            <button onClick={() => setEditing(null)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phoneNumber || '—'}</p>
            <button className="btn btn-primary" onClick={() => setEditing('personal')}>
              Edit
            </button>
          </>
        )}
      </div>

      {/* Shipping Address */}
      <div className="profile-card">
        <h3>Shipping Address</h3>
        {editingField === 'address' ? (
          <>
            <label>Street</label>
            <input name="street" value={form.street||''} onChange={handleChange} />
            <label>City</label>
            <input name="city" value={form.city||''} onChange={handleChange} />
            <label>Province</label>
            <input name="province" value={form.province||''} onChange={handleChange} />
            <label>Postal Code</label>
            <input name="postalCode" value={form.postalCode||''} onChange={handleChange} />
            <button className="btn btn-primary" onClick={saveProfile}>Save</button>
            <button onClick={() => setEditing(null)}>Cancel</button>
          </>
        ) : (
          <>
            <p>
              {profile.street}, {profile.city}, {profile.province} {profile.postalCode}
            </p>
            <button className="btn btn-primary" onClick={() => setEditing('address')}>
              Update Address
            </button>
          </>
        )}
      </div>

    {/* Order History */}
<div className="profile-card">
  <h3>Order History</h3>
  {orders.length === 0 && <p>No completed orders yet.</p>}

  {orders.map(order => (
    <div key={order.orderID} className="order-history-item">
      <h4>
        Order #{order.orderID} — ${(+order.totalAmount).toFixed(2)}
      </h4>
      <p>
        <em>{new Date(order.orderDate).toLocaleString()}</em>
      </p>

      {order.shipments?.length > 0 ? (
        order.shipments.map(ship => {
          const delivered = new Date(ship.estDeliveryDate) <= new Date();
          return (
            <div key={ship.shippingID} className="shipment-record">
              <p>
                <strong>Product:</strong> {ship.productName}<br/>
                <strong>Tracking #:</strong> {ship.trackingNumber}<br/>
                <strong>ETA:</strong> {new Date(ship.estDeliveryDate).toLocaleDateString()}
              </p>
              <p className="shipment-contact">
                <strong>Seller:</strong> {ship.sellerName} &ndash;
                <a className="seller-email" href={`mailto:${ship.sellerEmail}`}>
                  {ship.sellerEmail}
                </a>
              </p>

              {ship.review ? (
                <div className="existing-review">
                  <div className="star-rating read-only">
                    {[1,2,3,4,5].map(i => (
                      <span
                        key={i}
                        className={i <= ship.review.rating ? 'star active' : 'star'}
                      >★</span>
                    ))}
                  </div>
                  <p className="review-text">{ship.review.comment}</p>
                </div>
              ) : delivered ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/review', {
                    state: { productID: ship.productID, orderID: order.orderID }
                  })}
                >
                  Leave a Review
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled
                  title={`You can review after ${new Date(ship.estDeliveryDate).toLocaleDateString()}`}
                >
                  Leave a Review
                </button>
              )}

              <hr/>
            </div>
          );
        })
      ) : (
        <p>Loading shipment details…</p>
      )}
    </div>
  ))}
</div>


      <button className="btn btn-danger" onClick={deleteAccount}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
