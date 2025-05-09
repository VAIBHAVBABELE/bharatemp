import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from './Component/Navbar';
import Footer  from './Component/Footer'
import Product from './Component/HomeComponent/Product'
import SingleProduct from './Component/HomeComponent/SingleProduct'
import Cart from './Component/Cart/Cart'
import Checkout from './Component/Cart/Checkout'
import Thanku from "./Component/HomeComponent/Thankyou.jsx";
import Profile from "./Component/HomeComponent/Profile";
import { CartProvider } from "./context/CartContext.jsx";
import Login from "./Component/Login";
import Signup from "./Component/Signup";



const App = () => { 
  return (
    <CartProvider>
      <Router>
        <Navbar/>
        <Routes>
          {/* Route Definitions */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product/>} />
          <Route path="/product/:id" element={<SingleProduct/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/thankyou" element={<Thanku/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          </Routes>
    <Footer/>
    </Router>
    </CartProvider>
  );
};

export default App;
