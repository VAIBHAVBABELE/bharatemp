import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import shop from "../../assets/shop.png";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Section1 from "../HomeComponent/Section1";
import { fetchProducts } from "../../utils/api";
const backend = import.meta.env.VITE_BACKEND;

// Bulk order pricing data
const bulkPriceData = [
  { range: "3-4", price: "₹50,080" },
  { range: "1-2", price: "₹25,000" },
  { range: "2-3", price: "₹35,040" },
  { range: "4-5", price: "₹60,100" },
  { range: "5-6", price: "₹75,150" }
];

export default function ProductCard() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBulkOrder, setShowBulkOrder] = useState(false);
  const [bulkOrderForm, setBulkOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedBulkRange, setSelectedBulkRange] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch from API
        const response = await axios.get(`${backend}/product/${id}`);
        
        if (response.data.status === "Success" && response.data.data.product) {
          setProduct(response.data.data.product);
        } else {
          // If API doesn't return a product, try getting from localStorage as fallback
          const selectedProduct = localStorage.getItem("selectedProduct");
          if (selectedProduct) {
            const parsedProduct = JSON.parse(selectedProduct);
            setProduct(parsedProduct);
          } else {
            setError("Product not found");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        
        // Try to get from localStorage as fallback
        const selectedProduct = localStorage.getItem("selectedProduct");
        if (selectedProduct) {
          const parsedProduct = JSON.parse(selectedProduct);
          setProduct(parsedProduct);
        } else {
          setError("Failed to load product data");
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductData();
      window.scrollTo(0, 0);
    }
  }, [id]);



  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch products from the backend
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    };
    
    getProducts();
  }, []);

  // Navigate back to products page
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  // Handle Buy Now button
  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      // Navigate to checkout page
      navigate("/cart");
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleBulkOrderClick = () => {
    setShowBulkOrder(true);
  };

  const handleCloseBulkOrder = () => {
    setShowBulkOrder(false);
  };

  const handleBulkOrderSubmit = (e) => {
    e.preventDefault();
    // Handle bulk order submission
    console.log("Bulk order form submitted:", bulkOrderForm);
    setShowBulkOrder(false);
  };

  const handleBulkOrderInputChange = (e) => {
    setBulkOrderForm({
      ...bulkOrderForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleBulkRangeSelect = (range) => {
    setSelectedBulkRange(range);
  };

  const handleBulkAddToCart = () => {
    if (selectedBulkRange) {
      // Add bulk items to cart
      console.log("Adding bulk items to cart:", selectedBulkRange);
      setShowBulkOrder(false);
    }
  };

  const handleBulkBuyNow = () => {
    if (selectedBulkRange) {
      // Process bulk buy now
      console.log("Processing bulk buy now:", selectedBulkRange);
      setShowBulkOrder(false);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col justify-center items-center h-screen">
        <FaSpinner className="text-[#1e3473] text-4xl animate-spin mb-4" />
        <div className="text-gray-700 font-semibold">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 font-semibold mb-4">{error}</div>
        <button 
          onClick={handleBack}
          className="px-4 py-2 bg-[#1e3473] text-white rounded-lg"
        >
          Go Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 flex justify-center items-center h-screen">
        <div className="text-gray-700 font-semibold">Product not found</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 font-[outfit] relative">
      {/* Breadcrumb Navigation */}
      <div className="w-full font-[outfit] pb-10 flex md:flex-row flex-col items-center justify-between text-[#2F294D] text-sm font-medium px-4 py-2 mt-4 ">
        <div className="flex items-center flex-wrap gap-3">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full"
          >
            <FaArrowLeft size={12} />
          </button>
          <span className="text-base">
            Back to products | Listed in category:{" "}
            <Link to="/product" className="font-semibold hover:text-[#f7941d]">
              All Products
            </Link>
          </span>
          <div className="text-[#2F294D] pl-0 md:pl-10 font-semibold whitespace-nowrap">
            Single Product Page
        </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col gap-10 justify-between lg:flex-row">
        {/* Left: Product Images */}
        <div className="w-full lg:w-[45%]">
          <div className="bg-white rounded-lg mb-4">
            <img
              src={
                product.image && product.image.length > 0
                  ? product.image[0]
                  : shop
              }
              alt={product.name}
              className="w-full h-[400px] object-contain"
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-[#1e3473]"
              >
                <img 
                  src={
                    product.image && product.image[index - 1]
                      ? product.image[index - 1]
                      : shop
                  }
                  alt={`${product.name} thumbnail ${index}`}
                  className="w-full h-[100px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-[45%] space-y-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2F294D]">
              {product.name}
              <span className="ml-4 inline-block px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-full">
                In stock
                </span>
            </h1>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-[#FFB800]">
              {[1, 2, 3, 4].map((star) => (
                <FaStar key={star} className="w-5 h-5" />
              ))}
              <FaStarHalfAlt className="w-5 h-5" />
            </div>
            <span className="text-gray-600">4.5</span>
            <span className="text-gray-400">from 392 Reviews</span>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="text-gray-500 text-sm">
              ₹2345 (incl. of all taxes)
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#162554]">₹50,080</span>
              <span className="text-sm text-gray-500">+₹41 Shipping</span>
            </div>
          <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through">MRP ₹3,029.50</span>
              <span className="text-[#F7941D] font-medium">55% Off</span>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={decrementQuantity}
              className="w-10 h-10 rounded-full border cursor-pointer border-gray-300 flex items-center justify-center text-xl font-bold"
            >
              −
            </button>
            <span className="text-xl">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="w-10 h-10 rounded-full border cursor-pointer border-gray-300 flex items-center justify-center text-xl font-bold"
            >
              +
            </button>

            <button 
              onClick={handleBulkOrderClick} 
              className="px-6 py-2 bg-[#F7941D] cursor-pointer text-white rounded-3xl"
            >
              Bulk Orders
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleBuyNow}
              className="w-[200px] bg-[#1e3473] text-white py-3 rounded-2xl cursor-pointer font-medium hover:bg-[#162554] transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M4 11h16M4 11a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z"
                  strokeWidth="2"
                />
                <path d="M8 11V7a4 4 0 018 0v4" strokeWidth="2" />
              </svg>
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              "Wifi Integrated",
              "Integrated Wi-Fi module",
              "Low-power consumption design",
              "Enhanced thermal management system",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#1e3473]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Service Info */}
          <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4="
                alt="Transparent"
                className="w-6 h-6"
              />
              <div className="flex flex-col">
                <span className="font-medium">Transparent</span>
                <span>Customer service</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgMTJoMTRNMTIgNWw3IDctNyA3IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg=="
                alt="Shipping"
                className="w-6 h-6"
              />
              <div className="flex flex-col">
                <span className="font-medium">Shipping</span>
                <span>Free, fast and reliable in India</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJsMiAyIDQtNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4="
                alt="Secure"
                className="w-6 h-6"
              />
              <div className="flex flex-col">
                <span className="font-medium">Secure</span>
                <span>Certified marketplace</span>
                </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://randomuser.me/api/portraits/thumb/men/${i}.jpg`}
                  alt="user"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <span className="text-gray-500 text-base font-semibold">
              1,241 Sold in the last 24 hours
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#2F294D]">Description</h2>
            <p className="text-gray-500 mb-2 text-base font-semibold">
              Raspberry Pi 4 Model B is the latest product in the popular
              Raspberry Pi range of computers. It offers ground-breaking
              increases in processor speed, multimedia performance, memory; and
              connectivity compared....
            </p>
            <button className="bg-[#1e3473] text-white px-4 py-2 rounded-xl font-medium mb-4">
              More Details
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Order Sidebar */}
      {showBulkOrder && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={handleCloseBulkOrder}
          />
          
          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white z-50 shadow-xl rounded-l-3xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-[#1e3473]">Bulk Order Discounts</h2>
                  <button 
                    onClick={handleCloseBulkOrder}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm">Order for Bulk Items</p>
              </div>

              {/* Price Table Header */}
              <div className="px-6">
              <div className="bg-[#1e3473] text-white px-6 py-2 grid grid-cols-4 text-sm rounded-xl">
                <span className="col-span-1 ">Select</span>
                <span className="col-span-1 text-center">Quantity</span>
                <span className="col-span-2 text-center">Discounted Price per piece</span>
              </div>
              </div>

              {/* Price Table Body */}
              <div className="flex-1 overflow-y-auto py-2 px-6">
                {bulkPriceData.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => handleBulkRangeSelect(item.range)}
                    className={`grid grid-cols-4 items-center py-2 border-b border-gray-100 cursor-pointer ${
                      selectedBulkRange === item.range ? 'bg-blue-50 border border-gray-800 rounded-xl px-6' : 'px-6'
                    }`}
                  >
                    <div className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full border-2 ${
                          selectedBulkRange === item.range 
                            ? 'border-[#f7941d] bg-[#f7941d]' 
                            : 'border-gray-300'
                        } flex items-center justify-center`}
                      >
                        {selectedBulkRange === item.range && (
                          <div className="w-2 h-2 rounded-full  bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-600 text-center">{item.range}</span>
                    <span className="text-[#1e3473] col-span-2 text-center font-medium">{item.price}</span>
                  </div>
                ))}
                  <div className="py-4 border-t border-gray-200">
                <div className="flex justify-between gap-10">
                  <button
                    onClick={handleBulkAddToCart}
                    className="flex-1 px-4 py-2 bg-[#f7941d] text-white rounded-xl font-medium hover:bg-[#e88a1a] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 20a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zm-7-3h7a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" strokeWidth="2"/>
                    </svg>
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBulkBuyNow}
                    className="flex-1 px-4 py-2 bg-[#1e3473] text-white rounded-xl font-medium hover:bg-[#162554] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2"/>
                    </svg>
                    Buy Now
                  </button>
                </div>
              </div>
              </div>
              <div className="p-6">
              <div className="bg-[#1e3473] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Get Customised Price</h3>
                <form onSubmit={handleBulkOrderSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={bulkOrderForm.name}
                      onChange={handleBulkOrderInputChange}
                      className="w-full p-2 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={bulkOrderForm.email}
                      onChange={handleBulkOrderInputChange}
                      className="w-full p-2 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={bulkOrderForm.phone}
                      onChange={handleBulkOrderInputChange}
                      className="w-full p-2 rounded-xl bg-white text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#F7941D] text-white rounded-xl font-medium hover:bg-[#e88a1a] transition-colors"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
              </div>
            </div>
          </div>
        </>
      )}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3473]"></div>
        </div>
      ) : (
        <Section1 products={products} />
      )}
    </div>
  );
}