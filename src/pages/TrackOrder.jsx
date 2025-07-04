import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaShippingFast, FaBox } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backend = import.meta.env.VITE_BACKEND;

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchOrders();
  }, []);

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

      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E3473] flex items-center gap-3">
            <FaShippingFast />
            Track Your Orders
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full text-center py-16 bg-white rounded-lg shadow">
            <FaBox className="max-w-7xl mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
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

                  <button 
                    className="w-full cursor-pointer md:w-auto bg-[#1E3473] text-white px-6 py-3 rounded-lg hover:bg-[#162554] transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      if (order.waybill) {
                        window.open(`https://bharatronix.ithinklogistics.co.in/postship/tracking/${order.waybill}`, "_blank");
                      } else {
                        toast.info("Tracking information not available for this order yet.");
                      }
                    }}
                  >
                    <FaShippingFast />
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TrackOrder; 