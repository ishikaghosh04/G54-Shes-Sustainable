import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Product.css'; // or you can create ProductDetail.css if you'd like
import API from '../api';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Error fetching product details:', err));
  }, [id]);

  if (!product) {
    return <div className="product-page">Loading...</div>;
  }

  return (
    <div className="product-detail-container">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="product-detail-image"
        />
      )}
      <h2>{product.name}</h2>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Size:</strong> {product.size}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Condition:</strong> {product.condition}</p>
      <p><strong>Seller:</strong> {product.seller}</p>
      <p><strong>Reviews:</strong> {product.reviews}</p>

      <button
        className="btn btn-primary"
        onClick={() => addToCart(product)}
        style={{ marginTop: '1rem' }}
      >
        Add to Cart
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => navigate('/product')}
        style={{ marginTop: '1rem', marginLeft: '1rem' }}
      >
        ← Back to Products
      </button>
    </div>
  );
};

export default ProductDetail;
