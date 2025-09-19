import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUndo,
} from "react-icons/fa";

const backend = import.meta.env.VITE_BACKEND;

const StatCard = ({ title, value, trend, icon, color }) => (
  <div className={`p-3 md:p-4 lg:p-6 rounded-lg shadow-sm ${color} text-white`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs md:text-sm font-medium">{title}</p>
        <p className="text-xl md:text-2xl lg:text-3xl font-bold mt-1 md:mt-2">
          {value}
        </p>
        <span className="text-xs md:text-sm">{trend}</span>
      </div>
      <div className="text-2xl md:text-3xl lg:text-4xl">{icon}</div>
    </div>
  </div>
);

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 11; // Reduced from 10 to fit in one page
  // Fetch dashboard data
  async function getDashboardData() {
    try {
      setLoading(true);
      const response = await axios.get(`${backend}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      if (response.data.status === "Success") {

        setDashboardData(response.data.data.dashboard_data);
        console.log("Dashboard Data:", response.data.data.dashboard_data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error while getting Dashboard Data", error);
      setLoading(false);
    }
  }

  // Fetch orders with pagination
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backend}/order/list`,
        {
          pageNum: currentPage,
          pageSize: itemsPerPage,
          filters: {},
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (response.data.status === "Success") {
        setOrders(response.data.data.orderList);
        setTotalOrders(response.data.data.orderCount);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        color: "bg-amber-100 text-amber-800",
        icon: <FaClock className="w-3 h-3 md:w-4 md:h-4 mr-1" />,
      },
      Shipped: {
        color: "bg-blue-100 text-blue-800",
        icon: <FaTruck className="w-3 h-3 md:w-4 md:h-4 mr-1" />,
      },
      Delivered: {
        color: "bg-emerald-100 text-emerald-800",
        icon: <FaCheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />,
      },
      Cancelled: {
        color: "bg-rose-100 text-rose-800",
        icon: <FaTimesCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />,
      },
      Returned: {
        color: "bg-purple-100 text-purple-800",
        icon: <FaUndo className="w-3 h-3 md:w-4 md:h-4 mr-1" />,
      },
    };

    return (
      <span
        className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${statusConfig[status]?.color}`}
      >
        {statusConfig[status]?.icon}
        <span className="hidden sm:inline">{status}</span>
        <span className="sm:hidden">{status.substring(0, 3)}</span>
      </span>
    );
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-blue-50 p-2 md:p-4 lg:p-6">
      {loading && <LoadingSpinner />}
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
            Dashboard Overview
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-6">
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
          <div className="bg-white p-3 md:p-4 lg:p-6 rounded-lg shadow-sm">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4">
              Recent Orders
            </h3>
            <div className="overflow-x-auto -mx-2 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-xs md:text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-2 px-2 md:px-3 lg:px-5">Order ID</th>
                      <th className="pb-2 px-2 md:px-3 lg:px-5 hidden sm:table-cell">
                        Customer
                      </th>
                      <th className="pb-2 px-2 md:px-3 lg:px-5 hidden md:table-cell">
                        Date
                      </th>
                      <th className="pb-2 px-2 md:px-3 lg:px-5">Status</th>
                      <th className="pb-2 px-2 md:px-3 lg:px-5">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b last:border-b-0"
                        >
                          <td className="py-2 md:py-3 px-2 md:px-3 lg:px-5 font-medium">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-2 md:px-3 lg:px-5 hidden sm:table-cell">
                            {order.name || order.email}
                          </td>
                          <td className="px-2 md:px-3 lg:px-5 hidden md:table-cell">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-2 md:px-3 lg:px-5">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-2 md:px-3 lg:px-5 font-semibold">
                            ₹{order.totalPrice?.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-3 px-2 md:px-3 lg:px-5 text-center text-gray-600"
                        >
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 md:mt-4 gap-2 md:gap-4">
              <div className="text-xs md:text-sm text-gray-600 text-center sm:text-left">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalOrders)} of{" "}
                {totalOrders} orders
              </div>
              <div className="flex gap-1 md:gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 md:px-3 py-1 md:py-1.5 rounded border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <span className="px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm text-gray-700 font-medium">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 md:px-3 py-1 md:py-1.5 rounded border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="w-3 h-3 md:w-4 md:h-4" />
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
