import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../utils/LoadingSpinner";

const backend = import.meta.env.VITE_BACKEND;

const EditProduct = ({ selectedProduct, onOpen, onClose, fetchAllProducts }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        discount_percentage: "",
        new_price: "",
        stock: "",
        warranty_months: "",
        highlights: [],
        specificationSchema: [],
        description: "",
        category: "",
        warranty_pricing: {}, // Initialize as an empty array
        companyName: '',
    });
    const [tempWarranty, setTempWarranty] = useState({ month: "", price: "" });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (onOpen && selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                price: selectedProduct.price,
                discount_percentage: selectedProduct.discount_percentage,
                new_price: selectedProduct.new_price,
                stock: selectedProduct.stock,
                warranty_months: selectedProduct.warranty_months,
                highlights: selectedProduct.highlights || [],
                specificationSchema: selectedProduct.specificationSchema || [],
                description: selectedProduct.description,
                category: selectedProduct.category,
                warranty_pricing: selectedProduct.warranty_pricing || {},
                companyName: selectedProduct.companyName
            });

            setExistingImages(selectedProduct.image || []);
            setNewImages([]);
        }
    }, [onOpen, selectedProduct]);

    useEffect(() => {
        const newImagePreviews = newImages.map(file => URL.createObjectURL(file));
        setPreviewImages([...existingImages, ...newImagePreviews]);
    }, [existingImages, newImages]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        if (index < existingImages.length) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            const newIndex = index - existingImages.length;
            setNewImages(prev => prev.filter((_, i) => i !== newIndex));
        }
    };

    // Save warranty pricing only when "Save" button is clicked
    const saveWarrantyOption = () => {
        setFormData((prev) => {
            const updatedWarrantyPricing = { ...prev.warranty_pricing };
            const { month, price } = tempWarranty;

            // Validate month is a positive integer
            const numericMonth = parseInt(month, 10);
            if (!month || isNaN(numericMonth) || numericMonth <= 0) {
                alert("Please enter a valid month.");
                return prev;
            }

            // Check if month already exists
            if (updatedWarrantyPricing[month]) {
                alert("This month already exists!");
                return prev;
            }

            // Store the new warranty pricing
            updatedWarrantyPricing[month] = price || "";

            return { ...prev, warranty_pricing: updatedWarrantyPricing };
        });

        // Clear temporary input
        setTempWarranty({ month: "", price: "" });
    };

    // Remove warranty option
    const removeWarrantyOption = (month) => {
        setFormData((prev) => {
            const updatedWarrantyPricing = { ...prev.warranty_pricing };
            delete updatedWarrantyPricing[month];
            return { ...prev, warranty_pricing: updatedWarrantyPricing };
        });
    };

    const handleHighlightChange = (index, e) => {
        const newHighlights = [...formData.highlights];
        newHighlights[index] = e.target.value;
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };

    // Handle change in specification title
    const handleSpecChange = (index, e) => {
        const { value } = e.target;
        const updatedSpecs = [...formData.specificationSchema];
        updatedSpecs[index] = { ...updatedSpecs[index], title: value };
        setFormData(prev => ({ ...prev, specificationSchema: updatedSpecs }));
    };

    // Handle change in key-value pairs
    const handleSpecDataChange = (specIndex, dataIndex, e) => {
        const { name, value } = e.target;
        const updatedSpecs = [...formData.specificationSchema];
        updatedSpecs[specIndex].data[dataIndex][name] = value;
        setFormData(prev => ({ ...prev, specificationSchema: updatedSpecs }));
    };

    // Add new specification
    const addSpecification = () => {
        setFormData(prev => ({
            ...prev,
            specificationSchema: [...prev.specificationSchema, { title: "", data: [] }]
        }));
    };

    // Add key-value pair to a specification
    const addSpecDataField = (specIndex) => {
        setFormData(prev => {

            const updatedSpecs = [...prev.specificationSchema];
            const updatedData = [...updatedSpecs[specIndex].data];

            updatedData.push({ key: "", value: "" });
            updatedSpecs[specIndex] = { ...updatedSpecs[specIndex], data: updatedData };


            return { ...prev, specificationSchema: updatedSpecs };
        });
    };


    // Remove key-value pair from a specification
    const removeSpecDataField = (specIndex, dataIndex) => {
        setFormData(prev => {
            const updatedSpecs = [...prev.specificationSchema]; // Copy specificationSchema
            const updatedData = [...updatedSpecs[specIndex].data]; // Copy data array

            updatedData.splice(dataIndex, 1); // Remove only one item

            updatedSpecs[specIndex] = { ...updatedSpecs[specIndex], data: updatedData }; // Update specification

            return { ...prev, specificationSchema: updatedSpecs };
        });
    };


    // Remove entire specification
    const removeSpecification = (index) => {
        setFormData(prev => ({
            ...prev,
            specificationSchema: prev.specificationSchema.filter((_, i) => i !== index)
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formDataToSend = new FormData();

            // Append basic fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'highlights' || key === 'specificationSchema' || key === 'warranty_pricing') {
                    formDataToSend.append(key, JSON.stringify(value));
                } else if (value !== null) {
                    formDataToSend.append(key, value);
                }
            });

            // Append images
            formDataToSend.append("existingImages", JSON.stringify(existingImages));
            newImages.forEach(file => formDataToSend.append("img", file));

            const response = await axios.post(
                `${backend}/product/${selectedProduct._id}/update/v2`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                    },
                }
            );
            if (response.data.status === "Success") {
                toast.success("Product updated successfully!");
                onClose();
                fetchAllProducts()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating product");
        } finally {
            setLoading(false);
        }
    };


    return (
        onOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative max-h-screen overflow-y-auto">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={onClose}>
                        <IoClose size={22} />
                    </button>

                    <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Product Name */}
                            <div>
                                <label className="block mb-1 font-medium">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            {/* Company Name */}
                            <div>
                                <label className="block mb-1 font-medium">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Warranty (in Months)</label>
                                <input
                                    type="text"
                                    name="warranty_months"
                                    value={formData.warranty_months}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>


                        {/* Description */}
                        <div>
                            <label className="block mb-1 font-medium">Description</label>
                            <textarea
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md h-40 resize-none"
                            />
                        </div>

                        {/* Pricing Section */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    onWheel={(e) => e.target.blur()}
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount_percentage"
                                    onWheel={(e) => e.target.blur()}
                                    value={formData.discount_percentage}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    onWheel={(e) => e.target.blur()}
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Images Section */}
                        <div>
                            <label className="block mb-1 font-medium">Product Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="p-2 border rounded-md w-full"
                            />
                            <div className="flex gap-2 flex-wrap mt-2">
                                {previewImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white h-6 w-6 flex justify-center items-center rounded-full"
                                        >
                                            <IoClose size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Warranty Pricing</label>

                            {Object.entries(formData.warranty_pricing || {}).map(([month, price]) => (
                                <div key={month} className="flex gap-2 mb-2">
                                    <input
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        value={month}
                                        disabled
                                        className="p-2 border rounded-md w-1/2 bg-gray-100"
                                    />
                                    <input
                                        type="number"
                                        value={price}
                                        onWheel={(e) => e.target.blur()}
                                        disabled
                                        className="p-2 border rounded-md w-1/2 bg-gray-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeWarrantyOption(month)}
                                        className="bg-red-500 text-white px-3 rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            {/* Inputs for new warranty pricing */}
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    value={tempWarranty.month}
                                    onChange={(e) => setTempWarranty({ ...tempWarranty, month: e.target.value })}
                                    className="p-2 border rounded-md w-1/2"
                                    placeholder="Enter Months"
                                />
                                <input
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    value={tempWarranty.price}
                                    onChange={(e) => setTempWarranty({ ...tempWarranty, price: e.target.value })}
                                    className="p-2 border rounded-md w-1/2"
                                    placeholder="Enter Price (₹)"
                                />
                                <button
                                    type="button"
                                    onClick={saveWarrantyOption}
                                    className="bg-blue-500 text-white px-3 rounded-md"
                                >
                                    Save
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setTempWarranty({ month: "", price: "" })}
                                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                            >
                                Add Warranty Option
                            </button>
                        </div>


                        {/* Highlights Section */}
                        <div>
                            <label className="block mb-1 font-medium">Highlights</label>
                            {formData.highlights.map((highlight, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={highlight}
                                        onChange={(e) => handleHighlightChange(index, e)}
                                        className="flex-1 p-2 border rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            highlights: prev.highlights.filter((_, i) => i !== index)
                                        }))}
                                        className="bg-red-500 text-white px-3 rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    highlights: [...prev.highlights, ""]
                                }))}
                                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                            >
                                Add Highlight
                            </button>
                        </div>

                        {/* Specifications Section */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Specifications</label>

                            {formData.specificationSchema.map((spec, specIndex) => (
                                <div key={specIndex} className="border p-3 mb-4 rounded-md">
                                    {/* Title Input */}
                                    <input
                                        type="text"
                                        name="title"
                                        value={spec.title}
                                        onChange={(e) => handleSpecChange(specIndex, e)}
                                        placeholder="Title"
                                        className="p-2 border rounded-md w-full mb-2"
                                    />

                                    {/* Key-Value Pairs */}
                                    {spec.data.map((item, dataIndex) => (
                                        <div key={dataIndex} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                name="key"
                                                value={item.key}
                                                onChange={(e) => handleSpecDataChange(specIndex, dataIndex, e)}
                                                placeholder="Key"
                                                className="p-2 border rounded-md w-full"
                                            />
                                            <input
                                                type="text"
                                                name="value"
                                                value={item.value}
                                                onChange={(e) => handleSpecDataChange(specIndex, dataIndex, e)}
                                                placeholder="Value"
                                                className="p-2 border rounded-md w-full"
                                            />
                                            {/* Remove Key-Value Pair */}
                                            <button
                                                type="button"
                                                onClick={() => removeSpecDataField(specIndex, dataIndex)}
                                                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Key-Value Pair */}
                                    <button
                                        type="button"
                                        onClick={() => addSpecDataField(specIndex)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition-colors"
                                    >
                                        Add Data
                                    </button>

                                    {/* Remove Entire Specification */}
                                    <button
                                        type="button"
                                        onClick={() => removeSpecification(specIndex)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-red-600 transition-colors"
                                    >
                                        Remove Specification
                                    </button>
                                </div>
                            ))}

                            {/* Add Specification */}
                            <button
                                type="button"
                                onClick={addSpecification}
                                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600 transition-colors w-full sm:w-auto"
                            >
                                Add Specification
                            </button>
                        </div>


                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                    </form>

                    {loading && <LoadingSpinner />}
                </div>
            </div>
        )
    );
};

export default EditProduct;