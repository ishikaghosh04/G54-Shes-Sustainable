import React, { useState } from 'react';

const ShopAdd = () => {
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
    // TODO: Send to backend or update product list
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <label>Item Name</label>
        <input
          type="text"
          name="name"
          value={itemData.name}
          onChange={handleChange}
          required
        /><br /><br />

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          rows="4"
          value={itemData.description}
          onChange={handleChange}
          required
        /><br /><br />

        {/* Size */}
        <label>Size</label>
        <select name="size" value={itemData.size} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select><br /><br />

        {/* Category */}
        <label>Category</label>
        <select name="category" value={itemData.category} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Top">Top</option>
          <option value="Pants">Pants</option>
          <option value="Socks">Socks</option>
          <option value="Dress">Dress</option>
          <option value="Other">Other</option>
        </select><br /><br />

        {/* Color */}
        <label>Color</label>
        <input
          type="text"
          name="color"
          value={itemData.color}
          onChange={handleChange}
          required
        /><br /><br />

        {/* Condition */}
        <label>Condition</label>
        <select name="condition" value={itemData.condition} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="New">New</option>
          <option value="Gently Used">Gently Used</option>
          <option value="Well Loved">Well Loved</option>
        </select><br /><br />

        {/* Image Upload */}
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} /><br /><br />

        <button type="submit">Post Item</button>
      </form>
    </div>
  );
};

export default ShopAdd;
