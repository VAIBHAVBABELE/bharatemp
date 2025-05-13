import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { toast } from 'react-toastify';
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND;


function AreaOfServices() {
    const [loading, setLoading] = useState(true);
    const [zipcodes, setZipcodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalZipcodes, setTotalZipcodes] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [newZipcode, setNewZipcode] = useState({
        zipcode: '',
        dispatchCenter: '',
        originCenter: '',
        returnCenter: '',
        facilityCity: '',
        outOfDeliveryArea: false,
        facilityState: ''
    });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedZipcodeId, setSelectedZipcodeId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);


    // Validation function
    const validateForm = () => {
        toast.dismiss();
        const zipRegex = /^\d{6}$/;

        if (!String(newZipcode.zipcode).match(zipRegex)) {  // ✅ Ensure zipcode is a string
            toast.error('Invalid ZIP code (must be 6 digits)');
            return false;
        }
        if (!newZipcode.dispatchCenter.trim()) {
            toast.error('Dispatch Center is required');
            return false;
        }
        if (!newZipcode.originCenter.trim()) {
            toast.error('Origin Center is required');
            return false;
        }
        if (!newZipcode.returnCenter.trim()) {
            toast.error('Return Center is required');
            return false;
        }
        if (!newZipcode.facilityCity.trim()) {
            toast.error('Facility City is required');
            return false;
        }
        if (!newZipcode.facilityState.trim()) {
            toast.error('Facility State is required');
            return false;
        }

        return true; // Return true only if all validations pass
    };

    useEffect(() => {
        if (searchQuery) {
            // searchWithPincode();
        } else {
            fetchZipcodes();
        }
    }, [currentPage, searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setCurrentPage(1); // Reset to the first page when searching
            searchWithPincode();
        } else {
            fetchZipcodes(); // Fetch all data if the search query is empty
        }
    };

    const searchWithPincode = async () => {
        try {
            toast.dismiss();
            setLoading(true);
            const zipcodeConvertedToNumber = parseInt(searchQuery);
            const response = await axios.post(`${backend}/zipcode/list`, {
                pageNum: currentPage,
                pageSize: itemsPerPage,
                filters: {
                    zipcode: zipcodeConvertedToNumber
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === "Success") {
                setZipcodes(response.data.data.zipcodeList);
                setTotalZipcodes(response.data.data.zipcodeCount);
            }
        } catch (error) {
            console.error("Error fetching zipcodes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchZipcodes = async () => {
        try {
            toast.dismiss()
            setLoading(true);
            const response = await axios.post(`${backend}/zipcode/list`, {
                pageNum: currentPage,
                pageSize: itemsPerPage
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === "Success") {
                setZipcodes(response.data.data.zipcodeList);
                setTotalZipcodes(response.data.data.zipcodeCount);
            }
        } catch (error) {
            console.error("Error fetching zipcodes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!validateForm()) {
                return;
            }
            toast.dismiss()
            setLoading(true);
            const url = editMode ?
                `${backend}/zipcode/${newZipcode._id}/update` :
                `${backend}/zipcode/new`;

            const response = await axios.post(url, newZipcode, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            if (response.data.status === "Success") {
                setShowModal(false);
                setLoading(false);
                setNewZipcode({
                    zipcode: '',
                    dispatchCenter: '',
                    originCenter: '',
                    returnCenter: '',
                    facilityCity: '',
                    outOfDeliveryArea: false,
                    facilityState: ''
                });
                fetchZipcodes();
                toast.success(editMode ? "Zipcode updated successfully!" : "Zipcode saved successfully!");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error saving zipcode:", error);
        }
    };

    async function handleDelete(id) {
        try {
            toast.dismiss()
            setLoading(true);
            const response = await axios.post(`${backend}/zipcode/${id}/remove`, {}, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            if (response.data.status === "Success") {
                setLoading(false);
                fetchZipcodes();
                toast.success("Zipcode deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting zipcode:", error);
            setLoading(false);
        }
    }

    const handleEdit = (zipcode) => {
        setEditMode(true);
        setNewZipcode(zipcode);
        setShowModal(true);
    };

    const totalPages = Math.ceil(totalZipcodes / itemsPerPage);

    // Updated delete handler
    const promptDelete = (id) => {
        setSelectedZipcodeId(id);
        setShowDeleteConfirmation(true);
    };

    const ConfirmationModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h3>
                <p className="mb-6 text-gray-600">Are you sure you want to delete this zipcode? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowDeleteConfirmation(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            setShowDeleteConfirmation(false);
                            await handleDelete(selectedZipcodeId);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-14">
            <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:justify-between sm:items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Service Areas</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Search Field */}
                    <form onSubmit={handleSearch} className="flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by ZIP code"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <MdSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                        <button
                            type="submit"
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                    <button
                        onClick={() => {
                            setEditMode(false);
                            setShowModal(true);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                    >
                        Create New
                    </button>
                </div>
            </div>

            {showDeleteConfirmation && <ConfirmationModal />}

            {loading ? (
                <div className="flex justify-center mt-8">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {/* Table Section */}
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Pincode</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Dispatch Center</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Origin Center</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Return Center</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">City</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">State</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">ODA</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {
                                    zipcodes.length > 0
                                        ? zipcodes.map((zipcode) => (
                                            <tr key={zipcode._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-700">{zipcode.zipcode}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{zipcode.dispatchCenter}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{zipcode.originCenter}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{zipcode.returnCenter}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{zipcode.facilityCity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{zipcode.facilityState}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 text-sm rounded-full ${zipcode.outOfDeliveryArea
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {zipcode.outOfDeliveryArea ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleEdit(zipcode)}
                                                        className="text-blue-500 hover:text-blue-700 transition-colors mx-auto"
                                                    >
                                                        <MdEdit size={20} />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <MdDelete
                                                        onClick={() => promptDelete(zipcode._id)}
                                                        size={20}
                                                        className="text-red-500 hover:text-red-700 mx-auto cursor-pointer transition-colors"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                        : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4 text-gray-600">No zipcodes found</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-6 gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalZipcodes)} of {totalZipcodes} entries
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editMode ? 'Edit Zipcode' : 'Create New Zipcode'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2">Zipcode</label>
                                <input
                                    type="number"
                                    required
                                    placeholder='6-digit zipcode'
                                    onWheel={(e) => e.target.blur()}
                                    value={newZipcode.zipcode}
                                    onChange={(e) => setNewZipcode({ ...newZipcode, zipcode: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Dispatch Center</label>
                                    <input
                                        required
                                        placeholder='Dispatch Center'
                                        value={newZipcode.dispatchCenter}
                                        onChange={(e) => setNewZipcode({ ...newZipcode, dispatchCenter: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Origin Center</label>
                                    <input
                                        required
                                        placeholder='Origin Center'
                                        value={newZipcode.originCenter}
                                        onChange={(e) => setNewZipcode({ ...newZipcode, originCenter: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Return Center</label>
                                    <input
                                        required
                                        placeholder='Return Center'
                                        value={newZipcode.returnCenter}
                                        onChange={(e) => setNewZipcode({ ...newZipcode, returnCenter: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Facility City</label>
                                    <input
                                        required
                                        placeholder='Facility City'
                                        value={newZipcode.facilityCity}
                                        onChange={(e) => setNewZipcode({ ...newZipcode, facilityCity: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Facility State</label>
                                    <input
                                        required
                                        placeholder='Facility State'
                                        value={newZipcode.facilityState}
                                        onChange={(e) => setNewZipcode({ ...newZipcode, facilityState: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-center">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={newZipcode.outOfDeliveryArea}
                                            onChange={(e) => setNewZipcode({ ...newZipcode, outOfDeliveryArea: e.target.checked })}
                                            className="form-checkbox"
                                        />
                                        <span>Out of Delivery Area</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setNewZipcode({
                                            zipcode: '',
                                            dispatchCenter: '',
                                            originCenter: '',
                                            returnCenter: '',
                                            facilityCity: '',
                                            outOfDeliveryArea: false,
                                            facilityState: ''
                                        });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {editMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AreaOfServices;