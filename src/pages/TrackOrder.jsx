import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaShippingFast, FaBox, FaSearch, FaUser, FaPhone, FaEnvelope, FaUndo } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReturnOrderForm from '../Component/ReturnOrderForm';
const backend = import.meta.env.VITE_BACKEND;

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('guest');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Guest tracking form state
  const [guestForm, setGuestForm] = useState({
    orderId: '',
    contactInfo: ''
  });
  const [guestLoading, setGuestLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canReturnOrder = (order) => {
    if (order.status.toLowerCase() !== 'delivered') return false;
    if (order.return_request) return false;
    
    const orderDate = new Date(order.created_at || order.createdAt);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
    return daysDiff <= 15;
  };

  const handleReturnOrder = (order) => {
    setSelectedOrderForReturn(order);
    setShowReturnForm(true);
  };

  const handleReturnSuccess = () => {
    fetchUserOrders(); // Refresh orders
    setShowReturnForm(false);
    setSelectedOrderForReturn(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle guest tracking form submission
  const handleGuestTracking = async (e) => {
    e.preventDefault();
    
    if (!guestForm.orderId.trim() || !guestForm.contactInfo.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setGuestLoading(true);
    setTrackedOrder(null);
    
    try {
      const response = await axios.post(
        `${backend}/order/track-guest`,
        {
          orderId: guestForm.orderId.trim(),
          contactInfo: guestForm.contactInfo.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'Success') {
        setTrackedOrder(response.data.data.order);
        toast.success('Order found successfully!');
      } else {
        toast.error(response.data.data?.message || 'Order not found');
      }
    } catch (error) {
      console.error('Guest tracking error:', error);
      
      let errorMessage = 'Failed to track order';
      if (error.response?.data?.data?.message) {
        errorMessage = error.response.data.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Order not found or contact information does not match';
      }
      
      toast.error(errorMessage);
    } finally {
      setGuestLoading(false);
    }
  };
  
  // Fetch user orders for authenticated users
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
      const decoded = jwtDecode(parsedToken);
      const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

      const response = await axios.post(
        `${backend}/order/my-orders`,
        { userId },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${parsedToken}`
          }
        }
      );

      if (response.data && response.data.status === "Success") {
        const sortedOrders = response.data.data.sort((a, b) => 
          new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    // Always default to guest tab for track order by ID
    setActiveTab('guest');
  }, []);
  
  useEffect(() => {
    if (activeTab === 'user' && isLoggedIn) {
      fetchUserOrders();
      
      // Auto-refresh every 30 seconds for user orders
      let interval;
      if (autoRefresh) {
        interval = setInterval(() => {
          fetchUserOrders();
        }, 30000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [activeTab, isLoggedIn, autoRefresh]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
      {/* Breadcrumb Navigation */}
      <nav className="w-full font-[outfit] pb-6 flex flex-wrap items-center gap-2 text-[#2F294D] text-sm md:text-base font-medium">
        <Link to="/" className="hover:text-[#f7941d] transition-colors">
          Home
        </Link>
        <FaChevronRight className="text-gray-400" size={12} />
        <span className="text-[#f7941d]">Track Orders</span>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E3473] flex items-center justify-center gap-3 mb-4">
            <FaShippingFast />
            Track Your Orders
          </h1>
          <p className="text-gray-600">Enter your order details to track your shipment</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('guest')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'guest'
                  ? 'bg-[#1E3473] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#1E3473]'
              }`}
            >
              <FaSearch className="inline mr-2" />
              Track by Order ID
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setActiveTab('user')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'user'
                    ? 'bg-[#1E3473] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1E3473]'
                }`}
              >
                <FaUser className="inline mr-2" />
                My Orders
              </button>
            )}
          </div>
        </div>

        {/* Guest Tracking Form */}
        {activeTab === 'guest' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Track Your Order
              </h2>
              
              <form onSubmit={handleGuestTracking} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    value={guestForm.orderId}
                    onChange={(e) => setGuestForm({...guestForm, orderId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3473] focus:border-transparent transition-all"
                    placeholder="Enter your order ID"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={guestForm.contactInfo}
                      onChange={(e) => setGuestForm({...guestForm, contactInfo: e.target.value})}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3473] focus:border-transparent transition-all"
                      placeholder="Enter email or phone number"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {guestForm.contactInfo.includes('@') ? (
                        <FaEnvelope className="text-gray-400" />
                      ) : (
                        <FaPhone className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={guestLoading}
                  className="w-full bg-[#1E3473] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#162554] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {guestLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      Track Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tracked Order Display */}
        {trackedOrder && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Order #{trackedOrder._id.slice(-8).toUpperCase()}
                </h3>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trackedOrder.status)}`}>
                  {trackedOrder.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p className="text-lg font-semibold">{formatDate(trackedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-[#F7941D]">₹{trackedOrder.totalPrice?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Status</p>
                  <p className={`text-lg font-semibold ${
                    trackedOrder.payment_status === 'Paid' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trackedOrder.payment_status || 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Delivery Address</p>
                <p className="text-gray-900">
                  {trackedOrder.shippingAddress}, {trackedOrder.city}, {trackedOrder.state} - {trackedOrder.pincode}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-3">Items Ordered</p>
                <div className="space-y-3">
                  {trackedOrder.products.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product_id.product_image_main}
                        alt={item.product_id.product_name}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product_id.product_name}</h4>
                        <p className="text-sm text-gray-500">SKU: {item.product_id.sku}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {trackedOrder.waybill && (
                  <button
                    onClick={() => window.open(trackedOrder.trackingUrl, '_blank')}
                    className="bg-[#F7941D] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e38616] transition-colors flex items-center justify-center gap-2"
                  >
                    <FaShippingFast />
                    Track Live Status
                  </button>
                )}
                
                {canReturnOrder(trackedOrder) && (
                  <button
                    onClick={() => handleReturnOrder(trackedOrder)}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUndo />
                    Return Order
                  </button>
                )}
                
                {trackedOrder.return_request && (
                  <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl text-center font-medium">
                    Return Request Submitted
                  </div>
                )}
              </div>
              
              {trackedOrder.waybill && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Waybill: {trackedOrder.waybill}
                </p>
              )}
            </div>
          </div>
        )}

        {/* User Orders */}
        {activeTab === 'user' && isLoggedIn && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">My Orders</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  Auto-refresh (30s)
                </label>
                <button
                  onClick={fetchUserOrders}
                  className="px-4 py-2 bg-[#1E3473] text-white rounded-lg hover:bg-[#162554] text-sm"
                >
                  Refresh Orders
                </button>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg shadow-sm p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium">Placed on</p>
                            <p>{formatDate(order.created_at || order.createdAt)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Delivery Address</p>
                            <p className="line-clamp-1">{order.shippingAddress}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Amount</p>
                            <p className="text-[#F7941D] font-bold">₹{order.totalPrice?.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="font-medium text-sm mb-2">Items</p>
                          <div className="flex flex-wrap gap-2">
                            {order.products.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                                <img
                                  src={item.product_id.product_image_main}
                                  alt={item.product_id.product_name}
                                  className="w-10 h-10 object-contain rounded"
                                />
                                <span className="text-sm">
                                  {item.product_id.product_name} x {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <button 
                          className="bg-[#1E3473] text-white px-4 py-2 rounded-lg hover:bg-[#162554] transition-colors flex items-center justify-center gap-2 text-sm"
                          onClick={() => {
                            if (order.waybill) {
                              window.open(`https://bharatronix.ithinklogistics.co.in/postship/tracking/${order.waybill}`, "_blank");
                            } else {
                              window.location.href = '/track-order';
                            }
                          }}
                        >
                          <FaShippingFast />
                          Track
                        </button>
                        
                        {canReturnOrder(order) && (
                          <button
                            onClick={() => handleReturnOrder(order)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                          >
                            <FaUndo />
                            Return
                          </button>
                        )}
                        
                        {order.return_request && (
                          <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-xs font-medium text-center">
                            Return Requested
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Login Prompt for Guest Users */}
        {!isLoggedIn && (
          <div className="text-center mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                Want to see all your orders in one place?
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FaUser />
                Login to Your Account
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Return Order Form Modal */}
      {showReturnForm && selectedOrderForReturn && (
        <ReturnOrderForm
          order={selectedOrderForReturn}
          onClose={() => {
            setShowReturnForm(false);
            setSelectedOrderForReturn(null);
          }}
          onSuccess={handleReturnSuccess}
        />
      )}
      
      <ToastContainer />
    </div>
  );
};

export default TrackOrder;