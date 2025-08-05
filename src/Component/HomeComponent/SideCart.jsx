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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 font-[Outfit]"
            onClick={onClose}
          />
          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white z-50 shadow-xl rounded-l-3xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#2F294D]">Current Order</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-1">The sum of all total payments for goods there</p>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 mb-6 pb-2 ">
                    <img
                      src={item.product_image_main || ''}
                      alt={item.product_name}
                      className="w-24 h-24 object-contain mr-6"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F294D]">{item.product_name}</h3>
                      <div className="flex items-baseline gap-6 mt-1">
                        <span className="text-xl font-bold text-[#1e3473]">
                          ₹{((item.discounted_single_product_price || item.non_discounted_price) * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold line-through">
                          MRP ₹{(item.non_discounted_price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-[#F7941D]">
                          {item.discount}% Off
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-xl"
                        >
                          −
                        </button>
                        <span className="text-lg">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-xl"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="p-6 bg-gray-50 shadow-2xl">
                <h3 className="text-lg font-bold text-[#2F294D] mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Total MRP</span>
                    <span>₹{summary.totalMRP.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18% tax)</span>
                    <span>₹{summary.gst.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <span className="text-lg font-bold text-[#2F294D]">Total Amount</span>
                  <span className="text-xl font-bold text-[#2F294D]">₹{summary.total}</span>
                </div>
                <div className="flex gap-4 mt-6">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-[#F7941D] text-white rounded-xl font-medium text-center"
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-[#1e3473] text-white rounded-xl font-medium text-center"
                  >
                    Buy Now
                  </Link>
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