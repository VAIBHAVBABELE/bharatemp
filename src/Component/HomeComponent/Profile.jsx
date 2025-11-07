import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes, FaCopy, FaCheck } from "react-icons/fa";
import ReturnOrderForm from '../ReturnOrderForm';
import ZohoInvoiceViewer from '../ZohoInvoice/ZohoInvoiceViewer';
import "react-toastify/dist/ReactToastify.css";
const backend = import.meta.env.VITE_BACKEND;

const OrderModal = ({ order, onClose, onOrderUpdate }) => {
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    const cancellableStatuses = ['Pending', 'Processing'];
    const orderAge = Date.now() - new Date(order.created_at).getTime();
    const maxCancelTime = 24 * 60 * 60 * 1000; // 24 hours
    
    return cancellableStatuses.includes(order.status) && orderAge < maxCancelTime;
  };
  
  // Copy Order ID to clipboard
  const copyOrderId = async () => {
    if (order._id) {
      try {
        await navigator.clipboard.writeText(order._id);
        setCopied(true);
        toast.success('Order ID copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = order._id;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success('Order ID copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        return;
      }
      
      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
      
      const response = await axios.post(
        `${backend}/order/${order._id}/cancel`,
        {
          reason: 'User requested cancellation'
        },
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'Success') {
        toast.success('Order cancelled successfully!');
        setShowCancelConfirm(false);
        onClose();
        if (onOrderUpdate) onOrderUpdate();
      } else {
        toast.error(response.data.data?.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      
      let errorMessage = 'Failed to cancel order';
      if (error.response?.data?.data?.message) {
        errorMessage = error.response.data.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You can only cancel your own orders.';
      }
      
      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  // Calculate total price from products
  const calculateTotalPrice = () => {
    return order.products.reduce((total, product) => {
      return total + (product.product_id.discounted_single_product_price * product.quantity);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FaTimes size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Order Summary */}
          <div className="bg-gradient-to-r from-[#F7941D] to-[#e38616] p-6 rounded-xl text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h4>
                  <button
                    onClick={copyOrderId}
                    className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                    title="Copy full Order ID"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="text-green-300" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        <span className="text-xs">Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-white/90 text-sm">
                  Full ID: {order._id}
                </p>
                <p className="text-white/90 mt-1">
                  Placed on: {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/90 text-sm">Total Amount</p>
                <span className="text-2xl font-bold">
                  ₹{calculateTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
            <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
              Status: {order.status}
            </div>
          </div>

          {/* Shipping & Delivery Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipping Details */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Shipping Details
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-gray-800">Name:</span> <span className="text-gray-700">{order.user_id?.name || order.name || 'Guest User'}</span></p>
                <p><span className="font-medium text-gray-800">Email:</span> <span className="text-gray-700">{order.user_id?.email || order.email || 'N/A'}</span></p>
                <p><span className="font-medium text-gray-800">Address:</span> <span className="text-gray-700">{order.shippingAddress || 'N/A'}</span></p>
                <p><span className="font-medium text-gray-800">City:</span> <span className="text-gray-700">{order.city || 'N/A'}</span></p>
                <p><span className="font-medium text-gray-800">Pincode:</span> <span className="text-gray-700">{order.pincode || 'N/A'}</span></p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6 0h6" />
                </svg>
                Delivery Information
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-gray-800">Expected Delivery:</span> <span className="text-gray-700">{order.expectedDelivery ? formatDate(order.expectedDelivery) : 'N/A'}</span></p>
                <p><span className="font-medium text-gray-800">Shipping Cost:</span> <span className="text-gray-700">₹{order.shippingCost || 0}</span></p>
                <p><span className="font-medium text-gray-800">Payment Status:</span> <span className={`font-semibold ${order.payment_status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>{order.payment_status || 'Pending'}</span></p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-medium mb-4">Products Ordered</h4>
            <div className="space-y-4">
              {order.products.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.product_id.product_image_main}
                        alt={item.product_id.product_name}
                        className="w-full h-full object-contain rounded-lg border border-gray-100"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.product_id.product_name}</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="font-medium text-gray-800">SKU:</span> {item.product_id?.SKU || item.product_id?.sku || 'N/A'}</p>
                        <p><span className="font-medium text-gray-800">Qty:</span> {item.quantity}</p>
                        <p><span className="font-medium text-gray-800">Unit Price:</span> ₹{item.product_id?.discounted_single_product_price || item.product_id?.price || 0}</p>
                        <p><span className="font-medium text-gray-800">Total:</span> ₹{((item.product_id?.discounted_single_product_price || item.product_id?.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Invoice Button - Show for Processing and Delivered orders */}
              {(order.status === 'Processing' || order.status === 'Delivered') && (
                <button 
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  onClick={() => setShowInvoiceViewer(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Invoice
                </button>
              )}
              
              {canCancelOrder(order) && (
                <button 
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              {order.status === 'Delivered' && !order.return_request && (
                <button 
                  className="flex-1 bg-[#F7941D] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#e38616] transition-colors duration-200 shadow-sm hover:shadow-md"
                  onClick={() => {
                    // Check if order is eligible for return (within 15 days)
                    const orderDate = new Date(order.created_at);
                    const currentDate = new Date();
                    const daysDiff = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
                    
                    if (daysDiff <= 15) {
                      // Open return modal directly
                      setSelectedOrderForReturn(order);
                      setShowReturnForm(true);
                    } else {
                      toast.error('Return period has expired. Returns are only available within 15 days of delivery.');
                    }
                  }}
                >
                  Return Order
                </button>
              )}
              {order.return_request && (
                <div className="flex-1 bg-orange-100 text-orange-800 py-3 px-6 rounded-xl font-medium text-center">
                  Return Request Submitted
                </div>
              )}
            </div>
            {!canCancelOrder(order) && order.status !== 'Delivered' && (
              <p className="text-sm text-gray-500 text-center mt-3">
                {order.status === 'Cancelled' ? 'Order has been cancelled' :
                 order.status === 'Shipped' ? 'Order is already shipped and cannot be cancelled' :
                 order.status === 'Delivered' ? 'Order has been delivered' :
                 'Order cannot be cancelled at this time'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Invoice Viewer Modal */}
      {showInvoiceViewer && (
        <ZohoInvoiceViewer 
          orderId={order._id} 
          onClose={() => setShowInvoiceViewer(false)} 
        />
      )}
      
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
                {order.payment_status === 'Paid' && (
                  <span className="block mt-2 text-sm text-blue-600">
                    Your payment will be refunded within 5-7 business days.
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={cancelling}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  
  const fetchOrders = async () => {
    try {
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
          new Date(b.createdAt) - new Date(a.createdAt)
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
  
  const handleOrderUpdate = () => {
    fetchOrders();
  };

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchOrders();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Orders</h2>
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
            onClick={fetchOrders}
            className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e88a1a] text-sm"
          >
            Refresh Now
          </button>
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">Order #{order._id.slice(-6)}</h3>
                  <p>{formatDate(order.created_at || order.createdAt)}</p>
                </div>
                <span className="font-bold text-[#F7941D]">
                  ₹{order.totalPrice?.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-1">
                  {order.shippingAddress}
                </p>
                
                <p className="text-sm text-gray-600">
                  Items: {order.products.reduce((acc, curr) => acc + curr.quantity, 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdate={handleOrderUpdate}
        />
      )}
      
      {/* Return Order Form Modal */}
      {showReturnForm && selectedOrderForReturn && (
        <ReturnOrderForm
          order={selectedOrderForReturn}
          onClose={() => {
            setShowReturnForm(false);
            setSelectedOrderForReturn(null);
          }}
          onSuccess={() => {
            fetchOrders(); // Refresh orders
            setShowReturnForm(false);
            setSelectedOrderForReturn(null);
          }}
        />
      )}
    </div>
  );
};

const TrackOrder = () => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>
    <p className="text-gray-500">Order tracking feature coming soon!</p>
  </div>
);

const Addresses = ({ user, onEdit }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Your Addresses</h2>
    <div className="space-y-2">
      {user.address && user.address.length > 0 ? (
        user.address.map((addr, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            {addr}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No addresses saved</p>
      )}
    </div>
    <button
      onClick={onEdit}
      className="mt-4 bg-[#F7941D] text-white px-6 py-2 rounded-full"
    >
      Add/Edit Address
    </button>
  </div>
);



const BulkRequest = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserEnquiries = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      
      const token = localStorage.getItem('token');
      if (!token) return;

      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
      const decoded = jwtDecode(parsedToken);
      const userEmail = decoded.email;

      const response = await axios.post(`${backend}/bulk-enquiry/user-list`, {
        filters: { email: userEmail }
      }, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'Success') {
        setEnquiries(response.data.data.enquiries);
      }
    } catch (error) {
      console.error('Error fetching bulk requests:', error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserEnquiries();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUserEnquiries(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Bulk Requests</h2>
        <button
          onClick={() => fetchUserEnquiries(true)}
          disabled={refreshing}
          className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e88a1a] disabled:opacity-50 flex items-center gap-2"
        >
          {refreshing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh
        </button>
      </div>
      {enquiries.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No bulk requests found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry._id} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{enquiry.productName}</h3>
                  <p className="text-sm text-gray-600">Company: {enquiry.companyName}</p>
                  {enquiry.lastUpdated && new Date(enquiry.lastUpdated) > new Date(enquiry.createdAt) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                      Updated
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                  {enquiry.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Quantity: {enquiry.quantity}</p>
                  <p className="text-sm text-gray-600">Expected Price: {enquiry.expectedPrice || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeline: {enquiry.deliveryTimeline || 'Not specified'}</p>
                  <p className="text-sm text-gray-600">Submitted: {new Date(enquiry.createdAt).toLocaleDateString()}</p>
                  {enquiry.lastUpdated && new Date(enquiry.lastUpdated) > new Date(enquiry.createdAt) && (
                    <p className="text-sm text-blue-600 font-medium">Last Updated: {new Date(enquiry.lastUpdated).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              
              {enquiry.description && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Description:</p>
                  <p className="text-sm text-gray-600">{enquiry.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HelpSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    priority: 'Medium',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Order Issue',
    'Payment Issue', 
    'Product Issue',
    'Delivery Issue',
    'Account Issue',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    // Auto-fill user data from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        const decoded = jwtDecode(parsedToken);
        setFormData(prev => ({
          ...prev,
          name: decoded.name || `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim(),
          email: decoded.email || '',
          phone: decoded.phone || decoded.mobile || ''
        }));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;

      const response = await axios.post(
        `${backend}/complaint/create`,
        { complaint: formData },
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'Success') {
        setSubmitted(true);
        toast.success('Your complaint has been submitted successfully!');
        setFormData({
          ...formData,
          subject: '',
          category: '',
          priority: 'Medium',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Request Submitted!</h3>
          <p className="text-green-600 mb-4">We've received your complaint and will get back to you soon.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're here to help! Whether you have questions about your order, need technical support, 
          or want to provide feedback, our team is ready to assist you.
        </p>
      </div>

      {/* Help Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-blue-900 mb-2">Email Support</h3>
          <p className="text-blue-700 text-sm">support@bharatronix.com</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-green-900 mb-2">Phone Support</h3>
          <p className="text-green-700 text-sm">+91 9310433937</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-purple-900 mb-2">Response Time</h3>
          <p className="text-purple-700 text-sm">Within 24 hours</p>
        </div>
      </div>

      {/* Support Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Submit a Support Request</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
                placeholder="Brief description of your issue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all resize-none"
              placeholder="Please provide detailed information about your issue or question..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F7941D] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#e38616] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReturnRequests = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReturnRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
      const decoded = jwtDecode(parsedToken);
      const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

      const response = await axios.post(
        `${backend}/returnRequest/list`,
        {
          pageNum: 1,
          pageSize: 50,
          filters: { user_id: userId }
        },
        {
          headers: {
            'Authorization': `Bearer ${parsedToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'Success') {
        setReturnRequests(response.data.data.returnRequestList || []);
      }
    } catch (error) {
      console.error('Error fetching return requests:', error);
      toast.error('Failed to fetch return requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const getStatusColor = (status, refundStatus) => {
    if (refundStatus) return 'bg-green-100 text-green-800';
    if (status) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status, refundStatus) => {
    if (refundStatus) return 'Refund Completed';
    if (status) return 'Approved - Processing Refund';
    return 'Pending Review';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Return Requests</h2>
        <button
          onClick={fetchReturnRequests}
          className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#e88a1a] text-sm"
        >
          Refresh
        </button>
      </div>
      
      {returnRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-500 mb-2">No Return Requests</h3>
          <p className="text-gray-400">You haven't submitted any return requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returnRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{request.order_id._id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Requested on: {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status, request.refund_status)}`}>
                  {getStatusText(request.status, request.refund_status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Refund Amount: <span className="font-medium text-green-600">₹{request.refund_amount?.toFixed(2)}</span></p>
                  <p className="text-sm text-gray-600">Return Reason: <span className="font-medium">{request.return_reason}</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Items: {request.order_id.products?.length || 0} product(s)</p>
                  <p className="text-sm text-gray-600">Order Date: {new Date(request.order_id.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {request.order_id.products && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
                  <div className="flex flex-wrap gap-2">
                    {request.order_id.products.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded text-sm">
                        <img
                          src={item.product_id.product_image_main}
                          alt={item.product_id.product_name}
                          className="w-8 h-8 object-contain rounded"
                        />
                        <span>{item.product_id.product_name} x {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Loyalty = () => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-semibold mb-4">Loyalty Program</h2>
    <p className="text-gray-500">Loyalty program coming soon!</p>
  </div>
);

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Form validation rules
  const nameValidationPattern = {
    value: /^[A-Za-z\s]+$/,
    message: "Only alphabets are allowed"
  };

  const [activeSection, setActiveSection] = useState("profile");

  // Define navigation items
  const navItems = [
    { id: "profile", label: "Account Details" },
    { id: "orders", label: "Orders" },
    { id: "return-requests", label: "Return Requests" },
    { id: "addresses", label: "Addresses" },
    { id: "bulk-request", label: "Bulk Request" },
    { id: "help-support", label: "Help & Support" },
    { id: "loyalty", label: "Loyalty" }
  ];

  // Update active section based on URL params
  useEffect(() => {
    const section = new URLSearchParams(location.search).get("section");
    if (section && navItems.some(item => item.id === section)) {
      setActiveSection(section);
    }
  }, [location]);

  // Fetch user data from API using token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsEditing(false);
        
        // Get token from localStorage
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }
        
        // Parse token if stored as JSON string, otherwise use directly
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        console.log("Parsed token:", parsedToken);
        
        // Decode the JWT token to get userId
        const decoded = jwtDecode(parsedToken);
        console.log("Decoded token:", decoded);
        const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
        console.log("User ID:", userId);
        
        if (!userId) {
          setError("User ID not found in token");
          setIsLoading(false);
          return;
        }
        
        // Set basic user info from token as fallback
        const tokenUserData = {
          firstName: decoded.name?.split(" ")[0] || decoded.firstName || "",
          lastName: decoded.name?.split(" ")[1] || decoded.lastName || "",
          email: decoded.email || "",
          phone: decoded.phone || decoded.mobile || "",
          address: [],
        };
        
        // Set fallback data first
        if (tokenUserData.email || tokenUserData.firstName) {
          setUser(tokenUserData);
          Object.keys(tokenUserData).forEach(key => {
            if (key === 'address') {
              setValue(key, tokenUserData[key].join('\n'));
            } else {
              setValue(key, tokenUserData[key]);
            }
          });
        }
        
        // Fetch user details from API using the userId
        console.log("Making API call to:", `${backend}/user/${userId}`);
        const response = await axios.get(`${backend}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${parsedToken}`
          }
        });
        
        console.log("API Response:", response);
        
        // Check if the request was successful
        if (response.status === 200 && response.data) {
          const userData = response.data.data.user;
          console.log("User data from API:", userData);
          
          // Set user state with API response data
          const formattedUserData = {
            firstName: userData.firstName || userData.name?.split(" ")[0] || "",
            lastName: userData.lastName || (userData.name?.split(" ").length > 1 ? userData.name.split(" ")[1] : "") || "",
            email: userData.email || "",
            phone: userData.phone || userData.mobile || "",
            address: Array.isArray(userData.address) ? userData.address : [],
          };
          
          console.log("Formatted user data:", formattedUserData);
          setUser(formattedUserData);
          
          // Set form values
          Object.keys(formattedUserData).forEach(key => {
            if (key === 'address') {
              setValue(key, formattedUserData[key].join('\n'));
            } else {
              setValue(key, formattedUserData[key]);
            }
          });
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        console.error("Error response:", error.response);
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        setError(error.response?.data?.message || error.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Get token and userId
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
      const decoded = jwtDecode(parsedToken);
      const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
      
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }
      
      // Convert address string to array by splitting on newlines and filtering empty lines
      const addressArray = data.address.split('\n').filter(addr => addr.trim());
      
      // Prepare request body
      const requestBody = { 
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: user.email,
          phone: data.phone,
          address: addressArray
        }
      };
      
      // Make API request
      const response = await axios.post(`${backend}/user/${userId}/update`, requestBody, {
        headers: { Authorization: `Bearer ${parsedToken}` }
      });
      
      // Handle success
      if (response.status === 200 && response.data.status === "Success") {
        const isSuccess = response.data.status === "Success";
        
        if (isSuccess) {
          // Update user data locally with the address array
          setUser({
            ...data,
            phone: data.phone,
            address: addressArray
          });
          setIsEditing(false);
          toast.success("Profile updated successfully!");
        } else {
          throw new Error("Update failed");
        }
      } else {
        throw new Error(`Server returned status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      let errorMessage = "Failed to update profile";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <Orders />;
      case "return-requests":
        return <ReturnRequests />;
      case "addresses":
        return <Addresses user={user} onEdit={() => setActiveSection("profile")} />;
      case "bulk-request":
        return <BulkRequest />;
      case "help-support":
        return <HelpSupport />;
      case "loyalty":
        return <Loyalty />;
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
                <div className="mt-2">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : !user.firstName && !user.email ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">No User Data!</strong>
                <span className="block sm:inline"> Unable to load user information. Please try logging in again.</span>
                <div className="mt-2">
                  <button 
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }} 
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Login Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Profile Image & Edit Button */}
                <div className="w-full lg:w-[20%] flex flex-col items-center justify-center gap-4">
                  <div className="w-40 h-40 bg-[#EAECF0] rounded-full flex items-center justify-center overflow-hidden">
                    {user.firstName && (
                      <div className="text-5xl font-bold text-[#1e3473]">
                        {user.firstName.charAt(0)}
                        {user.lastName ? user.lastName.charAt(0) : ""}
                      </div>
                    )}
                  </div>
                  <button 
                    className="bg-[#F7941D] text-white text-[18px] px-10 py-1 mt-4 rounded-full"
                    onClick={toggleEditMode}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {/* Profile Content */}
                <div className="flex-1">
                  {isEditing === true ? (
                    // Edit Form
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFFFFF] py-6 px-6 rounded-xl">
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">First Name</label>
                        <input
                          {...register("firstName", { 
                            required: "First name is required",
                            pattern: nameValidationPattern
                          })}
                          className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">Last Name</label>
                        <input
                          {...register("lastName", { 
                            required: "Last name is required",
                            pattern: nameValidationPattern
                          })}
                          className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">Email</label>
                        <input
                          type="email"
                          {...register("email")}
                          className="mt-1 w-full border border-[#E2E2E2] bg-gray-100 rounded-full px-4 py-2 text-sm outline-none cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be edited</p>
                      </div>
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">Phone</label>
                        <input
                          type="tel"
                          {...register("phone", {
                            pattern: {
                              value: /^\d{10}$/,
                              message: "Please enter a valid 10-digit phone number"
                            }
                          })}
                          className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
                          placeholder="Enter 10-digit phone number"
                          maxLength={10}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                          }}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Enter your 10-digit mobile number</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[16px] font-medium text-[#656565]">Addresses (One per line)</label>
                        <textarea
                          {...register("address", { required: "At least one address is required" })}
                          className="mt-1 w-full border border-[#E2E2E2] rounded-xl px-4 py-2 text-sm outline-none resize-none"
                          rows={5}
                          placeholder="Enter each address on a new line"
                        />
                        {errors.address && (
                          <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Enter multiple addresses by putting each address on a new line</p>
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end">
                        <button 
                          type="submit" 
                          className="bg-[#F7941D] text-white px-6 py-2 rounded-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Profile Data Display
                    <div className="bg-[#FFFFFF] py-6 px-6 rounded-xl">
                      <div className="flex flex-col space-y-6">
                        {/* Name Section */}
                        <div className="flex flex-col md:flex-row md:space-x-8">
                          <div className="mb-4 md:mb-0 md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">First Name</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.firstName}</p>
                          </div>
                          <div className="md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Last Name</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.lastName}</p>
                          </div>
                        </div>
                        
                        {/* Contact Section */}
                        <div className="flex flex-col md:flex-row md:space-x-8">
                          <div className="mb-4 md:mb-0 md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Email</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.email}</p>
                          </div>
                          <div className="md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Phone</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.phone}</p>
                          </div>
                        </div>
                        
                        {/* Address Section */}
                        <div>
                          <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Addresses</h4>
                          <div className="space-y-2">
                            {user.address && user.address.length > 0 ? (
                              user.address.map((addr, index) => (
                                <p key={index} className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                                  {addr}
                                </p>
                              ))
                            ) : (
                              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">No addresses provided</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 p-4 flex flex-col lg:flex-row gap-6 py-10 px-4 md:px-10">
      {/* Sidebar */}
      <div className="bg-[#1e3473] text-white w-full h-auto lg:w-[30%] p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl md:text-[49.5px] font-semibold mb-6">My Profile</h2>
        <ul className="space-y-2 text-[24px] font-medium">
          {navItems.map(item => (
            <li
              key={item.id}
              className={`cursor-pointer transition-colors duration-200 ${
                activeSection === item.id
                  ? "text-[#F7941D]"
                  : "text-white hover:text-[#F7941D]"
              }`}
              onClick={() => {
                setActiveSection(item.id);
                navigate(`/profile?section=${item.id}`);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <hr className="my-6 border-gray-400" />
        <button 
          onClick={handleLogout}
          className="text-white text-[26px] hover:text-[#F7941D]"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[#F8F8FA] flex-1 p-4 lg:p-8 rounded-3xl shadow-md">
        {renderSection()}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
