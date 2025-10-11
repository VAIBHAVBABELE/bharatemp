import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const SideCart = ({ isOpen, onClose }) => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const calculateSummary = () => {
    const summary = {
      totalMRP: 0,
      codeDiscount: 15.00,
      shippingFees: 5.00,
      discountOnMRP: 0,
      gst: 0,
      total: 0
    };

    cartItems.forEach(item => {
      const itemPrice = item.discounted_single_product_price || item.non_discounted_price;
      summary.totalMRP += itemPrice * item.quantity;
      // Calculate discount as 10% of item total
      summary.discountOnMRP += (itemPrice * item.quantity * 0.1);
    });

    // Calculate GST on total MRP
    summary.gst = summary.totalMRP * 0.18;

    // Total should be: Total MRP + GST (removing other deductions for now)
    summary.total = (summary.totalMRP + summary.gst).toFixed(2);

    return summary;
  };

  const summary = calculateSummary();


  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] font-[Outfit]"
            onClick={onClose}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[500px] bg-white z-[9999] shadow-xl sm:rounded-l-3xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-4 sm:px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-bold text-[#2F294D]">Current Order</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 cursor-pointer hover:text-gray-700 p-2"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">The sum of all total payments for goods there</p>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 border-b border-gray-100 last:border-b-0">
                    <img
                      src={item.product_image_main || ''}
                      alt={item.product_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2F294D] line-clamp-2">{item.product_name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mt-1">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-[#1e3473]">
                          ₹{((item.discounted_single_product_price || item.non_discounted_price) * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-500 font-semibold line-through">
                            MRP ₹{(item.non_discounted_price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#F7941D]">
                            {item.discount}% Off
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                decreaseQuantity(item._id);
                              }
                            }}
                            className={`w-7 h-7 sm:w-8 sm:h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-lg sm:text-xl ${
                              item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="text-base sm:text-lg font-medium min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item._id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-lg sm:text-xl hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t">
                <h3 className="text-base sm:text-lg font-bold text-[#2F294D] mb-3">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total MRP</span>
                    <span>₹{summary.totalMRP.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (18% tax)</span>
                    <span>₹{summary.gst.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <span className="text-base sm:text-lg font-bold text-[#2F294D]">Total Amount</span>
                  <span className="text-lg sm:text-xl font-bold text-[#2F294D]">₹{summary.total}</span>
                </div>
                <div className="space-y-2 mt-4">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full px-4 py-3.5 bg-[#1e3473] text-white rounded-xl font-semibold text-center text-base sm:text-sm hover:bg-[#1a2d5f] transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="block sm:hidden">Buy Now</span>
                    <span className="hidden sm:block">Buy Now ({cartItems.length})</span>
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/checkout"
                      onClick={onClose}
                      className="px-3 py-2.5 bg-[#F7941D] text-white rounded-lg font-medium text-center text-sm hover:bg-[#e88a1a] transition-colors"
                    >
                      Checkout
                    </Link>
                    
                    <button
                      onClick={() => {
                        const hasEligibleProducts = cartItems.some(item => item.no_of_product_instock > 10);
                        if (hasEligibleProducts) {
                          onClose();
                          const eligibleProduct = cartItems.find(item => item.no_of_product_instock > 10);
                          window.location.href = `/product/${eligibleProduct._id}`;
                        } else {
                          const modal = document.createElement('div');
                          modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4';
                          modal.innerHTML = `
                            <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                              <div class="text-center">
                                <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                                  </svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-900 mb-2">No Bulk Orders Available</h3>
                                <p class="text-sm text-gray-600 mb-4">None of the products in your cart have sufficient stock (10+ units) for bulk ordering.</p>
                                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-[#f7941d] text-white rounded-lg hover:bg-[#e88a1a] transition-colors text-sm">Got it</button>
                              </div>
                            </div>
                          `;
                          document.body.appendChild(modal);
                        }
                      }}
                      className={`px-3 py-2.5 border rounded-lg font-medium text-center text-sm transition-colors ${
                        cartItems.some(item => item.no_of_product_instock > 10)
                          ? "border-[#1e3473] text-[#1e3473] hover:bg-[#1e3473] hover:text-white cursor-pointer"
                          : "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
                      }`}
                    >
                      Bulk
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SideCart; 