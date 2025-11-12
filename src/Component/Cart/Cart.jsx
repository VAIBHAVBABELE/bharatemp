import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaArrowLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const backend = import.meta.env.VITE_BACKEND;

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Calculate total amount using discounted price or bulk price
  const calculateTotalAmount = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.isBulkOrder 
        ? Number(item.price || 0)
        : Number(item.discounted_single_product_price || 0);
      return sum + price * item.quantity;
    }, 0);
  };

  // Calculate the total MRP (original price)
  const calculateTotalMRP = () => {
    return cartItems.reduce((sum, item) => {
      const mrp = item.isBulkOrder 
        ? Number(item.originalPrice || item.discounted_single_product_price || 0)
        : Number(item.discounted_single_product_price || 0);
      return sum + mrp * item.quantity;
    }, 0);
  };

  const totalAmount = calculateTotalAmount();
  const totalMRP = calculateTotalMRP();

  // // Calculate the discount (difference between MRP and discounted price)
  // const codeDiscount = 15;
  // const shippingFee = 5;
  // const discountOnMrp = Math.round((totalMRP - totalAmount) * 100) / 100;

  // Calculate final total using only discounted priced
  const finalTotal = Math.max(0, totalAmount - couponDiscount);

  // Validate coupon function
  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setValidatingCoupon(true);
      const response = await axios.post(`${backend}/coupon/validate-coupon`, {
        code: couponCode.toUpperCase()
      });

      if (response.data.status === "Success") {
        const coupon = response.data.data.coupon;
        
        // Check if coupon is expired
        const now = new Date();
        const expiryDate = new Date(coupon.expiryDate);
        
        if (now > expiryDate) {
          toast.error("This coupon has expired");
          return;
        }

        const discount = Math.round((totalAmount * coupon.discountPercentage) / 100);
        applyCoupon(coupon, discount);
        toast.success(`Coupon applied! ${coupon.discountPercentage}% discount (₹${discount})`);
        setCouponCode("");
      }
    } catch (error) {
      console.error("Coupon validation error:", error);
      toast.error(error.response?.data?.data?.message || "Invalid or expired coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info("Coupon removed");
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    window.scrollTo(0, 0);
  }, []);

  // Handle checkout - check if user is logged in first
  const handleCheckout = () => {
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      toast.warning("Please login to proceed with checkout");
      setTimeout(() => {
        navigate("/login", { state: { from: "cart" } });
      }, 1500);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-10">
        <div className="text-center py-2">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <button
            onClick={() => navigate("/product")}
            className="bg-[#f7941d] text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-6 min-h-screen font-[outfit]">
      <ToastContainer />
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="w-full font-[outfit] pb-6 flex flex-wrap items-center gap-2 text-[#2F294D] text-sm md:text-base font-medium px-4 py-4 mt-4">
          <button
            onClick={handleBack}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full hover:bg-[#e88a1a] transition-colors"
          >
            <FaArrowLeft size={12} />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-[#f7941d] transition-colors">
              Home
            </Link>
            <FaChevronRight className="text-gray-400" size={12} />

            <Link
              to="/allproducts"
              className="hover:text-[#f7941d] transition-colors"
            >
              All Products
            </Link>
            <FaChevronRight className="text-gray-400" size={12} />

            <span className="text-[#f7941d]">
              Shopping Cart ({cartItems.length} items{cartItems.some(item => item.isBulkOrder) ? ' - Bulk Orders Included' : ''})
            </span>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Cart Items Section */}
          <div className="p-6 md:w-[65%]">
            <h1 className="text-xl font-bold text-gray-800 mb-4">
              Current Order
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {cartItems.some(item => item.isBulkOrder) 
                ? "Your cart includes bulk order items with special pricing"
                : "The sum of all total payments for goods there"
              }
            </p>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex border-2 border-gray-300 rounded-2xl p-4 flex-col md:flex-row mb-4 items-start"
              >
                <div className="w-32 h-32 flex items-center justify-center mr-4">
                  <img
                    src={item.product_image_main || ""}
                    alt={item.product_name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-between w-full h-32">
                  <div className="flex flex-row justify-between items-start w-full">
                    <div>
                      <h3
                        className="font-medium text-[#2F294D] text-lg cursor-pointer hover:text-[#f7941d]"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        {item.product_name}
                      </h3>
                      {item.isBulkOrder && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-[#f7941d] text-white text-xs px-2 py-1 rounded-full">
                            Bulk Order
                          </span>
                          <span className="text-xs text-gray-600">
                            Range: {item.bulkRange}
                          </span>
                        </div>
                      )}
                      {item.no_of_product_instock !== undefined && (
                        <p className={`text-sm mt-1 ${
                          item.no_of_product_instock > 0 
                            ? item.no_of_product_instock < 5 
                              ? 'text-orange-600' 
                              : 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {item.no_of_product_instock > 0 
                            ? `${item.no_of_product_instock} in stock`
                            : 'Out of stock'
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col h-full items-end justify-between">
                    <div className="text-right">
                      <span className="font-bold text-[#1E3473] text-xl">
                        ₹{" "}
                        {Number(
                          item.isBulkOrder ? item.price : item.discounted_single_product_price
                        ).toLocaleString()}
                      </span>
                      {item.isBulkOrder && item.originalPrice && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="line-through">₹{item.originalPrice}</span>
                          <span className="text-green-600 ml-1">
                            ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      {!item.isBulkOrder ? (
                        <div className="flex items-center border border-gray-300 rounded-md mr-3">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                decreaseQuantity(item._id);
                              }
                            }}
                            className={`w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 ${
                              item.quantity <= 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (item.no_of_product_instock && item.quantity >= item.no_of_product_instock) {
                                toast.warning(`Only ${item.no_of_product_instock} items available in stock`);
                                return;
                              }
                              increaseQuantity(item._id);
                            }}
                            className={`w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 ${
                              item.no_of_product_instock && item.quantity >= item.no_of_product_instock
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center mr-3">
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Section */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Apply Coupon</h3>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-600 font-medium">
                      ✓ {appliedCoupon.code} - {appliedCoupon.discountPercentage}% off (₹{couponDiscount})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d] focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
                  />
                  <button
                    onClick={validateCoupon}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#e8851a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validatingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center flex-wrap gap-2">
              <button
                onClick={() => {
                  clearCart();
                  window.location.reload();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Clear Cart
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const hasEligibleProducts = cartItems.some(item => item.no_of_product_instock > 10);
                    if (hasEligibleProducts) {
                      // Navigate to first eligible product for bulk order
                      const eligibleProduct = cartItems.find(item => item.no_of_product_instock > 10);
                      navigate(`/product/${eligibleProduct._id}`);
                    } else {
                      // Show nice popup instead of error
                      const modal = document.createElement('div');
                      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4';
                      modal.innerHTML = `
                        <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                          <div class="text-center">
                            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                              </svg>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-2">No Bulk Orders Available</h3>
                            <p class="text-gray-600 mb-6">None of the products in your cart have sufficient stock (10+ units) for bulk ordering.</p>
                            <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#e88a1a] transition-colors">Got it</button>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(modal);
                    }
                  }}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    cartItems.some(item => item.no_of_product_instock > 10)
                      ? "border-[#f7941d] text-[#f7941d] hover:bg-[#f7941d] hover:text-white cursor-pointer"
                      : "border-gray-300 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Bulk Order
                </button>
                <button
                  onClick={() => navigate("/product")}
                  className="px-4 py-2 bg-[#1e3473] text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="bg-gray-50 rounded-xl p-6 md:w-[35%]">
            <h2 className="text-xl font-bold text-[#2F294D] mb-6">Summary</h2>
            <div className="space-y-4 text-[#2F294D]">
              <div className="flex justify-between">
                <span className="text-gray-600">Total MRP</span>
                <span className="font-medium">₹{totalMRP.toFixed(2)}</span>
              </div>
              {totalMRP > totalAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bulk Discount</span>
                  <span className="font-medium text-green-600">
                    -₹{(totalMRP - totalAmount).toFixed(2)}
                  </span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-medium text-green-600">
                    -₹{couponDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18% tax)</span>
                <span className="font-medium">
                  ₹{(finalTotal * 0.18).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="flex justify-between font-bold text-xl text-[#2F294D]">
                <span>Total Amount</span>
                <span>₹{(finalTotal * 1.18).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#f7941d] cursor-pointer  text-white py-3 rounded-md font-medium mt-4 flex items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M9 22H15C19.02 22 19.74 20.39 19.95 18.43L20.7 12.43C20.97 9.99 20.27 8 16 8H8C3.73 8 3.03 9.99 3.3 12.43L4.05 18.43C4.26 20.39 4.98 22 9 22Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 7.67V6.7C7.5 4.45 9.31 2.24 11.56 2.03C14.24 1.77 16.5 3.88 16.5 6.51V7.89"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
