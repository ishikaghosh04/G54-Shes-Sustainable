import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link
import '../Product.css';
import './FloralSummerDress.css';
import { CartContext } from '../../context/CartContext';

const FloralSummerDress = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'floralsummerdress',
      name: 'Floral Summer Dress',
      price: 25.50,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Floral Summer Dress</h2>
      <img
        src="https://via.placeholder.com/300x300.png?text=Floral+Summer+Dress"
        alt="Floral Summer Dress"
        className="product-image"
      />
      <p><strong>Price:</strong> $25.50</p>
      <p><strong>Category:</strong> Dresses</p>
      <p><strong>Condition:</strong> Like New</p>
      <p><strong>Size:</strong> M</p>
      <p><strong>Description:</strong> A lightweight, floral-patterned maternity dress perfect for summer outings.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>
          Name: <Link to="/seller/jane-doe">Jane Doe</Link>
        </p>
        <p>Email: <a href="mailto:jane@example.com">jane@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default FloralSummerDress;
