import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Product.css';
import './DesignerHandbag.css';
import { CartContext } from '../../context/CartContext';

const DesignerHandbag = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'designerhandbag',
      name: 'Designer Handbag',
      price: 85.00,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Designer Handbag</h2>
      <img
        src="https://via.placeholder.com/300x300.png?text=Designer+Handbag"
        alt="Designer Handbag"
        className="product-image"
      />
      <p><strong>Price:</strong> $85.00</p>
      <p><strong>Category:</strong> Accessories</p>
      <p><strong>Condition:</strong> Brand New</p>
      <p><strong>Size:</strong> One Size</p>
      <p><strong>Description:</strong> A luxury designer handbag with a timeless design, perfect for moms who love a bit of elegance.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>Name: <Link to="/seller/alisha-morgan">Alisha Morgan</Link></p>
        <p>Email: <a href="mailto:alisha@example.com">alisha@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default DesignerHandbag;
