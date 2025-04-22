import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './ShopAdd.css';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const ShopAdd = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [err, setErr] = useState('');
  

  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    size: '',
    category: '',
    price: '',
    condition: '',
    picture: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setItemData((prev) => ({
      ...prev,
      picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!user) {
      setErr('You must be logged in to create a listing.');
      return;
    }

    try {
      await API.post('/listings', {
        ...itemData,
        productCondition: itemData.condition
      });

      const profileRes = await API.get('/profile');
      setUser(profileRes.data);
      navigate('/shop');
    } catch (err) {
      console.error('Listing creation failed:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Failed to create listing.';
      setErr(msg.toString());
    }
  };
  return (
    <div className="shop-add-page">
      <div className="shop-add-back" onClick={() => navigate('/shop')}>
        <FiArrowLeft size={20} />
        <span>Back to Shop</span>
      </div>

      <h2>Add New Item</h2>
      {err && <p className="add-error">{err}</p>}
      <form className="shop-add-form" onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input type="text" name="name" value={itemData.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows="4" value={itemData.description} onChange={handleChange} required />

        <label>Size</label>
        <select name="size" value={itemData.size} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="0-3 Months">0-3 Months</option>
          <option value="3-6 Months">3-6 Months</option>
          <option value="6-9 Months">6-9 Months</option>
        </select>

        <label>Category</label>
        <select name="category" value={itemData.category} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Top">Top</option>
          <option value="Pants">Pants</option>
          <option value="Dress">Dress</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Activewear">Activewear</option>
        </select>

        <label>Price</label>
        <input type="number" name="price" value={itemData.price} onChange={handleChange} required min="0"step="0.01" placeholder="0.00"/>

        <label>Condition</label>
        <select name="condition" value={itemData.condition} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="New">New</option>
          <option value="Gently Used">Gently Used</option>
          <option value="Well Loved">Well Loved</option>
        </select>

        <label>Upload Image</label>
        <input type="file"  name="picture"accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="btn btn-primary">Post Item</button>
      </form>
    </div>
  );
};

export default ShopAdd;
