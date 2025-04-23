import React from 'react';
import {  Routes, Route } from 'react-router-dom';
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
import ConfirmationPage from './pages/Confirmation';




import VintageDenimJacket from "./pages/products/VintageDenimJacket";
import FloralSummerDress from "./pages/products/FloralSummerDress";
import SustainableCottonSweater from "./pages/products/SustainableCottonSweater";
import DesignerLeatherBoots from "./pages/products/DesignerLeatherBoots";
import EcoFriendlyYogaPants from "./pages/products/EcoFriendlyYogaPants";
import VintageGraphicTShirt from "./pages/products/VintageGraphicTShirt";
import DesignerHandbag from "./pages/products/DesignerHandbag";
import WoolWinterScarf from "./pages/products/WoolWinterScarf";

import LinaGeorge from './pages/sellers/LinaGeorge';
import AlishaMorgan from './pages/sellers/AlishaMorgan';
import AanyaPatel from './pages/sellers/AanyaPatel';
import RachelLim from './pages/sellers/RachelLim';
import JaneDoe from './pages/sellers/JaneDoe';
import OliviaChen from './pages/sellers/OliviaChen';
import KiaraThomas from './pages/sellers/KiaraThomas';
import PriyaDesai from './pages/sellers/PriyaDesai';
function App() {
  return (
    <CartProvider>
      <div className="App">
      
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
            <Route path="/confirmation" element={<ConfirmationPage />} />


            <Route path="/product/vintage-denim-jacket" element={<VintageDenimJacket />} />
            <Route path="/product/floral-summer-dress" element={<FloralSummerDress />} />
            <Route path="/product/sustainable-cotton-sweater" element={<SustainableCottonSweater />} />
            <Route path="/product/designer-leather-boots" element={<DesignerLeatherBoots />} />
            <Route path="/product/ecofriendly-yoga-pants" element={<EcoFriendlyYogaPants />} />
            <Route path="/product/vintage-graphic-tshirt" element={<VintageGraphicTShirt />} />
            <Route path="/product/designer-handbag" element={<DesignerHandbag />} />
            <Route path="/product/wool-winter-scarf" element={<WoolWinterScarf />} />

            <Route path="/seller/alisha-morgan" element={<AlishaMorgan />} />
            <Route path="/seller/priya-desai" element={<PriyaDesai />} />
            <Route path="/seller/aanya-patel" element={<AanyaPatel />} />
            <Route path="/seller/rachel-lim" element={<RachelLim />} />
            <Route path="/seller/jane-doe" element={<JaneDoe />} />
            <Route path="/seller/olivia-chen" element={<OliviaChen />} />
            <Route path="/seller/kiara-thomas" element={<KiaraThomas />} />
            <Route path="/seller/lina-george" element={<LinaGeorge />} />

          </Routes>
            
      </div>
    </CartProvider>
  );
}

export default App;