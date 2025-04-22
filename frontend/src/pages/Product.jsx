import React, { useContext, useState, useEffect } from 'react';
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

         // Handler when a category is selected
  const handleSelectCategory = (cat) => {
    if (!cat) {
      API.get('/products')
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    } else {
      API.get(`/products/category/${cat}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    }
         };

  return (
    <>
      <CategoryBar onSelectCategory={handleSelectCategory} />
      <div className="product-page">
        <h2>Our Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productID} className="product-card">
              <h4>{product.name}</h4>
              <p>{product.price}</p>
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