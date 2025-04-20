import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CategoryBar from '../components/CategoryBar';
import './Product.css';

const Product = () => {
  const { addToCart } = useContext(CartContext);

  const sampleProducts = [
    { name: 'Soft Maternity Dress', price: 49.99 },
    { name: 'Eco Nursing Shirt', price: 35.50 },
    { name: 'Organic Belly Band', price: 19.95 }
  ];

  return (
    <>
      <CategoryBar />
      <div className="product-page">
        <h2>Our Products</h2>
        <div className="product-grid">
          {sampleProducts.map((product, index) => (
            <div key={index} className="product-card">
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <button
                className="btn btn-primary"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Product;