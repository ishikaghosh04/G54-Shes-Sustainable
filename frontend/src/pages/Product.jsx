import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Product = () => {
  const [price, setPrice] = useState(100);
  const [productCondition, setProductCondition] = useState('new');
  const [products, setProducts] = useState([]);

  const fetchFilteredProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/price-range-and-product-condition/${price}/${productCondition}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching filtered products:", err);
    }
  };

  useEffect(() => {
    fetchFilteredProducts(); 
  }, []);

  useEffect(() => {
    fetchFilteredProducts(); 
  }, [price, productCondition]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Filter Products</h2>

      {/* Price Slider */}
      <label>Max Price: ${price}</label>
      <input
        type="range"
        min="0"
        max="200"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* Condition Dropdown */}
      <label style={{ marginLeft: '1rem' }}>Condition:</label>
      <select value={productCondition} onChange={(e) => setProductCondition(e.target.value)}>
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>

      {/* Filtered Product Results */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        {products.map((p, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: "1rem" }}>
            <h4>{p.name}</h4>
            <p>${p.price}</p>
            <p>Condition: {p.productCondition}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
