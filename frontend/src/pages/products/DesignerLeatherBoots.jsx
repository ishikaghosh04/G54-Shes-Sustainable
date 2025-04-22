import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ added Link
import '../Product.css';
import './DesignerLeatherBoots.css';
import { CartContext } from '../../context/CartContext';

const DesignerLeatherBoots = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'designerleatherboots',
      name: 'Designer Leather Boots',
      price: 65.75,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Designer Leather Boots</h2>
      <img
        src="https://via.placeholder.com/300x300.png?text=Designer+Leather+Boots"
        alt="Designer Leather Boots"
        className="product-image"
      />
      <p><strong>Price:</strong> $65.75</p>
      <p><strong>Category:</strong> Footwear</p>
      <p><strong>Condition:</strong> Excellent</p>
      <p><strong>Size:</strong> 8</p>
      <p><strong>Description:</strong> High-quality leather boots designed for durability and timeless maternity style.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>
          Name: <Link to="/seller/kiara-thomas">Kiara Thomas</Link>
        </p>
        <p>Email: <a href="mailto:kiara@example.com">kiara@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default DesignerLeatherBoots;
