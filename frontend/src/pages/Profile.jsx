import React, { useState, useEffect, useContext } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile]       = useState(null);
  const [editingField, setEditing]  = useState(null);
  const [form, setForm]             = useState({});
  const [orders, setOrders]         = useState([]);

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

  // fetch shipments + reviews for each order
  useEffect(() => {
    orders.forEach((order, idx) => {
      API.get(`/shipping/order/${order.orderID}`)
         .then(res => {
           const shipments = res.data;
           return Promise.all(
             shipments.map(s =>
               API.get(`/reviews?productID=${s.productID}&orderID=${order.orderID}`)
                  .then(r => ({ ...s, review: r.data[0] }))
                  .catch(() => ({ ...s, review: null }))
             )
           ).then(withReviews => ({ idx, withReviews }));
         })
         .then(({ idx, withReviews }) => {
           setOrders(prev => {
             const copy = [...prev];
             copy[idx].shipments = withReviews;
             return copy;
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
        <FiArrowLeft size={20} />
        <span>Back to Products</span>
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
            <input
              name="phoneNumber"
              value={form.phoneNumber || ''}
              onChange={handleChange}
            />

            <button className="btn btn-primary" onClick={saveProfile}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phoneNumber || '—'}</p>
            <button
              className="btn btn-primary"
              onClick={() => setEditing('personal')}
            >
              Edit
            </button>
          </>
        )}
      </div>

      {/* Shipping Address */}
      <div className="profile-card">
        <h3>Address</h3>
        {editingField === 'address' ? (
          <>
            <label>Street</label>
            <input
              name="street"
              value={form.street || ''}
              onChange={handleChange}
            />

            <label>City</label>
            <input
              name="city"
              value={form.city || ''}
              onChange={handleChange}
            />

            <label>Province</label>
            <input
              name="province"
              value={form.province || ''}
              onChange={handleChange}
            />

            <label>Postal Code</label>
            <input
              name="postalCode"
              value={form.postalCode || ''}
              onChange={handleChange}
            />

            <button className="btn btn-primary" onClick={saveProfile}>
              Save
            </button>
          </>
        ) : (
          <>
            <p>
              {profile.street}, {profile.city}, {profile.province} {profile.postalCode}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setEditing('address')}
            >
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
              Order #{order.orderID} — ${Number(order.totalAmount).toFixed(2)}
            </h4>
        
            {order.shipments?.map(sh => {
              const delivered = new Date(sh.estDeliveryDate) <= new Date();
              return (
                <div key={sh.shippingID} className="shipment-record">
                  <p>
                    <strong>Product:</strong> {sh.productName}<br/>
                    <strong>Tracking #:</strong> {sh.trackingNumber}<br/>
                    <strong>Delivery Date:</strong> {new Date(sh.estDeliveryDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Seller:</strong> {sh.sellerFirstName} {sh.sellerLastName}<br/>
                    <a
                      href={`mailto:${sh.sellerEmail}`}
                      className="seller-email"
                    >
                      {sh.sellerEmail}
                    </a>
                  </p>

                  {sh.review ? (
                    <div className="existing-review">
                      <div className="star-rating read-only">
                        {[1,2,3,4,5].map(i => (
                          <span
                            key={i}
                            className={i <= sh.review.rating ? 'star active' : 'star'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="review-text">{sh.review.comment}</p>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      disabled={!delivered}
                      onClick={() => navigate('/review', {
                        state: {
                          productID:   sh.productID,
                          orderID:     order.orderID,
                          productName: sh.productName
                        }
                      })}
                    >
                      Leave a Review
                    </button>
                  )}

                  {/* the CSS hides this <hr> inside a .shipment-record */}
                  <hr />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button className="btn-danger" onClick={deleteAccount}>
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
