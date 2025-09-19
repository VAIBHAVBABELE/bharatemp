import React, { useState, useEffect, useCallback } from "react";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaTruck,
  FaBox,
  FaSearch,
  FaFilter,
  FaSort,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const backend = import.meta.env.VITE_BACKEND;

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backend}/order/list`,
        {
          pageNum: currentPage,
          pageSize: itemsPerPage,
          filters: {
            status: filter !== "ALL" ? filter : undefined,
            search: searchTerm || undefined,
          },
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
        // Sort orders client-side
        const sortedOrders = response.data.data.orderList.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return sort === "NEWEST" ? dateB - dateA : dateA - dateB;
        });

        setOrders(sortedOrders);
        setTotalOrders(response.data.data.orderCount);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filter, sort, searchTerm]);

  // Separate sort handler
  const handleSortChange = (newSort) => {
    setSort(newSort);
    // Local sort without API call
    setOrders((prevOrders) =>
      [...prevOrders].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return newSort === "NEWEST" ? dateB - dateA : dateA - dateB;
      })
    );
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, sort, currentPage, fetchOrders]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== "") {
        setCurrentPage(1); // Reset to first page when searching
        fetchOrders();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchOrders]);

  // Clear search and refetch all orders
  useEffect(() => {
    if (searchTerm === "") {
      fetchOrders();
    }
  }, [searchTerm, fetchOrders]);

  // Update order status function
  async function updateOrderStatus(order, newStatus) {
    try {
      toast.dismiss();
      setLoading(true);
      setUpdatingStatus(true);
      const response = await axios.post(
        `${backend}/order/${order._id}/update`,
        {
          status: newStatus,
          order: order,
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
        setLoading(false);
        await fetchOrders();
        toast.success("Order status updated successfully!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
      return false;
    } finally {
      setUpdatingStatus(false);
      setLoading(false);
    }
  }

  const getStatusBadge = (order) => {
    const status = order.status;
    const statusConfig = {
      Pending: {
        color: "bg-amber-100 text-amber-800",
        icon: <FaClock className="w-4 h-4 mr-1" />,
      },
      Shipped: {
        color: "bg-blue-100 text-blue-800",
        icon: <FaTruck className="w-4 h-4 mr-1" />,
      },
      Delivered: {
        color: "bg-emerald-100 text-emerald-800",
        icon: <FaCheckCircle className="w-4 h-4 mr-1" />,
      },
      Cancelled: {
        color: "bg-rose-100 text-rose-800",
        icon: <FaTimesCircle className="w-4 h-4 mr-1" />,
      },
      Returned: {
        color: "bg-indigo-100 text-indigo-800",
        icon: <FaBox className="w-4 h-4 mr-1" />,
      },
    };

    return (
      <button
        onClick={() => {
          setSelectedOrder(order);
          setNewStatus(order.status);
          setShowStatusModal(true);
        }}
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color} hover:opacity-80 transition-opacity`}
      >
        {statusConfig[status]?.icon}
        {status}
      </button>
    );
  };

  function convertUTCtoIST(utcDateString) {
    const utcDate = new Date(utcDateString);
    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Update Order Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status:{" "}
                  <span className="font-semibold text-blue-600">
                    {selectedOrder?.status}
                  </span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Pending">🟡 Pending</option>
                  <option value="Shipped">🚚 Shipped</option>
                  <option value="Delivered">✅ Delivered</option>
                  <option value="Cancelled">❌ Cancelled</option>
                  <option value="Returned">↩️ Returned</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                disabled={updatingStatus}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const success = await updateOrderStatus(
                    selectedOrder,
                    newStatus
                  );
                  if (success) setShowStatusModal(false);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="mt-2 text-gray-600 text-lg">
                {searchTerm ? (
                  <>
                    Found {totalOrders} orders matching "{searchTerm}"
                  </>
                ) : (
                  <>Track and manage all customer orders efficiently</>
                )}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {totalOrders} Total Orders
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                  <FaClock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {orders.filter((o) => o.status === "Pending").length}{" "}
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimesCircle className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
                  >
                    <option value="ALL">All Orders</option>
                    <option value="Pending">🟡 Pending</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                    <option value="Returned">↩️ Returned</option>
                  </select>
                </div>

                <div className="relative">
                  <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
                  >
                    <option value="NEWEST">🕒 Newest First</option>
                    <option value="OLDEST">📅 Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {[
                    { label: "Order Details", width: "min-w-[200px]" },
                    { label: "Product", width: "min-w-[280px]" },
                    { label: "Qty", width: "min-w-[80px]" },
                    { label: "Warranty", width: "min-w-[100px]" },
                    { label: "Total Warranty", width: "min-w-[120px]" },
                    { label: "Phone", width: "min-w-[120px]" },
                    { label: "Total", width: "min-w-[100px]" },
                    { label: "Dispatch", width: "min-w-[120px]" },
                    { label: "Origin", width: "min-w-[120px]" },
                    { label: "Return", width: "min-w-[120px]" },
                    { label: "City", width: "min-w-[100px]" },
                    { label: "State", width: "min-w-[100px]" },
                    { label: "Status", width: "min-w-[130px]" },
                    { label: "Order Date", width: "min-w-[140px]" },
                  ].map(({ label, width }) => (
                    <th
                      key={label}
                      className={`px-4 lg:px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap ${width}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // Skeleton Loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      {Array.from({ length: 14 }).map((_, cellIndex) => (
                        <td key={cellIndex} className="px-4 lg:px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <React.Fragment key={order._id}>
                      {order.products.map((product, index) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          {/* Order Details */}
                          {index === 0 && (
                            <td
                              rowSpan={order.products.length}
                              className="px-4 lg:px-6 py-4 align-top"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {order.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {order.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {order.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}

                          {/* Product Details */}
                          <td className="px-4 lg:px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  product.product_id?.image?.[0] ||
                                  "/placeholder.webp"
                                }
                                alt={product.product_id?.name}
                                className="h-12 w-12 lg:h-16 lg:w-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {product.product_id?.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  SKU: {product.product_id?.sku}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="px-4 lg:px-6 py-4 text-sm text-center font-semibold text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.quantity}
                            </span>
                          </td>

                          {/* Extended Warranty */}
                          <td className="px-4 lg:px-6 py-4 text-sm text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.extended_warranty > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.extended_warranty > 0 ? "Yes" : "No"}
                            </span>
                          </td>

                          {/* Total Warranty */}
                          <td className="px-4 lg:px-6 py-4 text-sm text-center font-medium text-gray-900">
                            {product.total_warranty >= 12
                              ? `${(product.total_warranty / 12).toFixed(
                                  1
                                )} Years`
                              : `${product.total_warranty} Months`}
                          </td>

                          {/* Order-level Data */}
                          {index === 0 && (
                            <>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-sm text-center font-medium text-gray-900"
                              >
                                {order?.user_id?.phone}
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-center"
                              >
                                <span className="text-lg font-bold text-green-600">
                                  ₹{order.totalPrice.toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-sm text-center font-medium text-gray-900"
                              >
                                {order.dispatchCenter}
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-sm text-center font-medium text-gray-900"
                              >
                                {order.originCenter}
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-sm text-center font-medium text-gray-900"
                              >
                                {order.returnCenter}
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-sm text-center font-medium text-gray-900"
                              >
                                {order.facilityCity}
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-sm text-center font-medium text-gray-900"
                              >
                                {order.facilityState}
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-center"
                              >
                                {getStatusBadge(order)}
                              </td>
                              <td
                                rowSpan={order.products.length}
                                className="px-4 lg:px-6 py-4 text-sm text-center text-gray-500"
                              >
                                <div className="font-medium text-gray-900">
                                  {
                                    convertUTCtoIST(order.created_at).split(
                                      ","
                                    )[0]
                                  }
                                </div>
                                <div className="text-xs text-gray-500">
                                  {
                                    convertUTCtoIST(order.created_at).split(
                                      ","
                                    )[1]
                                  }
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={14} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaBox className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {searchTerm
                              ? "No orders found"
                              : "No orders available"}
                          </h3>
                          <p className="text-gray-500">
                            {searchTerm
                              ? `No orders match "${searchTerm}". Try a different search term.`
                              : "Orders will appear here once customers place them."}
                          </p>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm("")}
                              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Clear Search
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-900">
                    {Math.min(currentPage * itemsPerPage, totalOrders)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-900">
                    {totalOrders}
                  </span>{" "}
                  results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
