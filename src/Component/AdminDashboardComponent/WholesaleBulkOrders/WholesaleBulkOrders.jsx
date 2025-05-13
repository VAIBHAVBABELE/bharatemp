import axios from 'axios';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { convertUTCtoIST2 } from '../../../utils/TimeConverter';
import { FiChevronDown, FiBox, FiMapPin, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND;

const WholesaleBulkOrders = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);

    // Fetch orders from backend
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/wholesale/orders/list`, {
                pageNum: 1,
                pageSize: 20,
                filters: {}
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            setOrders(response.data.data.wholesalebulkOrdersList);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update payment status
    const updatePaymentStatus = async (orderId, newStatus) => {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/wholesale/orders/${orderId}/update`, {
                paymentStatus: newStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            if (response.data.status === 'Success') {
                toast.success("Payment status updated successfully!");
                fetchOrders();
                setLoading(false);
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            setLoading(false);
        }
    };

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-14 bg-gradient-to-b from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl md:text-4xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                    <FiBox className="text-indigo-600" />
                    Wholesale Orders Management
                </h1>

                {loading && <LoadingSpinner />}

                {!loading && error && (
                    <div className="bg-red-50 p-6 rounded-lg flex items-center gap-4 mb-8">
                        <div className="text-red-600">
                            <FiAlertCircle className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-red-600 font-medium">{error}</p>
                            <button
                                onClick={fetchOrders}
                                className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {orders.map(order => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div
                                className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === 'Completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {order.paymentStatus.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Order ID: {order._id.slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl flex flex-col sm:flex-row font-semibold text-gray-800 sm:items-center gap-2">
                                        {order.email}
                                        <span className="text-gray-400 hidden sm:inline">•</span>
                                        <span className="text-gray-500 text-sm font-normal">
                                            {convertUTCtoIST2(order.created_at)}
                                        </span>
                                    </h3>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            ₹ {order.total_price.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.products.length} items
                                        </p>
                                    </div>
                                    <FiChevronDown className={`text-xl text-gray-600 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <div className={`overflow-hidden transition-all duration-300 ${expandedOrder === order._id ? 'max-h-[1500px]' : 'max-h-0'
                                }`}>
                                <div className="p-6 border-t border-gray-100 space-y-8">
                                    {/* Products Section */}
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
                                            <FiBox className="text-indigo-600" />
                                            Ordered Products
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {order.products.map((product, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-white p-2 rounded-md shadow-sm">
                                                            <FiBox className="text-2xl text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{product.product_id.name}</p>
                                                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                                                <div className="text-gray-600">
                                                                    Qty: {product.quantity}
                                                                </div>
                                                                <div className="text-gray-600">
                                                                    Price: ₹ {product.price}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Addresses Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-blue-50 p-5 rounded-xl">
                                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700">
                                                <FiMapPin className="text-blue-600" />
                                                Shipping Address
                                            </h4>
                                            <div className="space-y-2 text-gray-600">
                                                <p className="font-medium">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                                <p>{order.shipping_address.fullAddress}</p>
                                                {order.shipping_address.apartment && <p>{order.shipping_address.apartment}</p>}
                                                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                                                <p>{order.shipping_address.country}, {order.shipping_address.zipCode}</p>
                                                <p>{order.contact}</p>
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 p-5 rounded-xl">
                                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-700">
                                                <FiCreditCard className="text-purple-600" />
                                                Billing Address
                                            </h4>
                                            <div className="space-y-2 text-gray-600">
                                                <p className="font-medium">{order.billing_address.billingFirstName} {order.billing_address.billingLastName}</p>
                                                <p>{order.billing_address.billingFullAddress}</p>
                                                {order.billing_address.billingApartment && <p>{order.billing_address.billingApartment}</p>}
                                                <p>{order.billing_address.billingCity}, {order.billing_address.billingState}</p>
                                                <p>{order.billing_address.billingCountry}, {order.billing_address.billingZipCode}</p>
                                                <p>{order.contact}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company & Status Section */}
                                    <div className="bg-gray-50 p-5 rounded-xl">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            {order.companyName && (
                                                <div>
                                                    <h5 className="text-sm font-semibold text-gray-500 mb-2">Company Details</h5>
                                                    <p className="text-gray-700">
                                                        {order.companyName}
                                                        {order.gstNumber && (
                                                            <span className="ml-2 px-2 py-1 bg-white rounded-md text-sm">
                                                                GST: {order.gstNumber}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex-1 max-w-xs">
                                                <label className="text-sm font-semibold text-gray-500 mb-2 block">
                                                    Update Payment Status
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={order.paymentStatus}
                                                        onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                                                        className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && orders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mb-4 text-gray-400">
                            <FiBox className="text-4xl mx-auto" />
                        </div>
                        <p className="text-gray-500 text-lg">No wholesale orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WholesaleBulkOrders;