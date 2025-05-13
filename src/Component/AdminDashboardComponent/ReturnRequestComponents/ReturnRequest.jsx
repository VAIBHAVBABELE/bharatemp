import React, { useState, useEffect } from 'react';
import {
    User, Package, Calendar, Clock, BadgeCheck,
    Wallet, ClipboardList, Search, RotateCw, Ban, CheckCircle, X
} from 'lucide-react';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import { convertUTCtoIST2 } from '../../../utils/TimeConverter';
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND;


const ReturnRequest = () => {
    const [returnRequests, setReturnRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [updatingField, setUpdatingField] = useState('');
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    async function fetchReturnRequests() {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/returnRequest/list`, {
                pageNum: currentPage,
                pageSize: itemsPerPage,
                filters: {},
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === "Success") {
                setReturnRequests(response.data.data.returnRequestList);
                setTotalItems(response.data.data.totalCount);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    async function updateStatus(request, field) {
        try {
            const data = { [field]: true };
            const response = await axios.post(`${backend}/returnRequest/${request._id}/update`, { ...data, data: request },
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                });

            if (response.data.status === "Success") {
                toast.success("Status updated successfully");
                fetchReturnRequests();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setShowConfirmPopup(false);
        }
    }

    const handleStatusClick = (id, field) => {
        setSelectedRequestId(id);
        setUpdatingField(field);
        setShowConfirmPopup(true);
    };
    useEffect(() => {
        fetchReturnRequests();
    }, [currentPage, itemsPerPage]);

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 w-full bg-gradient-to-b from-gray-50 to-blue-50 pt-14">
            <div className="max-w-7xl mx-auto">
                {showConfirmPopup && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Confirm Update</h3>
                                <button
                                    onClick={() => setShowConfirmPopup(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="mb-6">Are you sure you want to update this status?</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowConfirmPopup(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedRequestId, updatingField)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {
                    loading && <LoadingSpinner />
                }
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <ClipboardList className="w-8 h-8" />
                    Return Requests Management
                </h1>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
                    {totalItems > 20 && (
                        <div className="flex items-center gap-4">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="p-2 border rounded-lg"
                            >
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {
                        returnRequests.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-400 mb-4">📭</div>
                                <h3 className="text-lg font-medium text-gray-500">
                                    No return requests found
                                </h3>
                                <p className="text-gray-400 mt-1">
                                    {searchTerm ? `No results for "${searchTerm}"` : 'No requests available'}
                                </p>
                            </div>
                        ) : (
                            returnRequests.map((request) => {
                                const bothApproved = request.status && request.refund_status;
                                return (
                                    <div key={request._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                        {/* User Section */}
                                        <div className="border-b pb-4 mb-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <User className="w-6 h-6 text-blue-600" />
                                                <div>
                                                    <h3 className="text-lg font-semibold">{request.user_id.name}</h3>
                                                    <p className="text-gray-600">{request.user_id.email}</p>
                                                    <p className="text-gray-600">{request.user_id.phone}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>Request Date: {convertUTCtoIST2(request.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Products Section */}
                                        <div className="border-b pb-4 mb-4">
                                            <div className="flex items-center gap-2 mb-3 text-gray-700">
                                                <Package className="w-5 h-5" />
                                                <span className="font-medium">Products</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {request.order_id.products.map((product, index) => (
                                                    <li key={index} className="flex justify-between text-sm">
                                                        <span>{product.product_id.name}</span>
                                                        <span className="text-gray-500 shrink-0">Qty: {product.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Payment & Status Section */}
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Payment ID</p>
                                                    <p className="font-medium">{request.payment_id}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <RotateCw className="w-5 h-5 text-purple-600" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Refund Amount</p>
                                                    <p className="font-medium">₹{request.refund_amount?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Controls */}
                                        <div className="grid grid-cols-1 xl:grid-cols-2  gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    <BadgeCheck className="w-4 h-4" />
                                                    Approval Status
                                                </label>
                                                <button
                                                    onClick={() => handleStatusClick(request, 'status')}
                                                    disabled={bothApproved || request.refund_status}
                                                    className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${request.status
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        } ${bothApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {request.status ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            Approved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban className="w-4 h-4" />
                                                            Pending Approval
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    <Wallet className="w-4 h-4" />
                                                    Refund Status
                                                </label>
                                                <button
                                                    onClick={() => handleStatusClick(request, 'refund_status')}
                                                    disabled={bothApproved || !request.status || request.refund_status}
                                                    className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${request.refund_status
                                                        ? 'bg-blue-100 text-blue-700 cursor-default'
                                                        : `${request.status
                                                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`
                                                        } ${bothApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {request.refund_status ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            Refund Completed
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-4 h-4" />
                                                            Mark as Refunded
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Return Reason */}
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium flex items-center gap-2">
                                                <ClipboardList className="w-4 h-4" />
                                                Return Reason
                                            </p>
                                            <p className="text-gray-600 text-sm mt-1">{request.return_reason}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default ReturnRequest;