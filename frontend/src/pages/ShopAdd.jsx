import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './ShopAdd.css';

const ShopAdd = () => {
  const navigate = useNavigate();

  const [itemData, setItemData] = useState({
    name: '',
    description: '',
    size: '',
    category: '',
    color: '',
    condition: '',
    image: null,
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
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted item:", itemData);
    // TODO: Send to backend
  };

  return (
    <div className="shop-add-page">
      <div className="shop-add-back" onClick={() => navigate('/shop')}>
        <FiArrowLeft size={20} />
        <span>Back to Shop</span>
      </div>

      <h2>Add New Item</h2>
      <form className="shop-add-form" onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input type="text" name="name" value={itemData.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" rows="4" value={itemData.description} onChange={handleChange} required />

        <label>Size</label>
        <select name="size" value={itemData.size} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

        <label>Category</label>
        <select name="category" value={itemData.category} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Top">Top</option>
          <option value="Pants">Pants</option>
          <option value="Socks">Socks</option>
          <option value="Dress">Dress</option>
          <option value="Other">Other</option>
        </select>

        <label>Color</label>
        <input type="text" name="color" value={itemData.color} onChange={handleChange} required />

        <label>Condition</label>
        <select name="condition" value={itemData.condition} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="New">New</option>
          <option value="Gently Used">Gently Used</option>
          <option value="Well Loved">Well Loved</option>
        </select>

        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" className="btn btn-primary">Post Item</button>
      </form>
    </div>
  );
};

export default ShopAdd;
