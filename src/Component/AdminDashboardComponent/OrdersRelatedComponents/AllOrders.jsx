import React, { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight, FaTruck , FaBox} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo2 from "../../../assets/logo2.svg";

const backend = import.meta.env.VITE_BACKEND;

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState('NEWEST');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const itemsPerPage = 20;

    async function fetchOrders() {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/order/list`, {
                pageNum: currentPage,
                pageSize: itemsPerPage,
                filters: {
                    status: filter !== 'ALL' ? filter : undefined,
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === "Success") {
                // Sort orders client-side
                const sortedOrders = response.data.data.orderList.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return sort === 'NEWEST' ? dateB - dateA : dateA - dateB;
                });

                setOrders(sortedOrders);
                setTotalOrders(response.data.data.orderCount);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    // Separate sort handler
    const handleSortChange = (newSort) => {
        setSort(newSort);
        // Local sort without API call
        setOrders(prevOrders => [...prevOrders].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return newSort === 'NEWEST' ? dateB - dateA : dateA - dateB;
        }));
    };

    useEffect(() => {
        fetchOrders();
    }, [filter, sort, currentPage]);

    // Update order status function
    async function updateOrderStatus(order, newStatus) {
        try {
            toast.dismiss()
            setLoading(true);
            setUpdatingStatus(true);
            const response = await axios.post(`${backend}/order/${order._id}/update`, {
                status: newStatus,
                order: order
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === 'Success') {
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
            Pending: { color: 'bg-amber-100 text-amber-800', icon: <FaClock className="w-4 h-4 mr-1" /> },
            Shipped: { color: 'bg-blue-100 text-blue-800', icon: <FaTruck className="w-4 h-4 mr-1" /> },
            Delivered: { color: 'bg-emerald-100 text-emerald-800', icon: <FaCheckCircle className="w-4 h-4 mr-1" /> },
            Cancelled: { color: 'bg-rose-100 text-rose-800', icon: <FaTimesCircle className="w-4 h-4 mr-1" /> },
            Returned: {
                color: 'bg-indigo-100 text-indigo-800',
                icon: <FaBox className="w-4 h-4 mr-1" />
            }
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
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full py-8 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
            {/* Header Section */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Returned">Returned</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={updatingStatus}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const success = await updateOrderStatus(selectedOrder, newStatus);
                                    if (success) setShowStatusModal(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                disabled={updatingStatus}
                            >
                                {updatingStatus ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="max-w-8xl mx-auto pt-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Order Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Managing {totalOrders} orders across your store
                        </p>
                    </div>

                    {/* Filters and Sort */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Orders</option>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="NEWEST">Newest First</option>
                            <option value="OLDEST">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200" style={{
                            scrollbarWidth: 'thin'
                        }}>
                            <thead className="bg-gray-50">
                                <tr>
                                    {[
                                        { label: 'Order Details', minWidth: 'min-w-[200px]' },
                                        { label: 'Product', minWidth: 'min-w-[300px]' },
                                        { label: 'Qty', minWidth: 'min-w-[100px]' },
                                        { label: 'Warranty Extended', minWidth: 'min-w-[100px]' },
                                        { label: 'Total Warranty', minWidth: 'min-w-[150px]' },
                                        { label: 'Phone Number', minWidth: 'min-w-[100px]' },
                                        { label: 'Total', minWidth: 'min-w-[100px]' },
                                        { label: 'Dispatch Center', minWidth: 'min-w-[160px]' },
                                        { label: 'Origin Center', minWidth: 'min-w-[160px]' },
                                        { label: 'Return Center', minWidth: 'min-w-[160px]' },
                                        { label: 'Facility City', minWidth: 'min-w-[150px]' },
                                        { label: 'Facility State', minWidth: 'min-w-[150px]' },
                                        { label: 'Status', minWidth: 'min-w-[130px]' },
                                        { label: 'Order Date', minWidth: 'min-w-[160px]' }
                                    ].map(({ label, minWidth }) => (
                                        <th
                                            key={label}
                                            className={`px-6 sm:px-8 py-4 text-sm text-center font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${minWidth}`}
                                        >
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="13" className="px-6 py-8 text-center">
                                            <div className="flex justify-center items-center space-x-4">
                                                <img 
                                                    src={logo2} 
                                                    alt="Loading..." 
                                                    className="w-12 h-12 animate-spin"
                                                    style={{ animationDuration: '1.5s' }}
                                                />
                                                <span className="text-gray-500">Loading orders...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : orders.length > 0 ? (
                                    orders.map((order) => (
                                        <React.Fragment key={order._id}>
                                            {order.products.map((product, index) => (
                                                <tr key={product._id} className=" transition-colors">
                                                    {/* Order Details */}
                                                    {index === 0 && (
                                                        <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 align-center">
                                                            <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                                            <div className="text-sm text-gray-500">{order.email}</div>
                                                        </td>
                                                    )}

                                                    {/* Product Details */}
                                                    <td className="px-4 sm:px-6 py-4">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={product.product_id?.image?.[0] || "/placeholder.png"}
                                                                alt={product.product_id?.name}
                                                                className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover border border-gray-200"
                                                            />
                                                            <div className="ml-3 sm:ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {product.product_id?.name}
                                                                </div>
                                                                {/* <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                                                    SKU: {product.product_id?.sku}
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Quantity */}
                                                    <td className="px-4 sm:px-6 py-4 text-sm text-center text-gray-900 font-medium">
                                                        {product.quantity}
                                                    </td>

                                                    {/* Extended Warranty */}
                                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 text-center font-medium">
                                                        {product.extended_warranty > 0 ? 'Yes' : 'No'}
                                                    </td>

                                                    {/* Total Warranty */}
                                                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 text-center font-medium">
                                                        {product.total_warranty >= 12
                                                            ? `${(product.total_warranty / 12).toFixed(1)} Years`
                                                            : `${product.total_warranty} Months`}
                                                    </td>

                                                    {/* Order-level Data */}
                                                    {index === 0 && (
                                                        <>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 text-center py-4 text-sm font-medium text-gray-900">
                                                                {order?.user_id?.phone}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 text-center py-4 text-sm font-medium text-gray-900">
                                                                ₹{order.totalPrice.toLocaleString('en-IN')}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 text-center text-sm font-medium text-gray-900">
                                                                {order.dispatchCenter}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 text-center text-sm font-medium text-gray-900">
                                                                {order.originCenter}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 text-center text-sm font-medium text-gray-900">
                                                                {order.returnCenter}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 text-center text-sm font-medium text-gray-900">
                                                                {order.facilityCity}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 text-center text-sm font-medium text-gray-900">
                                                                {order.facilityState}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 text-center">
                                                                {getStatusBadge(order)}
                                                            </td>
                                                            <td rowSpan={order.products.length} className="px-4 sm:px-6 py-4 text-sm text-center text-gray-500">
                                                                {convertUTCtoIST(order.created_at)}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={13} className="text-center py-10 text-lg sm:text-2xl font-bold text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalOrders)}</span> of{' '}
                            <span className="font-medium">{totalOrders}</span> results
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft className="inline-block -mt-0.5" />
                            </button>

                            <span className="px-4 py-1.5 text-sm text-gray-700 font-medium">
                                Page {currentPage}
                            </span>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronRight className="inline-block -mt-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllOrders;