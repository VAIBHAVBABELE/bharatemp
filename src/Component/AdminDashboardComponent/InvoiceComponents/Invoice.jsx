import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FaFileInvoice, FaRupeeSign, FaUser, FaBox, FaCalendar,
    FaCheckCircle, FaTimesCircle, FaPhone, FaEnvelope, FaFileDownload
} from 'react-icons/fa';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';
import logo2 from "../../../assets/logo2.svg";

const backend = import.meta.env.VITE_BACKEND;

function Invoice() {
    const [invoices, setInvoices] = useState([]);
    const [downloadingId, setDownloadingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [sort, setSort] = useState('NEWEST');
    const [loading, setLoading] = useState(false);
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);

    useEffect(() => {
        fetchInvoices();
    }, [currentPage, sort]);

    async function fetchInvoices() {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/invoice/list`, {
                pageNum: currentPage,
                pageSize: itemsPerPage,
                filters: {},
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === "Success") {
                const sortedInvoices = response.data.data.invoiceList.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return sort === 'NEWEST' ? dateB - dateA : dateA - dateB;
                });

                setInvoices(sortedInvoices);
                setTotalInvoices(response.data.data.invoiceCount);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDownloadInvoice = async (invoiceId) => {
        try {
            setLoading(true);
            setDownloadingId(invoiceId);

            const response = await axios.post(`${backend}/invoice/${invoiceId}/download-invoice`, {}, { responseType: "blob" });

            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));

                const link = document.createElement("a");
                link.href = url;
                link.download = `invoice-${invoiceId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(url);
                toast.success("Invoice downloaded successfully");
            } else {
                toast.error("Failed to download invoice");
            }
        } catch (error) {
            console.error("Error downloading invoice", error);
            toast.error("Failed to download invoice");
        } finally {
            setLoading(false);
            setDownloadingId(null);
        }
    };

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen pt-14 bg-gradient-to-b from-gray-50 to-blue-50">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
                    <FaFileInvoice className="mr-2" /> Invoices
                </h1>

                <div className="flex gap-4">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center"><LoadingSpinner /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        invoices.length > 0
                            ? invoices.map(invoice => (
                                <div key={invoice._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-sm font-semibold flex items-center">
                                                <FaFileInvoice className="mr-2 text-blue-500" />
                                                {invoice.invoiceNumber}
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                <FaCalendar className="mr-2" />
                                                {new Date(invoice.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 flex-shrink-0 rounded-full text-sm ${invoice.status === 'Paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {invoice.status === 'Paid' ? (
                                                <FaCheckCircle className="inline mr-1 mb-1" />
                                            ) : (
                                                <FaTimesCircle className="inline mr-1 mb-1" />
                                            )}
                                            {invoice.status}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex mb-2 flex-col">
                                            {invoice.user_Id?.name && (
                                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                                    <FaUser className="mr-2 text-gray-600 flex-shrink-0" />
                                                    <span className="font-medium truncate">{invoice.user_Id?.name || 'N/A'}</span>
                                                </p>
                                            )}
                                            {invoice.user_Id?.phone && (
                                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                                    <FaPhone className="mr-2" size={12} />
                                                    <span className="truncate">{invoice.user_Id.phone}</span>
                                                </p>
                                            )}
                                            {invoice.user_Id?.email && (
                                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                                    <FaEnvelope className="mr-2" size={12} />
                                                    <span className="truncate">{invoice.user_Id.email}</span>
                                                </p>
                                            )}
                                        </div>
                                        <p className="flex items-center">
                                            <FaRupeeSign size={15} className="mr-1 text-gray-600" />
                                            <span className="font-bold">{invoice.amount}</span>
                                        </p>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold mb-2 flex items-center">
                                            <FaBox className="mr-2" /> Products
                                        </h3>
                                        <ul className="space-y-2">
                                            {invoice.items.map((item, index) => (
                                                <li key={index} className="text-sm">
                                                    {item.product?.name}
                                                    <span className="text-gray-500 ml-2">
                                                        x{item.quantity}
                                                    </span>
                                                    {item.totalWarranty > 0 && (
                                                        <span className="block text-xs text-gray-400">
                                                            Warranty: {item.totalWarranty} months
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => handleDownloadInvoice(invoice._id)}
                                        disabled={downloadingId === invoice._id}
                                        className={`w-full flex items-center justify-center gap-2 text-sm px-4 mt-5 py-2 rounded-md transition-colors ${downloadingId === invoice._id
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                                            }`}
                                    >
                                        {downloadingId === invoice._id ? (
                                            <img 
                                                src={logo2} 
                                                alt="Downloading..." 
                                                className="w-5 h-5 animate-spin"
                                                style={{ animationDuration: '1.5s' }}
                                            />
                                        ) : (
                                            <FaFileDownload />
                                        )}
                                        {downloadingId === invoice._id ? 'Downloading...' : 'Download PDF'}
                                    </button>
                                </div>
                            ))
                            : (
                                <div className=" rounded-lg p-6 col-span-3">
                                    <p className="text-center text-gray-600">No Invoices found</p>
                                </div>
                            )
                    }
                </div>
            )}

            {/* Pagination */}
            {
                invoices.length > 20 && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="mx-1 px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="mx-4 px-4 py-2">
                            Page {currentPage} of {Math.ceil(totalInvoices / itemsPerPage)}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage >= Math.ceil(totalInvoices / itemsPerPage)}
                            className="mx-1 px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default Invoice;