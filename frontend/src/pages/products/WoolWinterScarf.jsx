import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ added Link
import '../Product.css';
import './WoolWinterScarf.css';
import { CartContext } from '../../context/CartContext';

const WoolWinterScarf = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'woolwinterscarf',
      name: 'Wool Winter Scarf',
      price: 35.25,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Wool Winter Scarf</h2>
      <img
        src="/images/woolwinterscarf.jpg"
        alt="Wool Winter Scarf"
        className="product-image"
      />
      <p><strong>Price:</strong> $35.25</p>
      <p><strong>Category:</strong> Accessories</p>
      <p><strong>Condition:</strong> Like New</p>
      <p><strong>Size:</strong> One Size</p>
      <p><strong>Description:</strong> This cozy wool scarf offers warmth and style through Calgary winters. A great pick for chilly days and maternity comfort.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>Name: <Link to="/seller/lina-george">Lina George</Link></p>
        <p>Email: <a href="mailto:lina@example.com">lina@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default WoolWinterScarf;
