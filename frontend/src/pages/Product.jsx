import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CategoryBar from '../components/CategoryBar';
import './Product.css';
import API from '../api';

const imageMap = {
  'Vintage Denim Jacket': '/images/VintageDenimJacket.jpg',
  'Floral Summer Dress': '/images/FloralSummerDress.jpg',
  'Organic Cotton Sweater': '/images/OrganicCottonSweater.jpg',
  'Eco-friendly Yoga Pants': '/images/EcoFriendlyYogaPants.jpg',
  'Vintage Graphic T-shirt': '/images/VintageGraphicT.jpg',
  'Designer Handbag': '/images/designerhandbag.jpg',
  'Wool Winter Scarf': '/images/woolwinterscarf.jpg',
};

const Product = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  const getProductPath = (name) => {
    return `/product/${name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-')}`;
  };

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
            <div
              key={product.productID}
              className="product-card"
              onClick={() => navigate(getProductPath(product.name))}
              style={{ cursor: 'pointer' }}
            >
              <img
                src= {imageMap[product.name] ||"https://via.placeholder.com/220x220.png?text=Product+Image"}
                alt={product.name}
                className="product-thumbnail"
              />
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from firing
                  addToCart(product);
                }}
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
