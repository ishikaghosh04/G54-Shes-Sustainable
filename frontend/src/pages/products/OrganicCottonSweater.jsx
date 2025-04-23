import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link
import '../Product.css';
import './OrganicCottonSweater.css';
import { CartContext } from '../../context/CartContext';

const OrganicCottonSweater = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'Organiccottonsweater',
      name: 'Organic Cotton Sweater',
      price: 30.00,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Organic Cotton Sweater</h2>
      <img
        src="/images/OrganicCottonSweater.jpg"
        alt="Organic Cotton Sweater"
        className="product-image"
      />
      <p><strong>Price:</strong> $30.00</p>
      <p><strong>Category:</strong> Tops</p>
      <p><strong>Condition:</strong> Very Good</p>
      <p><strong>Size:</strong> L</p>
      <p><strong>Description:</strong> This eco-conscious cotton sweater is soft, breathable, and ethically made for comfort during and after pregnancy.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>
          Name: <Link to="/seller/rachel-lim">Rachel Lim</Link>
        </p>
        <p>Email: <a href="mailto:rachel@example.com">rachel@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default OrganicCottonSweater;
