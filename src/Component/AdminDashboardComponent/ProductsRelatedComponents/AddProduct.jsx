import axios from 'axios';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount_percentage: '',
        stock: '',
        warranty_months: '',
        highlights: [],
        companyName: '',
        specifications: [{ title: "", data: [{ key: "", value: "" }] }],
        images: [],
        description: '',
        category: '',
        warranty_pricing: [{ month: "", price: "" }],
    });
    const [previewImages, setPreviewImages] = useState([]);
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);
    const [loading, setLoading] = useState(false)

    // Remove Image
    const removeImage = (index) => {
        const updatedImages = previewImages.filter((_, i) => i !== index);
        const updatedFileList = formData.images.filter((_, i) => i !== index);

        setPreviewImages(updatedImages);
        setFormData((prev) => ({ ...prev, images: updatedFileList }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setPreviewImages((prev) => [...prev, ...newImages]);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));
    };

    const handleArrayChange = (index, e) => {
        const { name, value } = e.target;
        const updatedArray = [...formData[name]];
        updatedArray[index] = value;
        setFormData(prev => ({ ...prev, [name]: updatedArray }));
    };

    const handleSpecChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSpecs = [...formData.specifications];
        updatedSpecs[index][name] = value; // Update the title field
        setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
    };

    const handleSpecDataChange = (specIndex, dataIndex, e) => {
        const { name, value } = e.target;
        const updatedSpecs = [...formData.specifications];
        updatedSpecs[specIndex].data[dataIndex][name] = value; // Update key or value field
        setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
    };

    const addField = (fieldName) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: [
                ...prev[fieldName],
                fieldName === "specifications" ? { title: "", data: [{ key: "", value: "" }] } : "",
            ],
        }));
    };

    const addSpecDataField = (specIndex) => {
        setFormData((prev) => {
            return {
                ...prev,
                specifications: prev.specifications.map((spec, index) =>
                    index === specIndex
                        ? { ...spec, data: [...spec.data, { key: "", value: "" }] }
                        : spec
                )
            };
        });
    };


    const removeField = (fieldName, index) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: prev[fieldName].filter((_, i) => i !== index),
        }));
    };

    const removeSpecDataField = (specIndex, dataIndex) => {
        setFormData((prev) => {
            return {
                ...prev,
                specifications: prev.specifications.map((spec, index) =>
                    index === specIndex
                        ? { ...spec, data: spec.data.filter((_, i) => i !== dataIndex) }
                        : spec
                )
            };
        });
    };



    const handleWarrantyChange = (index, event) => {
        const { name, value } = event.target;
        const updatedWarranty = [...formData.warranty_pricing];
        updatedWarranty[index][name] = name === "price" ? Number(value) : value;

        setFormData({ ...formData, warranty_pricing: updatedWarranty });
    };


    const addWarrantyField = () => {
        setFormData({
            ...formData,
            warranty_pricing: [...formData.warranty_pricing, { month: "", price: "" }]
        });
    };

    const removeWarrantyField = (index) => {
        const updatedWarranty = [...formData.warranty_pricing];
        updatedWarranty.splice(index, 1);
        setFormData({ ...formData, warranty_pricing: updatedWarranty });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("discount_percentage", formData.discount_percentage);
            formDataToSend.append("stock", formData.stock);
            formDataToSend.append("warranty_months", formData.warranty_months);
            formDataToSend.append("highlights", JSON.stringify(formData.highlights));
            const formattedWarrantyPricing = formData.warranty_pricing.reduce((acc, item) => {
                acc[item.month] = Number(item.price); // Convert price to a number
                return acc;
            }, {});

            formDataToSend.append("warranty_pricing", JSON.stringify(formattedWarrantyPricing));

            const filteredSpecifications = formData.specifications
                .filter(spec => spec.title.trim() !== "") // Ensure title is not empty
                .map(spec => ({
                    title: spec.title.trim(),
                    data: spec.data.filter(item => item.key.trim() !== "" && item.value.trim() !== "") // Filter valid key-value pairs
                }))
                .filter(spec => spec.data.length > 0); // Remove empty specifications (if no valid key-value pairs)

            formDataToSend.append("specificationSchema", JSON.stringify(filteredSpecifications));


            formDataToSend.append("description", formData.description);
            formDataToSend.append("companyName", formData.companyName);
            formDataToSend.append("category", formData.category);
            formData.images.forEach((file) => {
                formDataToSend.append("img", file);
            });


            const response = await axios.post(`${backend}/product/add-product`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                }
            });

            if (response.data.status === "SUCCESS") {
                toast.success("Product added successfully!");
                setLoading(false)
                setFormData({
                    name: "",
                    price: "",
                    discount_percentage: "",
                    stock: "",
                    companyName: '',
                    warranty_months: "",
                    highlights: [],
                    specifications: [{ title: "", data: [{ key: "", value: "" }] }],
                    images: [],
                    description: '',
                    category: '',
                    warranty_pricing: [{ month: "", price: "" }],
                });
                setPreviewImages([]);
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="container mx-auto px-4 py-14 max-w-3xl ">
            <h1 className="text-3xl font-bold mb-8 text-center">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder='Product Name'
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <input
                            type="text"
                            name="category"
                            placeholder='Category'
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            placeholder='Price'
                            value={formData.price}
                            onWheel={(e) => e.target.blur()}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Discount (%)</label>
                        <input
                            type="number"
                            name="discount_percentage"
                            placeholder='Discount'
                            onWheel={(e) => e.target.blur()}
                            value={formData.discount_percentage}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Stock & Warranty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            placeholder='Stock'
                            onWheel={(e) => e.target.blur()}
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Warranty (in Months)</label>
                        <input
                            type="number"
                            name="warranty_months"
                            placeholder='Warranty'
                            onWheel={(e) => e.target.blur()}
                            value={formData.warranty_months}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Company Name */}

                <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        placeholder='Company Name'
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Highlights */}
                <div className="my-8">
                    <label className="block text-sm font-medium mb-2">Product Highlights</label>
                    {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={highlight}
                                placeholder={`Highlight ${index + 1}`}
                                onChange={(e) => handleArrayChange(index, e)}
                                name="highlights"
                                className="flex-1 p-2 border rounded-md"
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeField('highlights', index)}
                                    className="bg-red-500 text-white px-3 rounded-md"
                                >
                                    <IoClose size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addField('highlights')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                        Add Highlight
                    </button>
                </div>

                {/* Specifications */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Specifications</label>
                    {formData.specifications.map((spec, specIndex) => (
                        <div key={specIndex} className="border p-4 mb-4 rounded-md">
                            <input
                                type="text"
                                name="title"
                                placeholder="Specification Title"
                                value={spec.title}
                                onChange={(e) => handleSpecChange(specIndex, e)}
                                className="w-full p-2 border rounded-md mb-2"
                            />

                            {spec.data.map((item, dataIndex) => (
                                <div key={dataIndex} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 items-center">
                                    <input
                                        type="text"
                                        name="key"
                                        placeholder="Key"
                                        value={item.key}
                                        onChange={(e) => handleSpecDataChange(specIndex, dataIndex, e)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="value"
                                            placeholder="Value"
                                            value={item.value}
                                            onChange={(e) => handleSpecDataChange(specIndex, dataIndex, e)}
                                            className="w-full p-2 border rounded-md"
                                        />
                                        {dataIndex > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSpecDataField(specIndex, dataIndex)}
                                                className="bg-red-500 text-white px-3 rounded-md"
                                            >
                                                <IoClose size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addSpecDataField(specIndex)}
                                className="bg-green-500 text-white px-3 py-1 rounded-md mt-2"
                            >
                                Add Data
                            </button>

                            {specIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeField("specifications", specIndex)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md mt-2 ml-2"
                                >
                                    Remove Specification
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => addField("specifications")}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                        Add Specification
                    </button>
                </div>


                {/* Warranty */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Warranty Pricing</label>

                    {formData.warranty_pricing.map((warranty, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 items-center">

                            {/* Warranty Duration (Months) */}
                            <input
                                type="number"
                                name="month"
                                placeholder="Months"
                                onWheel={(e) => e.target.blur()}
                                value={warranty.month}
                                onChange={(e) => handleWarrantyChange(index, e)}
                                className="w-full p-2 border rounded-md"
                            />

                            {/* Warranty Price */}
                            <input
                                type="number"
                                name="price"
                                placeholder="Price (₹)"
                                value={warranty.price}
                                onWheel={(e) => e.target.blur()}
                                onChange={(e) => handleWarrantyChange(index, e)}
                                className="w-full p-2 border rounded-md"
                            />

                            {/* Remove Button */}
                            <div className="flex gap-2">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeWarrantyField(index)}
                                        className="bg-red-500 text-white p-3 rounded-md"
                                    >
                                        <IoClose size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Warranty Button */}
                    <button
                        type="button"
                        onClick={addWarrantyField}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                        Add Warranty
                    </button>
                </div>


                {/* Images Upload */}
                <div className="mb-6 flex flex-col gap-2">
                    <label className="flex flex-col items-center justify-center w-full px-4 py-6 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition">
                        <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                        </svg>
                        <span className="text-sm text-gray-600">Click to upload images</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>

                    <div className="flex gap-2 flex-wrap">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img src={image.url} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white h-7 w-7 flex justify-center items-center rounded-full">
                                    <IoClose size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        placeholder='Description'
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md h-32 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
                >
                    Add Product
                </button>
            </form>
            {
                loading && <LoadingSpinner />
            }
        </div>
    );
};

export default AddProduct;