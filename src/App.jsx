import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from './Component/Navbar';
import Footer  from './Component/Footer'
import Product from './Component/HomeComponent/Product'
import SingleProduct from './Component/HomeComponent/SingleProduct'
import Cart from './Component/Cart/Cart'
import Thanku from "./Component/HomeComponent/Thanku";
import Profile from "./Component/HomeComponent/Profile";
import { CartProvider } from "./context/CartContext.jsx";



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
          <Route path="/thanku" element={<Thanku/>} />
          <Route path="/profile" element={<Profile/>} />
          </Routes>
    <Footer/>
    </Router>
    </CartProvider>
  );
};

export default App;
