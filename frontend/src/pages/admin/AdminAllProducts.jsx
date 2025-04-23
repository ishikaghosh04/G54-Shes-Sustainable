import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import './AdminAllProducts.css';

const AdminAllProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // 🚫 Redirect non-admins
    if (!user.isAdmin) {
      navigate('/not-authorized');
      return;
    }

    API.get('/admin/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load all products:', err);
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <div className="admin-products-page">
      <h2>📦 All Products (Admin View)</h2>

      {loading ? (
        <p className="loading-message">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="empty-message">No products found in the system.</p>
      ) : (
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Seller ID</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.productID}>
                <td>{prod.name}</td>
                <td>${prod.price.toFixed(2)}</td>
                <td className={prod.isActive ? 'active' : 'inactive'}>
                  {prod.isActive ? 'Active' : 'Inactive'}
                </td>
                <td>{prod.category}</td>
                <td>{prod.productCondition}</td>
                <td>{prod.sellerID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAllProducts;
