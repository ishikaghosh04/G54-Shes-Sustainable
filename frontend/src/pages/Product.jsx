import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { CartContext } from '../context/CartContext';
import CategoryBar from '../components/CategoryBar';
import './Product.css';
import API from '../api'; 

const Product = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  const handleSelectCategory = (category) => {
    API.get(`/products/category/${category}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(`Failed to load ${category}:`, err));
  };

  return (
    <>
      <CategoryBar onSelectCategory={handleSelectCategory} />
      <div className="product-page">
        <h2>Our Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productID} className="product-card-wrapper">
              <Link
                to={`/product/${product.productID}`}
                className="product-card-link"
              >
                <div className="product-card">
                  <h4>{product.name}</h4>
                  <p>{product.price}</p>
                </div>
              </Link>
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
