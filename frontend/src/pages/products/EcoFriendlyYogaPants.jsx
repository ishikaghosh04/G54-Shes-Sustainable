import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link
import '../Product.css';
import './EcoFriendlyYogaPants.css';
import { CartContext } from '../../context/CartContext';

const EcoFriendlyYogaPants = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'ecofriendlyyogapants',
      name: 'Eco-friendly Yoga Pants',
      price: 22.99,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Eco-friendly Yoga Pants</h2>
      <img
        src="https://via.placeholder.com/300x300.png?text=Eco+Yoga+Pants"
        alt="Eco-friendly Yoga Pants"
        className="product-image"
      />
      <p><strong>Price:</strong> $22.99</p>
      <p><strong>Category:</strong> Activewear</p>
      <p><strong>Condition:</strong> Excellent</p>
      <p><strong>Size:</strong> S</p>
      <p><strong>Description:</strong> Made from sustainable bamboo fabric, these yoga pants are breathable, stretchy, and eco-conscious—perfect for expecting moms on the move.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>
          Name: <Link to="/seller/aanya-patel">Aanya Patel</Link>
        </p>
        <p>Email: <a href="mailto:aanya@example.com">aanya@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default EcoFriendlyYogaPants;
