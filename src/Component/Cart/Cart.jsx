import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaPlus, FaMinus, FaTrash, FaArrowLeft } from 'react-icons/fa';


const Cart = () => {
  const {
    cartItems,
    totalItems,
    uniqueItems,
    totalAmount,
    shipping,
    tax,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  } = useCart();

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Calculate the discount (assume 10% off MRP for this example)
  const codeDiscount = 15;
  const platformFee = 5;
  const shippingFee = 5;
  const discountOnMrp = Math.round(totalAmount * 0.01 * 100) / 100;
  
  // Calculate final total
  const finalTotal = totalAmount + platformFee + shippingFee - codeDiscount - discountOnMrp;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto my-10">
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <button 
            onClick={() => navigate('/product')} 
            className="bg-[#f7941d] text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-6 min-h-screen font-[outfit]">
      <div className="container mx-auto px-4">
        <div className="w-full font-[outfit] flex md:flex-row flex-col items-center justify-between text-[#2F294D] text-sm font-medium px-4 py-2 mt-4 ">
          <div className="flex items-center flex-wrap gap-3">
            <button 
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full"
            >
              <FaArrowLeft size={12} />
            </button>
            <span className="text-base">
              Back to products | Listed in category:{" "}
              <Link to="/product" className="font-semibold hover:text-[#f7941d]">All Products</Link>
            </span>
            <div className="text-[#2F294D] pl-0 md:pl-10 font-semibold whitespace-nowrap">
              My Cart
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Cart Items Section */}
          <div className="p-6 md:w-[65%]">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Current Order</h1>
            <p className="text-gray-500 text-sm mb-6">The sum of all total payments for goods there</p>

            {cartItems.map((item) => (
              <div key={item.id} className="flex border-2 border-gray-300 rounded-2xl p-4 flex-col md:flex-row mb-4 items-start">
                <div className="w-32 h-32 flex items-center justify-center mr-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-between w-full h-32">
                  <div className="flex flex-row justify-between items-start w-full">
                    <h3 
                      className="font-medium text-[#2F294D] text-lg cursor-pointer hover:text-[#f7941d]"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex flex-col h-full items-end justify-between">
                    <span className="font-bold text-[#1E3473] text-xl">₹ {item.price.toLocaleString()}</span>

                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-8 text-center border-none focus:outline-none"
                      />
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="bg-gray-50 rounded-xl p-6 md:w-[35%]">
            <h2 className="text-xl font-bold text-[#2F294D] mb-6">Summary</h2>
            <div className="space-y-4 text-[#2F294D]">
              <div className="flex justify-between">
                <span className="text-gray-600">Total MRP</span>
                <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Code Discount</span>
                <span className="font-medium">₹{codeDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">Platform fees</span>
                  <button className="ml-2 text-blue-700 text-sm font-medium">Know more</button>
                </div>
                <span className="font-medium">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">Shipping fees</span>
                  <button className="ml-2 text-blue-700 text-sm font-medium">Know more</button>
                </div>
                <span className="font-medium">₹{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-4">
                <span className="text-gray-600">Discount on MRP</span>
                <span className="font-medium text-green-600">₹{discountOnMrp.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="flex justify-between font-bold text-xl text-[#2F294D]">
                <span>Total Amount</span>
                <span>₹ {finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#f7941d] cursor-pointer  text-white py-3 rounded-md font-medium mt-4 flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M9 22H15C19.02 22 19.74 20.39 19.95 18.43L20.7 12.43C20.97 9.99 20.27 8 16 8H8C3.73 8 3.03 9.99 3.3 12.43L4.05 18.43C4.26 20.39 4.98 22 9 22Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.5 7.67V6.7C7.5 4.45 9.31 2.24 11.56 2.03C14.24 1.77 16.5 3.88 16.5 6.51V7.89" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
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