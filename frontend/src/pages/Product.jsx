import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CategoryBar from '../components/CategoryBar';

const Product = () => {
  const { addToCart } = useContext(CartContext);

  const sampleProducts = [
    { name: 'Soft Maternity Dress', price: 49.99 },
    { name: 'Eco Nursing Shirt', price: 35.50 },
    { name: 'Organic Belly Band', price: 19.95 }
  ];

  return (
    <>
      <CategoryBar /> {/* <- Should be right at the top, after the global Navbar */}
      <div style={{ padding: '2rem' }}>
        <h2>Our Products</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {sampleProducts.map((product, index) => (
            <div key={index} style={{ border: '1px solid gray', padding: '1rem' }}>
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Product;