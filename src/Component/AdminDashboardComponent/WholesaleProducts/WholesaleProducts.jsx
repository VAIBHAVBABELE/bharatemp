import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoClose, IoPencil, IoTrash } from "react-icons/io5";
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND;

const WholesaleProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [wholesaleProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingWholesale, setEditingWholesale] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [wholesaleToDelete, setWholesaleToDelete] = useState(null);
    const [currentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);

    useEffect(() => {
        fetchWholesaleProducts()
    }, []);

    async function fetchAllProducts(products) {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/product/list`, {
                pageNum: currentPage,
                pageSize: productsPerPage,
                filters: {}
            });
            if (response.data.status === "Success") {
                const allProducts = response.data.data.productList;
                const filteredProducts = allProducts.filter(
                    (product) => !products.some(
                        (wholesale) => wholesale.product_id._id === product._id
                    )
                );
                setProducts(filteredProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchWholesaleProducts() {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/wholesale/list`, {
                pageNum: currentPage,
                pageSize: 20,
                filters: {},
            });
            if (response.data.status === "Success") {
                setLoading(false);
                setSelectedProducts(response.data.data.wholesaleProductsList);
                fetchAllProducts(response.data.data.wholesaleProductsList);
            }
        } catch (error) {
            console.error('Error fetching wholesale products:', error);
            setLoading(false);
        }
    }

    const handleEditClick = (wholesaleProduct) => {
        setEditingWholesale({
            ...wholesaleProduct,
            priceBreaks: wholesaleProduct.priceBreaks.map(b => ({ ...b }))
        });
    };

    const handleDeleteClick = (wholesaleId) => {
        setWholesaleToDelete(wholesaleId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!wholesaleToDelete) return;
        setLoading(true);
        try {
            const response = await axios.post(`${backend}/wholesale/${wholesaleToDelete}/remove`, {}, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === "Success") {
                toast.success("Wholesale product deleted successfully.");
                fetchWholesaleProducts();
            }
        } catch (error) {
            console.error("Error deleting wholesale product:", error);
            toast.error("Failed to delete wholesale product.");
        } finally {
            setDeleteModalOpen(false);
            setWholesaleToDelete(null);
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setWholesaleToDelete(null);
    };

    const handleUpdateWholesale = async () => {
        try {
            toast.dismiss()
            // Validation: Check if a product is selected
            if (!editingWholesale || !editingWholesale._id) {
                toast.error("Please select a product.");
                return;
            }

            // Validation: Ensure priceBreaks exist and are not empty
            if (!editingWholesale.priceBreaks || editingWholesale.priceBreaks.length === 0) {
                toast.error("Please add at least one price break.");
                return;
            }

            // Validation: Ensure each price break has valid values
            for (const breakItem of editingWholesale.priceBreaks) {
                if (!breakItem.minQuantity || breakItem.minQuantity < 1) {
                    toast.error("Min Quantity is required and must be at least 1.");
                    return;
                }
                if (breakItem.discount === undefined || breakItem.discount < 0 || breakItem.discount === 0) {
                    toast.error("Discount is required and cannot be negative and cannot be 0.");
                    return;
                }
            }

            setLoading(true);

            const response = await axios.post(
                `${backend}/wholesale/${editingWholesale._id}/update`,
                {
                    priceBreaks: editingWholesale.priceBreaks
                },
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                }
            );

            if (response.data.status === "Success") {
                toast.success("Wholesale product updated successfully.");
                setLoading(false);
                fetchWholesaleProducts();
                setEditingWholesale(null);
            }
        } catch (error) {
            console.error("Error updating wholesale product:", error);
            setLoading(false);
            toast.error("Failed to update wholesale product.");
        }
    };

    const handleAddClick = (product) => {
        setSelectedProduct({
            ...product,
            priceBreaks: [{ minQuantity: 1, discount: 0 }]
        });
    };

    const handlePriceBreakChange = (index, field, value) => {
        if (editingWholesale) {
            // Update price break for editing wholesale product
            setEditingWholesale(prev => {
                const newPriceBreaks = prev.priceBreaks.map((breakItem, i) =>
                    i === index ? { ...breakItem, [field]: value } : breakItem
                );

                return {
                    ...prev,
                    priceBreaks: newPriceBreaks
                };
            });
        } else {
            // Update price break for new wholesale product
            setSelectedProduct(prev => {
                const newPriceBreaks = prev.priceBreaks.map((breakItem, i) =>
                    i === index ? { ...breakItem, [field]: value } : breakItem
                );

                return {
                    ...prev,
                    priceBreaks: newPriceBreaks
                };
            });
        }
    };

    const addPriceBreak = () => {
        if (editingWholesale) {
            // Add price break for editing wholesale product
            setEditingWholesale(prev => ({
                ...prev,
                priceBreaks: [
                    ...prev.priceBreaks,
                    { minQuantity: 1, discount: 0 }
                ]
            }));
        } else {
            // Add price break for new wholesale product
            setSelectedProduct(prev => ({
                ...prev,
                priceBreaks: [
                    ...prev.priceBreaks,
                    { minQuantity: 1, discount: 0 }
                ]
            }));
        }
    };

    const removePriceBreak = (index) => {
        if (editingWholesale) {
            // Remove price break for editing wholesale product
            const filteredBreaks = editingWholesale.priceBreaks.filter((_, i) => i !== index);
            setEditingWholesale(prev => ({
                ...prev,
                priceBreaks: filteredBreaks
            }));
        } else {
            // Remove price break for new wholesale product
            const filteredBreaks = selectedProduct.priceBreaks.filter((_, i) => i !== index);
            setSelectedProduct(prev => ({
                ...prev,
                priceBreaks: filteredBreaks
            }));
        }
    };

    const handleSaveWholesale = async () => {
        try {
            toast.dismiss()
            // Validation: Check if a product is selected
            if (!selectedProduct || !selectedProduct._id) {
                toast.error("Please select a product.");
                return;
            }

            // Validation: Ensure priceBreaks exist and are not empty
            if (!selectedProduct.priceBreaks || selectedProduct.priceBreaks.length === 0) {
                toast.error("Please add at least one price break.");
                return;
            }

            // Validation: Ensure each price break has valid values
            for (const breakItem of selectedProduct.priceBreaks) {
                if (!breakItem.minQuantity || breakItem.minQuantity < 1) {
                    toast.error("Min Quantity is required and must be at least 1.");
                    return;
                }
                if (breakItem.discount === undefined || breakItem.discount < 0 || breakItem.discount === 0) {
                    toast.error("Discount is required and cannot be negative and cannot be 0.");
                    return;
                }
            }

            setLoading(true);

            const wholesaleData = {
                product_id: selectedProduct._id,
                priceBreaks: selectedProduct.priceBreaks
            };

            const response = await axios.post(
                `${backend}/wholesale/new`,
                wholesaleData,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                }
            );

            if (response.data.status === "Success") {
                toast.success("Wholesale product added successfully.");
                setLoading(false);
                fetchWholesaleProducts();
                setSelectedProduct(null);
                setShowAllProducts(false);
            }
        } catch (error) {
            console.error("Error saving wholesale data:", error);
            setLoading(false);
            toast.error("Failed to save wholesale product. Please try again.");
        }
    };

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="container mx-auto p-5 md:px-10 pt-14 bg-gradient-to-b from-gray-50 to-blue-50">
            <h1 className="text-2xl font-bold mb-6 lg:text-4xl">Wholesale & Bulk Products Management</h1>

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    {showAllProducts ? 'View Wholesale Products' : 'Add New Wholesale Products'}
                </button>
            </div>

            {
                loading && <LoadingSpinner />
            }

            {showAllProducts ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold mb-4">All Products</h2>
                    {products?.length === 0 ? (
                        <div className="text-gray-500">No products found</div>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="border p-4 rounded-lg">
                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{product.name}</h3>
                                        <p className="text-gray-600">₹{product.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddClick(product)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Add Wholesale
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold mb-4">Wholesale Products</h2>
                    {wholesaleProducts?.length === 0 ? (
                        <div className="text-gray-500">No wholesale products added yet</div>
                    ) : (
                        wholesaleProducts?.map(product => (
                            <div key={product._id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={product.product_id.image?.[0] || '/placeholder.jpg'}
                                            alt={product.product_id.name}
                                            className="w-16 h-16 object-cover rounded-md border"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-lg">{product.product_id.name}</h3>
                                            <p className="text-gray-600">₹{product.product_id.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="p-2 text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <IoPencil size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product._id)}
                                            className="p-2 text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <IoTrash size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Price Breaks Section */}
                                <div className="space-y-2">
                                    {product.priceBreaks?.length > 0 ? (
                                        product.priceBreaks.map((breakItem, index) => (
                                            <div key={breakItem._id || index} className="flex gap-2 text-sm bg-gray-100 p-2 rounded">
                                                <span className="font-medium">
                                                    {breakItem.minQuantity}
                                                    {breakItem.maxQuantity ? ` - ${breakItem.maxQuantity}` : `+`} Pieces
                                                </span>
                                                <span className="text-blue-600">₹{breakItem.discount} discount</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No price breaks available</p>
                                    )}
                                </div>
                            </div>
                        ))

                    )}
                </div>
            )}

            {(selectedProduct || editingWholesale) && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex z-50 items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-scroll" style={{
                        scrollbarWidth: 'none'
                    }}>
                        <h2 className="text-xl font-bold mb-4">
                            {editingWholesale ? 'Edit' : 'Configure'} Wholesale for {editingWholesale?.product?.name || selectedProduct?.name}
                        </h2>

                        <div className="space-y-4">
                            {(editingWholesale?.priceBreaks || selectedProduct?.priceBreaks)?.map((breakItem, index) => (
                                <div key={index} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-1">
                                            Min Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={breakItem.minQuantity}
                                            onChange={(e) => handlePriceBreakChange(
                                                index,
                                                'minQuantity',
                                                parseInt(e.target.value)
                                            )}
                                            className="w-full p-2 border rounded"
                                            min="1"
                                            step="1"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-1">
                                            Max Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={breakItem.maxQuantity || ''}
                                            onChange={(e) => handlePriceBreakChange(
                                                index,
                                                'maxQuantity',
                                                e.target.value ? parseInt(e.target.value) : null
                                            )}
                                            className="w-full p-2 border rounded"
                                            min={breakItem.minQuantity + 1}
                                            step="1"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-1">
                                            Discount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={breakItem.discount}
                                            onChange={(e) => handlePriceBreakChange(
                                                index,
                                                'discount',
                                                parseInt(e.target.value)
                                            )}
                                            className="w-full p-2 border rounded"
                                            min="0"
                                            step="1"
                                        />
                                    </div>

                                    {index > 0 && (
                                        <button
                                            onClick={() => removePriceBreak(index)}
                                            className="text-red-600 hover:text-red-800 pb-2"
                                        >
                                            <IoClose size={30} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={addPriceBreak}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                + Add Price Break
                            </button>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setEditingWholesale(null);
                                }}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingWholesale ? handleUpdateWholesale : handleSaveWholesale}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                {editingWholesale ? 'Update' : 'Save'} Wholesale
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex z-50 items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this wholesale product? This action cannot be undone.</p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WholesaleProductsPage;