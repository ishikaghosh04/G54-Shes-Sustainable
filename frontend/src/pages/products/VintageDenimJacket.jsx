import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link
import '../Product.css';
import './VintageDenimJacket.css';
import { CartContext } from '../../context/CartContext';

const VintageDenimJacket = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'vintagedenimjacket',
      name: 'Vintage Denim Jacket',
      price: 45.99,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Vintage Denim Jacket</h2>
      <img
        src="https://via.placeholder.com/300x300.png?text=Denim+Jacket"
        alt="Vintage Denim Jacket"
        className="product-image"
      />
      <p><strong>Price:</strong> $45.99</p>
      <p><strong>Category:</strong> Outerwear</p>
      <p><strong>Condition:</strong> Gently Used</p>
      <p><strong>Size:</strong> M</p>
      <p><strong>Description:</strong> A timeless vintage denim jacket that pairs perfectly with any outfit—great for layering during maternity months.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>
          Name: <Link to="/seller/olivia-chen">Olivia Chen</Link>
        </p>
        <p>Email: <a href="mailto:olivia@example.com">olivia@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default VintageDenimJacket;
