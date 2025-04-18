import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Product from "./pages/Product"; 
import Shipping from "./pages/Shipping";
import Review from "./pages/Review";
import { CartProvider } from './context/CartContext';
import CartSidebar from './pages/CartSidebar';
import Navbar from './components/Navbar';
import Shop from './pages/Shop';
import ShopAdd from './pages/ShopAdd';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <CartSidebar /> {/* Always render sidebar at top level */}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/review" element={<Review />} />
            <Route path="/product" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/add" element={<ShopAdd />} />

          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;
