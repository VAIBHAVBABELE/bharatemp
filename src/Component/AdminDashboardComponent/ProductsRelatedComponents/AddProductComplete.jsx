import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FiUpload, FiX, FiPlus, FiMinus, FiSave } from "react-icons/fi";
import { useAdminRouteProtection } from "../../../utils/AuthUtils";
import UnauthorizedPopup from "../../../utils/UnAuthorizedPopup";
import ImageUpload from "../ImageUpload/ImageUpload.jsx";

const backend = import.meta.env.VITE_BACKEND;

const AddProductComplete = () => {
  const [formData, setFormData] = useState({
    // Required Fields
    category_id: "",
    category_name: "",
    sub_category_id: "",
    SKU: "",
    product_name: "",

    // Optional Category Fields
    sub_category_name: "",
    sub_sub_category_name: "",

    // Brand Info
    brand_id: "",
    brand_name: "",

    // Images
    product_image_main: "",
    product_image_sub: [],
    product_image_urls: [],

    // Product Details
    product_type: "",
    model: "",

    // Stock Management
    product_instock: true,
    no_of_product_instock: 0,

    // Product Information
    product_feature: "",
    product_overview: "",
    product_specification: [
      { title: "Specifications", data: [{ key: "", value: "" }] },
    ],
    product_description: "",
    product_caution: "",
    product_warranty: "",

    // Dimensions
    product_dimension_height: "",
    product_dimension_length_breadth: "",
    product_dimension_weight: "",

    // Timing
    product_time: "",

    // Pricing
    non_discounted_price: "",
    discounted_single_product_price: "",
    discount: "",
    discounted_price_with_gst: "",

    gst_percent: "",

    // Quantity Discounts
    quantity_discounts: [],

    // Bulk Order Availability
    is_available_for_bulk_order: false,

    // Reviews
    no_of_reviews: 0,
    review_stars: 0,

    // Additional Info
    product_colour: "",
    product_video_link: "",
    product_manual_link: "",
    package_include: "",
    product_tags: [],
    coupon: "",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection([
    "SuperAdmin",
  ]);

  // Calculate GST-inclusive price whenever selling price or GST percent changes
  useEffect(() => {
    const sellingPrice =
      parseFloat(formData.discounted_single_product_price) || 0;
    const gstPercent = parseFloat(formData.gst_percent) || 0;

    if (sellingPrice > 0 && gstPercent > 0) {
      const gstAmount = (sellingPrice * gstPercent) / 100;
      const finalPrice = sellingPrice + gstAmount;
      setFormData((prev) => ({
        ...prev,
        discounted_price_with_gst: finalPrice.toFixed(2),
      }));
    } else if (sellingPrice > 0) {
      setFormData((prev) => ({
        ...prev,
        discounted_price_with_gst: sellingPrice.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        discounted_price_with_gst: "",
      }));
    }
  }, [formData.discounted_single_product_price, formData.gst_percent]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Specification Management
  const handleSpecChange = (specIndex, dataIndex, field, value) => {
    const newSpecs = [...formData.product_specification];
    if (field === "title") {
      newSpecs[specIndex].title = value;
    } else {
      newSpecs[specIndex].data[dataIndex][field] = value;
    }
    setFormData((prev) => ({ ...prev, product_specification: newSpecs }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      product_specification: [
        ...prev.product_specification,
        { title: "", data: [{ key: "", value: "" }] },
      ],
    }));
  };

  const removeSpecification = (index) => {
    if (formData.product_specification.length > 1) {
      const newSpecs = formData.product_specification.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, product_specification: newSpecs }));
    }
  };

  const addSpecData = (specIndex) => {
    const newSpecs = [...formData.product_specification];
    newSpecs[specIndex].data.push({ key: "", value: "" });
    setFormData((prev) => ({ ...prev, product_specification: newSpecs }));
  };

  const removeSpecData = (specIndex, dataIndex) => {
    const newSpecs = [...formData.product_specification];
    if (newSpecs[specIndex].data.length > 1) {
      newSpecs[specIndex].data = newSpecs[specIndex].data.filter(
        (_, i) => i !== dataIndex
      );
      setFormData((prev) => ({ ...prev, product_specification: newSpecs }));
    }
  };

  // Quantity Discount Management
  const addQuantityDiscount = () => {
    setFormData((prev) => ({
      ...prev,
      quantity_discounts: [
        ...prev.quantity_discounts,
        {
          title: "",
          min_quantity: "",
          max_quantity: "",
          discount_percentage: "",
        },
      ],
    }));
  };

  const removeQuantityDiscount = (index) => {
    const newDiscounts = formData.quantity_discounts.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, quantity_discounts: newDiscounts }));
  };

  const handleQuantityDiscountChange = (index, field, value) => {
    const newDiscounts = [...formData.quantity_discounts];
    newDiscounts[index][field] = value;
    setFormData((prev) => ({ ...prev, quantity_discounts: newDiscounts }));
  };

  // Image Management
  const removeImage = (index) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    const updatedUrls = formData.product_image_urls.filter(
      (_, i) => i !== index
    );

    setPreviewImages(updatedImages);
    setFormData((prev) => ({
      ...prev,
      product_image_urls: updatedUrls,
      product_image_main:
        index === 0 ? updatedUrls[0] || "" : prev.product_image_main,
      product_image_sub: updatedUrls.slice(1),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.SKU ||
      !formData.product_name ||
      !formData.category_id ||
      !formData.category_name ||
      !formData.sub_category_id
    ) {
      toast.error(
        "Please fill in all required fields (SKU, Product Name, Category ID, Category Name, Sub Category ID)"
      );
      return;
    }

    if (formData.product_image_urls.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "product_specification") {
          const filteredSpecs = formData.product_specification
            .filter((spec) => spec.title.trim())
            .map((spec) => ({
              title: spec.title.trim(),
              data: spec.data.filter(
                (item) => item.key.trim() && item.value.trim()
              ),
            }))
            .filter((spec) => spec.data.length > 0);
          formDataToSend.append(key, JSON.stringify(filteredSpecs));
        } else if (key === "product_tags") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "product_image_urls") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
          // Set main and sub images
          if (formData[key].length > 0) {
            formDataToSend.append("product_image_main", formData[key][0]);
            formDataToSend.append(
              "product_image_sub",
              JSON.stringify(formData[key].slice(1))
            );
          }
        } else if (key === "quantity_discounts") {
          const validDiscounts = formData.quantity_discounts.filter(
            (discount) =>
              discount.title &&
              discount.min_quantity &&
              discount.max_quantity &&
              discount.discount_percentage
          );
          formDataToSend.append(key, JSON.stringify(validDiscounts));
        } else if (
          key !== "product_image_main" &&
          key !== "product_image_sub"
        ) {
          // Ensure boolean fields are properly handled
          if (typeof formData[key] === "boolean") {
            formDataToSend.append(key, formData[key].toString());
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      const response = await axios.post(
        `${backend}/product/add-product`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (response.data.status === "SUCCESS") {
        toast.success("Product added successfully!");

        // Reset form
        setFormData({
          category_id: "",
          category_name: "",
          sub_category_id: "",
          SKU: "",
          product_name: "",
          sub_category_name: "",
          sub_sub_category_name: "",
          brand_id: "",
          brand_name: "",
          product_image_main: "",
          product_image_sub: [],
          product_image_urls: [],
          product_type: "",
          model: "",
          product_instock: true,
          no_of_product_instock: 0,
          product_feature: "",
          product_overview: "",
          product_specification: [
            { title: "Specifications", data: [{ key: "", value: "" }] },
          ],
          product_description: "",
          product_caution: "",
          product_warranty: "",
          product_dimension_height: "",
          product_dimension_length_breadth: "",
          product_dimension_weight: "",
          product_time: "",
          non_discounted_price: "",
          discounted_single_product_price: "",
          discount: "",
          discounted_price_with_gst: "",
          gst_percent: "",
          quantity_discounts: [],
          is_available_for_bulk_order: false,
          no_of_reviews: 0,
          review_stars: 0,
          product_colour: "",
          product_video_link: "",
          product_manual_link: "",
          package_include: "",
          product_tags: [],
          coupon: "",
        });
        setPreviewImages([]);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.data?.message || "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-2xl font-bold text-white">Add New Product</h1>
            <p className="text-blue-100 mt-1">
              Complete product information form
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-blue-600 rounded mr-3"></div>
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="SKU"
                        value={formData.SKU}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter unique SKU"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter category ID"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="category_name"
                        value={formData.category_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter category name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="sub_category_id"
                        value={formData.sub_category_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter sub category ID"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category Name
                      </label>
                      <input
                        type="text"
                        name="sub_category_name"
                        value={formData.sub_category_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter sub category name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        name="brand_name"
                        value={formData.brand_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter brand name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type
                      </label>
                      <input
                        type="text"
                        name="product_type"
                        value={formData.product_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product type"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-green-600 rounded mr-3"></div>
                    Pricing & Stock
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price
                      </label>
                      <input
                        type="number"
                        name="non_discounted_price"
                        value={formData.non_discounted_price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price
                      </label>
                      <input
                        type="number"
                        name="discounted_single_product_price"
                        value={formData.discounted_single_product_price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST (%)
                      </label>
                      <input
                        type="number"
                        name="gst_percent"
                        value={formData.gst_percent}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Final Price (with GST)
                      </label>
                      <input
                        type="number"
                        name="discounted_price_with_gst"
                        value={formData.discounted_price_with_gst}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                        placeholder="Auto-calculated"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="no_of_product_instock"
                        value={formData.no_of_product_instock}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="product_instock"
                        checked={formData.product_instock}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        In Stock
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_available_for_bulk_order"
                        checked={formData.is_available_for_bulk_order}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Available for Bulk Order
                      </label>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-purple-600 rounded mr-3"></div>
                    Product Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Description
                      </label>
                      <textarea
                        name="product_description"
                        value={formData.product_description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter detailed product description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Features
                      </label>
                      <textarea
                        name="product_feature"
                        value={formData.product_feature}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter key product features"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Overview
                      </label>
                      <textarea
                        name="product_overview"
                        value={formData.product_overview}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product overview"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty
                        </label>
                        <input
                          type="text"
                          name="product_warranty"
                          value={formData.product_warranty}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 1 year warranty"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Includes
                        </label>
                        <input
                          type="text"
                          name="package_include"
                          value={formData.package_include}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="What's included in the package"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Images */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-orange-600 rounded mr-3"></div>
                    Product Images <span className="text-red-500">*</span>
                  </h2>

                  <ImageUpload
                    uploadType="product"
                    multiple={true}
                    maxFiles={10}
                    onUploadSuccess={(uploadedData) => {
                      if (uploadedData && Array.isArray(uploadedData)) {
                        const newImages = uploadedData.map((item) => ({
                          url: item?.url || item,
                          cloudinary_url: item?.url || item,
                        }));
                        setPreviewImages((prev) => [...prev, ...newImages]);
                        setFormData((prev) => ({
                          ...prev,
                          product_image_urls: [
                            ...(prev.product_image_urls || []),
                            ...uploadedData.map((item) => item?.url || item),
                          ],
                        }));
                      } else if (uploadedData) {
                        const imageUrl = uploadedData.url || uploadedData;
                        const newImage = {
                          url: imageUrl,
                          cloudinary_url: imageUrl,
                        };
                        setPreviewImages((prev) => [...prev, newImage]);
                        setFormData((prev) => ({
                          ...prev,
                          product_image_urls: [
                            ...(prev.product_image_urls || []),
                            imageUrl,
                          ],
                        }));
                      }
                    }}
                  />

                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <div className="w-2 h-6 bg-indigo-600 rounded mr-3"></div>
                      Specifications
                    </h2>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <FiPlus className="w-4 h-4 mr-1" />
                      Add Group
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.product_specification.map((spec, specIndex) => (
                      <div
                        key={specIndex}
                        className="border border-gray-200 p-4 rounded-lg bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            value={spec.title}
                            onChange={(e) =>
                              handleSpecChange(
                                specIndex,
                                0,
                                "title",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Specification group title"
                          />
                          {formData.product_specification.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSpecification(specIndex)}
                              className="ml-2 p-2 text-red-500 hover:text-red-700"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {spec.data.map((item, dataIndex) => (
                            <div
                              key={dataIndex}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="text"
                                value={item.key}
                                onChange={(e) =>
                                  handleSpecChange(
                                    specIndex,
                                    dataIndex,
                                    "key",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Specification name"
                              />
                              <input
                                type="text"
                                value={item.value}
                                onChange={(e) =>
                                  handleSpecChange(
                                    specIndex,
                                    dataIndex,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Specification value"
                              />
                              <button
                                type="button"
                                onClick={() => addSpecData(specIndex)}
                                className="p-2 text-green-600 hover:text-green-700"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                              {spec.data.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSpecData(specIndex, dataIndex)
                                  }
                                  className="p-2 text-red-500 hover:text-red-700"
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-6 bg-teal-600 rounded mr-3"></div>
                    Additional Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.product_tags.join(", ")}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            product_tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim()),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="electronics, arduino, sensor (separated by commas)"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Color
                        </label>
                        <input
                          type="text"
                          name="product_colour"
                          value={formData.product_colour}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Black, White, Red"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video Link
                        </label>
                        <input
                          type="url"
                          name="product_video_link"
                          value={formData.product_video_link}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manual/Datasheet Link
                        </label>
                        <input
                          type="url"
                          name="product_manual_link"
                          value={formData.product_manual_link}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/manual.pdf"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-8 border-t border-gray-200 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductComplete;
