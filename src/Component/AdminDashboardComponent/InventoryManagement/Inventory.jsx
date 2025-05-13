import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaWarehouse, FaChartLine, FaTimes } from 'react-icons/fa';

const InventoryManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [inventory, setInventory] = useState([
        {
            id: 1,
            sku: 'PROD-001',
            name: 'Wireless Headphones',
            category: 'Electronics',
            price: 149.99,
            stock: 25,
            status: 'In Stock',
            lastUpdated: '2024-03-15'
        },
        {
            id: 2,
            sku: 'PROD-002',
            name: 'Running Shoes',
            category: 'Apparel',
            price: 89.99,
            stock: 4,
            status: 'Low Stock',
            lastUpdated: '2024-03-18'
        },
    ]);

    const [newProduct, setNewProduct] = useState({
        sku: '',
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'In Stock'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editItem) {
            // Update existing item
            setInventory(prev => prev.map(item =>
                item.id === editItem.id ? { ...item, ...newProduct } : item
            ));
        } else {
            // Add new item
            setInventory(prev => [...prev, {
                ...newProduct,
                id: prev.length + 1,
                lastUpdated: new Date().toISOString().split('T')[0]
            }]);
        }
        setIsModalOpen(false);
        setNewProduct({ sku: '', name: '', category: '', price: '', stock: '', status: 'In Stock' });
        setEditItem(null);
    };

    const deleteItem = (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    const openEditModal = (item) => {
        setEditItem(item);
        setNewProduct(item);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Stock': return 'bg-green-100 text-green-800';
            case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
            case 'Out of Stock': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 md:p-6 w-full pt-14 md:pt-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 xl:text-3xl">
                        <FaWarehouse className="text-blue-500" /> Inventory Management
                    </h1>
                    <p className="text-gray-600 mt-1">Total Products: {inventory.length}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 h-fit"
                >
                    <FaPlus /> Add Product
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <FaChartLine className="text-blue-500 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Total Stock Value</p>
                            <p className="text-xl font-bold">
                                ${inventory.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                            <FaWarehouse className="text-green-500 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Total In Stock</p>
                            <p className="text-xl font-bold">
                                {inventory.reduce((sum, item) => sum + item.stock, 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                            <FaWarehouse className="text-red-500 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Out of Stock</p>
                            <p className="text-xl font-bold">
                                {inventory.filter(item => item.status === 'Out of Stock').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto rounded-lg border shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">SKU</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Product Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Last Updated</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.map(item => (
                            <tr key={item.id}>
                                <td className="px-4 py-3 text-sm font-medium">{item.sku}</td>
                                <td className="px-4 py-3 text-sm">{item.name}</td>
                                <td className="px-4 py-3 text-sm">{item.category}</td>
                                <td className="px-4 py-3 text-sm">${item.price}</td>
                                <td className="px-4 py-3 text-sm">{item.stock}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm">{item.lastUpdated}</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editItem ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditItem(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={newProduct.sku}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    name="category"
                                    value={newProduct.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Home & Kitchen">Home & Kitchen</option>
                                    <option value="Beauty">Beauty</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={newProduct.stock}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    value={newProduct.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                            >
                                {editItem ? 'Update Product' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;