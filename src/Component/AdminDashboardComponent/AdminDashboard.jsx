import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaUndo } from "react-icons/fa";

const backend = import.meta.env.VITE_BACKEND;

const StatCard = ({ title, value, trend, icon, color }) => (
  <div className={`p-6 rounded-lg shadow-sm ${color} text-white`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <span className="text-sm">{trend}</span>
      </div>
      <div className="text-4xl">
        {icon}
      </div>
    </div>
  </div>
);

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 10;
  // Fetch dashboard data
  async function getDashboardData() {
    try {
      setLoading(true);
      const response = await axios.get(`${backend}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        }
      });
      if (response.data.status === "Success") {
        setDashboardData(response.data.data.dashboard_data);
        setLoading(false);

      }
    } catch (error) {
      console.log("Error while getting Dashboard Data", error);
      setLoading(false);
    }
  }

  // Fetch orders with pagination
  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await axios.post(`${backend}/order/list`, {
        pageNum: currentPage,
        pageSize: itemsPerPage,
        filters: {},
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });

      if (response.data.status === "Success") {
        setOrders(response.data.data.orderList);
        setTotalOrders(response.data.data.orderCount);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: 'bg-amber-100 text-amber-800', icon: <FaClock className="w-4 h-4 mr-1" /> },
      Shipped: { color: 'bg-blue-100 text-blue-800', icon: <FaTruck className="w-4 h-4 mr-1" /> },
      Delivered: { color: 'bg-emerald-100 text-emerald-800', icon: <FaCheckCircle className="w-4 h-4 mr-1" /> },
      Cancelled: { color: 'bg-rose-100 text-rose-800', icon: <FaTimesCircle className="w-4 h-4 mr-1" /> },
      Returned: { color: 'bg-purple-100 text-purple-800', icon: <FaUndo className="w-4 h-4 mr-1" /> }
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color}`}>
        {statusConfig[status]?.icon}
        {status}
      </span>
    );
  };

  useEffect(() => {
    getDashboardData();
    fetchOrders();
  }, [currentPage]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-blue-50 pt-5 lg:pt-8">
      {loading && <LoadingSpinner />}
      <div className="flex w-full">
        <div className="flex-1 p-8 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={dashboardData?.user_count}
              icon="👤"
              color="bg-green-500"
            />
            <StatCard
              title="Total Orders"
              value={dashboardData?.order_count}
              icon="📦"
              color="bg-blue-500"
            />
            <StatCard
              title="Total Stock"
              value={dashboardData?.total_stock}
              icon="📈"
              color="bg-purple-500"
            />
            <StatCard
              title="Total Products"
              value={dashboardData?.product_count}
              icon="📊"
              color="bg-orange-500"
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="pb-3 px-5">Order ID</th>
                    <th className="pb-3 px-5">Customer</th>
                    <th className="pb-3 px-5">Date</th>
                    <th className="pb-3 px-5">Status</th>
                    <th className="pb-3 px-5">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders.length > 0
                      ? orders.map((order) => (
                        <tr key={order._id} className="border-b last:border-b-0">
                          <td className="py-4 px-5">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="px-5">{order.name || order.email}</td>
                          <td className="px-5">{formatDate(order.created_at)}</td>
                          <td className="px-5">{getStatusBadge(order.status)}</td>
                          <td className="px-5">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                        </tr>
                      ))
                      : (
                        <tr>
                          <td colSpan="5" className="py-4 px-5 text-center text-gray-600">
                            No orders found
                          </td>
                        </tr>
                      )
                  }
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft />
                </button>
                <span className="px-4 py-1.5 text-sm text-gray-700 font-medium">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;