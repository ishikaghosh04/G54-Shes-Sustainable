import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Link added
import '../Product.css';
import './VintageGraphicTShirt.css';
import { CartContext } from '../../context/CartContext';

const VintageGraphicTShirt = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      productID: 'vintagegraphictshirt',
      name: 'Vintage Graphic T-shirt',
      price: 15.50,
    });
  };

  return (
    <div className="product-page">
      <button onClick={() => navigate('/product')} className="back-button">← Back to Products</button>
      <h2>Vintage Graphic T-shirt</h2>
      <img
        src="https://via.placeholder.com/300x300.png?text=Vintage+Graphic+Tee"
        alt="Vintage Graphic T-shirt"
        className="product-image"
      />
      <p><strong>Price:</strong> $15.50</p>
      <p><strong>Category:</strong> Casual Wear</p>
      <p><strong>Condition:</strong> Pre-loved</p>
      <p><strong>Size:</strong> M</p>
      <p><strong>Description:</strong> Soft cotton graphic tee with a unique vintage print—perfect for laid-back maternity days or styling up with layers.</p>

      <div className="seller-info">
        <h3>Seller Info</h3>
        <p>Name: <Link to="/seller/priya-desai">Priya Desai</Link></p>
        <p>Email: <a href="mailto:priya@example.com">priya@example.com</a></p>
      </div>

      <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default VintageGraphicTShirt;
