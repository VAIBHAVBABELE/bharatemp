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
        category_id: '',
        category_name: '',
        sub_category_id: '',
        sub_category_name: '',
        sub_sub_category_name: '',
        
        brand_id: '',
        brand_name: '',
        
        SKU: '',
        product_name: '',
        
        product_image_main: null,
        product_image_sub: [],
        
        product_type: '',
        model: '',
        
        product_instock: true,
        no_of_product_instock: 0,
        
        product_feature: '',
        product_overview: '',
        specifications: [{ title: "", data: [{ key: "", value: "" }] }],
        product_description: '',
        product_caution: '',
        product_warranty: '',
        
        product_dimension_height: '',
        product_dimension_length_breadth: '',
        product_dimension_weight: '',
        
        product_time: '',
        
        non_discounted_price: '',
        discounted_single_product_price: '',
        discount: '',
        discounted_price_with_gst: '',
        
        multiple_quantity_price_5_10: '',
        multiple_quantity_price_10_20: '',
        multiple_quantity_price_20_50: '',
        multiple_quantity_price_50_100: '',
        multiple_quantity_price_100_plus: '',
        
        no_of_reviews: 0,
        review_stars: 0,
        
        product_colour: '',
        product_video_link: '',
        product_manual_link: '',
        
        package_include: '',
        product_tags: [],
        coupon: '',
    });
    const [previewImages, setPreviewImages] = useState([]);
    const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);
    const [loading, setLoading] = useState(false)

    // Remove Image
    const removeImage = (index) => {
        const updatedImages = previewImages.filter((_, i) => i !== index);
        const updatedFileList = formData.product_image_sub.filter((_, i) => i !== index);

        setPreviewImages(updatedImages);
        setFormData((prev) => ({ ...prev, product_image_sub: updatedFileList }));
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
            product_image_sub: [...prev.product_image_sub, ...files],
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
            setLoading(true);

            // Validate required fields
            if (!formData.category_id || !formData.category_name || !formData.sub_category_id || !formData.SKU || !formData.product_name) {
                toast.error("Please fill in all required fields: Category ID, Category Name, Sub Category ID, SKU, and Product Name");
                setLoading(false);
                return;
            }

            // Validate images
            if (!formData.product_image_sub.length) {
                toast.error("Please upload at least one image");
                setLoading(false);
                return;
            }

            const formDataToSend = new FormData();
            
            // Basic Information - Required Fields
            formDataToSend.append("category_id", Number(formData.category_id));
            formDataToSend.append("category_name", formData.category_name);
            formDataToSend.append("sub_category_id", Number(formData.sub_category_id));
            formDataToSend.append("sub_category_name", formData.sub_category_name);
            formDataToSend.append("sub_sub_category_name", formData.sub_sub_category_name);
            
            // Brand Information
            if (formData.brand_id) formDataToSend.append("brand_id", Number(formData.brand_id));
            formDataToSend.append("brand_name", formData.brand_name);
            
            // Product Basic Information
            formDataToSend.append("SKU", formData.SKU);
            formDataToSend.append("product_name", formData.product_name);
            
            // Images - Append all images with the same field name "img"
            formData.product_image_sub.forEach((file) => {
                formDataToSend.append("img", file);
            });
            
            // Product Details
            formDataToSend.append("product_type", formData.product_type);
            formDataToSend.append("model", formData.model);
            
            // Stock Information
            formDataToSend.append("product_instock", formData.product_instock);
            if (formData.no_of_product_instock) {
                formDataToSend.append("no_of_product_instock", Number(formData.no_of_product_instock));
            }
            
            // Product Features and Details
            formDataToSend.append("product_feature", formData.product_feature);
            formDataToSend.append("product_overview", formData.product_overview);

            // Filter and format specifications
            const filteredSpecifications = formData.specifications
                .filter(spec => spec.title.trim() !== "")
                .map(spec => ({
                    title: spec.title.trim(),
                    data: spec.data
                        .filter(item => item.key.trim() !== "" && item.value.trim() !== "")
                        .map(item => ({
                            key: item.key.trim(),
                            value: item.value.trim()
                        }))
                }))
                .filter(spec => spec.data.length > 0);

            formDataToSend.append("product_specification", JSON.stringify(filteredSpecifications));
            
            formDataToSend.append("product_description", formData.product_description);
            formDataToSend.append("product_caution", formData.product_caution);
            formDataToSend.append("product_warranty", formData.product_warranty);
            
            // Dimensions
            formDataToSend.append("product_dimension_height", formData.product_dimension_height);
            formDataToSend.append("product_dimension_length_breadth", formData.product_dimension_length_breadth);
            formDataToSend.append("product_dimension_weight", formData.product_dimension_weight);
            
            formDataToSend.append("product_time", formData.product_time);
            
            // Pricing Information - Convert to numbers
            if (formData.non_discounted_price) {
                formDataToSend.append("non_discounted_price", Number(formData.non_discounted_price));
            }
            if (formData.discounted_single_product_price) {
                formDataToSend.append("discounted_single_product_price", Number(formData.discounted_single_product_price));
            }
            if (formData.discount) {
                formDataToSend.append("discount", Number(formData.discount));
            }
            if (formData.discounted_price_with_gst) {
                formDataToSend.append("discounted_price_with_gst", Number(formData.discounted_price_with_gst));
            }
            
            // Multiple Quantity Pricing - Convert to numbers
            if (formData.multiple_quantity_price_5_10) {
                formDataToSend.append("multiple_quantity_price_5_10", Number(formData.multiple_quantity_price_5_10));
            }
            if (formData.multiple_quantity_price_10_20) {
                formDataToSend.append("multiple_quantity_price_10_20", Number(formData.multiple_quantity_price_10_20));
            }
            if (formData.multiple_quantity_price_20_50) {
                formDataToSend.append("multiple_quantity_price_20_50", Number(formData.multiple_quantity_price_20_50));
            }
            if (formData.multiple_quantity_price_50_100) {
                formDataToSend.append("multiple_quantity_price_50_100", Number(formData.multiple_quantity_price_50_100));
            }
            if (formData.multiple_quantity_price_100_plus) {
                formDataToSend.append("multiple_quantity_price_100_plus", Number(formData.multiple_quantity_price_100_plus));
            }
            
            // Reviews - Convert to numbers
            if (formData.no_of_reviews) {
                formDataToSend.append("no_of_reviews", Number(formData.no_of_reviews));
            }
            if (formData.review_stars) {
                formDataToSend.append("review_stars", Number(formData.review_stars));
            }
            
            // Additional Information
            formDataToSend.append("product_colour", formData.product_colour);
            formDataToSend.append("product_video_link", formData.product_video_link);
            formDataToSend.append("product_manual_link", formData.product_manual_link);
            
            formDataToSend.append("package_include", formData.package_include);
            formDataToSend.append("product_tags", JSON.stringify(formData.product_tags));
            formDataToSend.append("coupon", formData.coupon);

            const response = await axios.post(`${backend}/product/add-product`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                }
            });

            if (response.data.status === "SUCCESS") {
                toast.success("Product added successfully!");
                setLoading(false);
                // Reset form to initial state
                setFormData({
                    category_id: '',
                    category_name: '',
                    sub_category_id: '',
                    sub_category_name: '',
                    sub_sub_category_name: '',
                    brand_id: '',
                    brand_name: '',
                    SKU: '',
                    product_name: '',
                    product_image_main: null,
                    product_image_sub: [],
                    product_type: '',
                    model: '',
                    product_instock: true,
                    no_of_product_instock: 0,
                    product_feature: '',
                    product_overview: '',
                    specifications: [{ title: "", data: [{ key: "", value: "" }] }],
                    product_description: '',
                    product_caution: '',
                    product_warranty: '',
                    product_dimension_height: '',
                    product_dimension_length_breadth: '',
                    product_dimension_weight: '',
                    product_time: '',
                    non_discounted_price: '',
                    discounted_single_product_price: '',
                    discount: '',
                    discounted_price_with_gst: '',
                    multiple_quantity_price_5_10: '',
                    multiple_quantity_price_10_20: '',
                    multiple_quantity_price_20_50: '',
                    multiple_quantity_price_50_100: '',
                    multiple_quantity_price_100_plus: '',
                    no_of_reviews: 0,
                    review_stars: 0,
                    product_colour: '',
                    product_video_link: '',
                    product_manual_link: '',
                    package_include: '',
                    product_tags: [],
                    coupon: '',
                });
                setPreviewImages([]);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.data?.message || "Failed to add product");
            setLoading(false);
        }
    };

    if (!isAuthorized) {
        return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
    }

    return (
        <div className="container mx-auto px-4 py-14 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                {/* Category Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Category ID</label>
                        <input
                            type="number"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Category Name</label>
                        <input
                            type="text"
                            name="category_name"
                            value={formData.category_name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Sub Category ID</label>
                        <input
                            type="number"
                            name="sub_category_id"
                            value={formData.sub_category_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Sub Category Name</label>
                        <input
                            type="text"
                            name="sub_category_name"
                            value={formData.sub_category_name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Sub Sub Category Name</label>
                        <input
                            type="text"
                            name="sub_sub_category_name"
                            value={formData.sub_sub_category_name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Brand Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Brand ID</label>
                        <input
                            type="number"
                            name="brand_id"
                            value={formData.brand_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Brand Name</label>
                        <input
                            type="text"
                            name="brand_name"
                            value={formData.brand_name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Product Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">SKU</label>
                        <input
                            type="text"
                            name="SKU"
                            value={formData.SKU}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Name</label>
                        <input
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                </div>

                {/* Product Type and Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Type</label>
                        <input
                            type="text"
                            name="product_type"
                            value={formData.product_type}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Model</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Stock Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Product In Stock</label>
                        <select
                            name="product_instock"
                            value={formData.product_instock}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                <div>
                        <label className="block text-sm font-medium mb-2">Number of Products in Stock</label>
                    <input
                            type="number"
                            name="no_of_product_instock"
                            value={formData.no_of_product_instock}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    />
                    </div>
                </div>

                {/* Product Details */}
                <div className="mb-8">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Product Feature</label>
                        <textarea
                            name="product_feature"
                            value={formData.product_feature}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md h-32"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Product Overview</label>
                        <textarea
                            name="product_overview"
                            value={formData.product_overview}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md h-32"
                        />
                        </div>
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

                <div className="mb-8">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Product Description</label>
                        <textarea
                            name="product_description"
                            value={formData.product_description}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md h-32"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Product Caution</label>
                        <textarea
                            name="product_caution"
                            value={formData.product_caution}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md h-32"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Product Warranty</label>
                        <textarea
                            name="product_warranty"
                            value={formData.product_warranty}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Product Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Height</label>
                        <input
                            type="text"
                            name="product_dimension_height"
                            value={formData.product_dimension_height}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Length/Breadth</label>
                        <input
                            type="text"
                            name="product_dimension_length_breadth"
                            value={formData.product_dimension_length_breadth}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Weight</label>
                        <input
                            type="text"
                            name="product_dimension_weight"
                            value={formData.product_dimension_weight}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Product Time */}
                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2">Product Time</label>
                    <input
                        type="text"
                        name="product_time"
                        value={formData.product_time}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Pricing Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Non-Discounted Price</label>
                        <input
                            type="number"
                            name="non_discounted_price"
                            value={formData.non_discounted_price}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Discounted Single Product Price</label>
                        <input
                            type="number"
                            name="discounted_single_product_price"
                            value={formData.discounted_single_product_price}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Discount</label>
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Discounted Price with GST</label>
                        <input
                            type="number"
                            name="discounted_price_with_gst"
                            value={formData.discounted_price_with_gst}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Multiple Quantity Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Price (5-10 units)</label>
                        <input
                            type="number"
                            name="multiple_quantity_price_5_10"
                            value={formData.multiple_quantity_price_5_10}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Price (10-20 units)</label>
                        <input
                            type="number"
                            name="multiple_quantity_price_10_20"
                            value={formData.multiple_quantity_price_10_20}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Price (20-50 units)</label>
                        <input
                            type="number"
                            name="multiple_quantity_price_20_50"
                            value={formData.multiple_quantity_price_20_50}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Price (50-100 units)</label>
                        <input
                            type="number"
                            name="multiple_quantity_price_50_100"
                            value={formData.multiple_quantity_price_50_100}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Price (100+ units)</label>
                            <input
                                type="number"
                            name="multiple_quantity_price_100_plus"
                            value={formData.multiple_quantity_price_100_plus}
                            onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            />
                    </div>
                </div>

                {/* Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Number of Reviews</label>
                            <input
                                type="number"
                            name="no_of_reviews"
                            value={formData.no_of_reviews}
                            onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Review Stars</label>
                        <input
                            type="number"
                            name="review_stars"
                            value={formData.review_stars}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            min="0"
                            max="5"
                            step="0.1"
                        />
                            </div>
                        </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Color</label>
                        <input
                            type="text"
                            name="product_colour"
                            value={formData.product_colour}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Video Link</label>
                        <input
                            type="url"
                            name="product_video_link"
                            value={formData.product_video_link}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Manual Link</label>
                        <input
                            type="url"
                            name="product_manual_link"
                            value={formData.product_manual_link}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Package Include and Tags */}
                <div className="mb-8">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Package Include</label>
                        <textarea
                            name="package_include"
                            value={formData.package_include}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Product Tags</label>
                        <input
                            type="text"
                            name="product_tags"
                            value={formData.product_tags.join(', ')}
                            onChange={(e) => setFormData({
                                ...formData,
                                product_tags: e.target.value.split(',').map(tag => tag.trim())
                            })}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter tags separated by commas"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Coupon</label>
                        <input
                            type="text"
                            name="coupon"
                            value={formData.coupon}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
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

                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
                >
                    Add Product
                </button>
            </form>
            {loading && <LoadingSpinner />}
        </div>
    );
};

export default AddProduct;