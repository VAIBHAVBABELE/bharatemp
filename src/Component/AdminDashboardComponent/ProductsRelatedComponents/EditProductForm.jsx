import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../utils/LoadingSpinner";

const backend = import.meta.env.VITE_BACKEND;

const EditProduct = ({
  selectedProduct,
  onOpen,
  onClose,
  fetchAllProducts,
}) => {
  const [formData, setFormData] = useState({
    category_id: "",
    category_name: "",
    sub_category_id: "",
    sub_category_name: "",
    sub_sub_category_name: "",
    brand_id: "",
    brand_name: "",
    SKU: "",
    product_name: "",
    product_image_main: "",
    product_image_sub: [],
    product_type: "",
    model: "",
    product_instock: true,
    no_of_product_instock: 0,
    product_feature: "",
    product_overview: "",
    specifications: [
      {
        title: "",
        data: [
          {
            key: "",
            value: "",
          },
        ],
      },
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
    multiple_quantity_price_5_10: "",
    multiple_quantity_price_10_20: "",
    multiple_quantity_price_20_50: "",
    multiple_quantity_price_50_100: "",
    multiple_quantity_price_100_plus: "",
    no_of_reviews: 0,
    review_stars: 0,
    product_colour: "",
    product_video_link: "",
    product_manual_link: "",
    package_include: "",
    product_tags: [],
    coupon: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingMainImage, setExistingMainImage] = useState("");
  const [newMainImage, setNewMainImage] = useState(null);
  const [previewMainImage, setPreviewMainImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (onOpen && selectedProduct) {
      // Map the selectedProduct data to the formData structure
      setFormData({
        category_id: selectedProduct.category_id || "",
        category_name: selectedProduct.category_name || "",
        sub_category_id: selectedProduct.sub_category_id || "",
        sub_category_name: selectedProduct.sub_category_name || "",
        sub_sub_category_name: selectedProduct.sub_sub_category_name || "",
        brand_id: selectedProduct.brand_id || "",
        brand_name: selectedProduct.brand_name || "",
        SKU: selectedProduct.SKU || "",
        product_name: selectedProduct.product_name || "",
        product_image_main: selectedProduct.product_image_main || "",
        product_image_sub: [],
        product_type: selectedProduct.product_type || "",
        model: selectedProduct.model || "",
        product_instock:
          selectedProduct.product_instock !== undefined
            ? selectedProduct.product_instock
            : true,
        no_of_product_instock: selectedProduct.no_of_product_instock || 0,
        product_feature: selectedProduct.product_feature || "",
        product_overview: selectedProduct.product_overview || "",
        specifications: selectedProduct.product_specification
          ? JSON.parse(JSON.stringify(selectedProduct.product_specification))
          : [
              {
                title: "",
                data: [
                  {
                    key: "",
                    value: "",
                  },
                ],
              },
            ],
        product_description: selectedProduct.product_description || "",
        product_caution: selectedProduct.product_caution || "",
        product_warranty: selectedProduct.product_warranty || "",
        product_dimension_height:
          selectedProduct.product_dimension_height || "",
        product_dimension_length_breadth:
          selectedProduct.product_dimension_length_breadth || "",
        product_dimension_weight:
          selectedProduct.product_dimension_weight || "",
        product_time: selectedProduct.product_time || "",
        non_discounted_price: selectedProduct.non_discounted_price || "",
        discounted_single_product_price:
          selectedProduct.discounted_single_product_price || "",
        discount: selectedProduct.discount || "",
        discounted_price_with_gst:
          selectedProduct.discounted_price_with_gst || "",
        multiple_quantity_price_5_10:
          selectedProduct.multiple_quantity_price_5_10 || "",
        multiple_quantity_price_10_20:
          selectedProduct.multiple_quantity_price_10_20 || "",
        multiple_quantity_price_20_50:
          selectedProduct.multiple_quantity_price_20_50 || "",
        multiple_quantity_price_50_100:
          selectedProduct.multiple_quantity_price_50_100 || "",
        multiple_quantity_price_100_plus:
          selectedProduct.multiple_quantity_price_100_plus || "",
        no_of_reviews: selectedProduct.no_of_reviews || 0,
        review_stars: selectedProduct.review_stars || 0,
        product_colour: selectedProduct.product_colour || "",
        product_video_link: selectedProduct.product_video_link || "",
        product_manual_link: selectedProduct.product_manual_link || "",
        package_include: selectedProduct.package_include || "",
        product_tags: selectedProduct.product_tags || [],
        coupon: selectedProduct.coupon || "",
      });

      setExistingImages(selectedProduct.product_image_sub || []);
      setExistingMainImage(selectedProduct.product_image_main || "");
      setPreviewMainImage(selectedProduct.product_image_main);

      // console.log("Selected Product:", selectedProduct);
      console.log("specifications:", selectedProduct.product_specification);

      setNewImages([]);
    }
  }, [onOpen, selectedProduct]);

  useEffect(() => {
    const newImagePreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviewImages([...existingImages, ...newImagePreviews]);

    // Clean up object URLs when component unmounts or images change
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [existingImages, newImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMainImage(file);
      setPreviewMainImage(URL.createObjectURL(file));
      setExistingMainImage("");
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      // Remove from existing images
      const updatedExistingImages = [...existingImages];
      updatedExistingImages.splice(index, 1);
      setExistingImages(updatedExistingImages);
    } else {
      // Remove from new images
      const newIndex = index - existingImages.length;
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(newIndex, 1);
      setNewImages(updatedNewImages);
    }
  };

  const handleSpecChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][name] = value;
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const handleSpecDataChange = (specIndex, dataIndex, e) => {
    const { name, value } = e.target;
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[specIndex].data[dataIndex][name] = value;
    setFormData((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { title: "", data: [{ key: "", value: "" }] },
      ],
    }));
  };

  const addSpecDataField = (specIndex) => {
    setFormData((prev) => {
      const updatedSpecs = [...prev.specifications];
      updatedSpecs[specIndex].data.push({ key: "", value: "" });
      return { ...prev, specifications: updatedSpecs };
    });
  };

  const removeSpecDataField = (specIndex, dataIndex) => {
    setFormData((prev) => {
      const updatedSpecs = [...prev.specifications];
      updatedSpecs[specIndex].data.splice(dataIndex, 1);
      return { ...prev, specifications: updatedSpecs };
    });
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };
  // console.log("Specifications:", selectedProduct.specifications);
  // console.log("Existing Images:", existingImages);
  // console.log("New Images:", newImages);
  // console.log("existingMainImage:", existingMainImage);
  // console.log("newMainImage:", newMainImage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate required fields
      if (
        !formData.category_id ||
        !formData.category_name ||
        !formData.sub_category_id ||
        !formData.SKU ||
        !formData.product_name
      ) {
        toast.error(
          "Please fill in all required fields: Category ID, Category Name, Sub Category ID, SKU, and Product Name"
        );
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Basic Information
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("category_name", formData.category_name);
      formDataToSend.append("sub_category_id", formData.sub_category_id);
      formDataToSend.append("sub_category_name", formData.sub_category_name);
      formDataToSend.append(
        "sub_sub_category_name",
        formData.sub_sub_category_name
      );

      // Brand Information
      formDataToSend.append("brand_id", formData.brand_id);
      formDataToSend.append("brand_name", formData.brand_name);

      // Product Basic Information
      formDataToSend.append("SKU", formData.SKU);
      formDataToSend.append("product_name", formData.product_name);

      // Images
      if (existingImages && existingImages.length > 0) {
        formDataToSend.append("existingImages", JSON.stringify(existingImages));
      }

      // Append new sub images (as files)
      if (newImages && newImages.length > 0) {
        newImages.forEach((file) => {
          formDataToSend.append("img", file); // 'img' is used for sub images
        });
      }

      // Append main image (new or existing)
      if (newMainImage) {
        formDataToSend.append("img2", newMainImage); // as File
      } else if (existingMainImage) {
        formDataToSend.append("product_image_main", existingMainImage); // as URL string
      }

      // Product Details
      formDataToSend.append("product_type", formData.product_type);
      formDataToSend.append("model", formData.model);

      // Stock Information
      formDataToSend.append("product_instock", formData.product_instock);
      formDataToSend.append(
        "no_of_product_instock",
        formData.no_of_product_instock
      );

      // Product Features and Details
      formDataToSend.append("product_feature", formData.product_feature);
      formDataToSend.append("product_overview", formData.product_overview);

      // Filter and format specifications
      const filteredSpecifications = formData.specifications
        .filter((spec) => spec.title.trim() !== "")
        .map((spec) => ({
          title: spec.title.trim(),
          data: spec.data
            .filter(
              (item) => item.key.trim() !== "" && item.value.trim() !== ""
            )
            .map((item) => ({
              key: item.key.trim(),
              value: item.value.trim(),
            })),
        }))
        .filter((spec) => spec.data.length > 0);

      formDataToSend.append(
        "product_specification",
        JSON.stringify(filteredSpecifications)
      );

      formDataToSend.append(
        "product_description",
        formData.product_description
      );
      formDataToSend.append("product_caution", formData.product_caution);
      formDataToSend.append("product_warranty", formData.product_warranty);

      // Dimensions
      formDataToSend.append(
        "product_dimension_height",
        formData.product_dimension_height
      );
      formDataToSend.append(
        "product_dimension_length_breadth",
        formData.product_dimension_length_breadth
      );
      formDataToSend.append(
        "product_dimension_weight",
        formData.product_dimension_weight
      );

      formDataToSend.append("product_time", formData.product_time);

      // Pricing Information
      formDataToSend.append(
        "non_discounted_price",
        formData.non_discounted_price
      );
      formDataToSend.append(
        "discounted_single_product_price",
        formData.discounted_single_product_price
      );
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append(
        "discounted_price_with_gst",
        formData.discounted_price_with_gst
      );

      // Multiple Quantity Pricing
      formDataToSend.append(
        "multiple_quantity_price_5_10",
        formData.multiple_quantity_price_5_10
      );
      formDataToSend.append(
        "multiple_quantity_price_10_20",
        formData.multiple_quantity_price_10_20
      );
      formDataToSend.append(
        "multiple_quantity_price_20_50",
        formData.multiple_quantity_price_20_50
      );
      formDataToSend.append(
        "multiple_quantity_price_50_100",
        formData.multiple_quantity_price_50_100
      );
      formDataToSend.append(
        "multiple_quantity_price_100_plus",
        formData.multiple_quantity_price_100_plus
      );

      // Reviews
      formDataToSend.append("no_of_reviews", formData.no_of_reviews);
      formDataToSend.append("review_stars", formData.review_stars);

      // Additional Information
      formDataToSend.append("product_colour", formData.product_colour);
      formDataToSend.append("product_video_link", formData.product_video_link);
      formDataToSend.append(
        "product_manual_link",
        formData.product_manual_link
      );

      formDataToSend.append("package_include", formData.package_include);
      formDataToSend.append(
        "product_tags",
        JSON.stringify(formData.product_tags)
      );
      formDataToSend.append("coupon", formData.coupon);

      const response = await axios.post(
        `${backend}/product/${selectedProduct._id}/update/v2`,
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

      if (response.data.status === "Success") {
        toast.success("Product updated successfully!");
        onClose();
        fetchAllProducts();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    onOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-6 relative max-h-screen overflow-y-auto">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            onClick={onClose}
          >
            <IoClose size={22} />
          </button>

          <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category ID
                </label>
                <input
                  type="text"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name
                </label>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sub Category ID
                </label>
                <input
                  type="text"
                  name="sub_category_id"
                  value={formData.sub_category_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sub Category Name
                </label>
                <input
                  type="text"
                  name="sub_category_name"
                  value={formData.sub_category_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sub Sub Category Name
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand ID
                </label>
                <input
                  type="text"
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Name
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Type
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product In Stock
                </label>
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
                <label className="block text-sm font-medium mb-2">
                  Number of Products in Stock
                </label>
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
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Product Feature
                </label>
                <textarea
                  name="product_feature"
                  value={formData.product_feature}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Product Overview
                </label>
                <textarea
                  name="product_overview"
                  value={formData.product_overview}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Specifications
              </label>

              {formData.specifications?.map((spec, specIndex) => (
                <div
                  key={specIndex}
                  className="border p-4 mb-4 rounded-md bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      name="title"
                      placeholder="Specification Title"
                      value={spec.title || ""}
                      onChange={(e) => handleSpecChange(specIndex, e)}
                      className="flex-1 p-2 border rounded-md"
                      required
                    />

                    {formData.specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(specIndex)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                        title="Remove Specification"
                      >
                        <IoClose size={16} />
                      </button>
                    )}
                  </div>

                  {spec.data?.map((item, dataIndex) => (
                    <div
                      key={dataIndex}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2 items-center"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          name="key"
                          placeholder="Feature name"
                          value={item.key || ""}
                          onChange={(e) =>
                            handleSpecDataChange(specIndex, dataIndex, e)
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          name="value"
                          placeholder="Feature value"
                          value={item.value || ""}
                          onChange={(e) =>
                            handleSpecDataChange(specIndex, dataIndex, e)
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            removeSpecDataField(specIndex, dataIndex)
                          }
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                          disabled={spec.data.length <= 1}
                          title="Remove Feature"
                        >
                          <IoClose size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addSpecDataField(specIndex)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-blue-600 transition"
                  >
                    Add Feature
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSpecification}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Add New Specification Section
              </button>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Product Description
                </label>
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Product Caution
                </label>
                <textarea
                  name="product_caution"
                  value={formData.product_caution}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Product Warranty
                </label>
                <textarea
                  name="product_warranty"
                  value={formData.product_warranty}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Product Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <label className="block text-sm font-medium mb-2">
                  Length/Breadth
                </label>
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
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Time
              </label>
              <input
                type="text"
                name="product_time"
                value={formData.product_time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Pricing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Non-Discounted Price
                </label>
                <input
                  type="number"
                  name="non_discounted_price"
                  value={formData.non_discounted_price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discounted Single Product Price
                </label>
                <input
                  type="number"
                  name="discounted_single_product_price"
                  value={formData.discounted_single_product_price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Discounted Price with GST
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (5-10 units)
                </label>
                <input
                  type="number"
                  name="multiple_quantity_price_5_10"
                  value={formData.multiple_quantity_price_5_10}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (10-20 units)
                </label>
                <input
                  type="number"
                  name="multiple_quantity_price_10_20"
                  value={formData.multiple_quantity_price_10_20}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (20-50 units)
                </label>
                <input
                  type="number"
                  name="multiple_quantity_price_20_50"
                  value={formData.multiple_quantity_price_20_50}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (50-100 units)
                </label>
                <input
                  type="number"
                  name="multiple_quantity_price_50_100"
                  value={formData.multiple_quantity_price_50_100}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (100+ units)
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Reviews
                </label>
                <input
                  type="number"
                  name="no_of_reviews"
                  value={formData.no_of_reviews}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Review Stars
                </label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Color
                </label>
                <input
                  type="text"
                  name="product_colour"
                  value={formData.product_colour}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Video Link
                </label>
                <input
                  type="url"
                  name="product_video_link"
                  value={formData.product_video_link}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Manual Link
                </label>
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
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Package Include
                </label>
                <textarea
                  name="package_include"
                  value={formData.package_include}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Product Tags
                </label>
                <input
                  type="text"
                  name="product_tags"
                  value={formData.product_tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      product_tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim()),
                    })
                  }
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
                <svg
                  className="w-10 h-10 text-gray-500 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                <span className="text-sm text-gray-600">
                  Click to upload images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex gap-2 flex-wrap">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white h-7 w-7 flex justify-center items-center rounded-full"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
