import axios from "axios";
import React, { useState } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { useAdminRouteProtection } from "../../../utils/AuthUtils";
import UnauthorizedPopup from "../../../utils/UnAuthorizedPopup";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const backend = import.meta.env.VITE_BACKEND;

const AddProduct = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

    product_image_main: null,
    product_image_sub: [],

    product_type: "",
    model: "",

    product_instock: true,
    no_of_product_instock: 0,

    product_feature: "",
    product_overview: "",
    specifications: [{ title: "", data: [{ key: "", value: "" }] }],
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
  const [previewImages, setPreviewImages] = useState([]);
  const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection([
    "SuperAdmin",
  ]);
  const [loading, setLoading] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Define form steps
  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description: "Category, Brand & Product Details",
    },
    {
      id: 2,
      title: "Stock & Pricing",
      description: "Inventory and Price Information",
    },
    {
      id: 3,
      title: "Product Details",
      description: "Features, Specifications & Description",
    },
    {
      id: 4,
      title: "Media & Additional",
      description: "Images, Videos & Additional Info",
    },
    { id: 5, title: "Review & Final", description: "Reviews, Tags & Submit" },
  ];

  const totalSteps = steps.length;

  // Remove Image
  const removeImage = (index) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    const updatedFileList = formData.product_image_sub.filter(
      (_, i) => i !== index
    );

    setPreviewImages(updatedImages);
    setFormData((prev) => ({ ...prev, product_image_sub: updatedFileList }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation functions for each step
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.category_id &&
          formData.category_name &&
          formData.sub_category_id &&
          formData.SKU &&
          formData.product_name
        );
      case 2:
        return true; // Stock and pricing are optional
      case 3:
        return true; // Product details are mostly optional
      case 4:
        return formData.product_image_sub.length > 0; // At least one image required
      case 5:
        return true; // Final step
      default:
        return true;
    }
  };

  // Stepper Component
  const Stepper = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep > step.id
                  ? "bg-green-500 border-green-500 text-white"
                  : currentStep === step.id
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-gray-200 border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step.id ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <div className="ml-4 hidden sm:block">
              <div
                className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

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
        fieldName === "specifications"
          ? { title: "", data: [{ key: "", value: "" }] }
          : "",
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
        ),
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
        ),
      };
    });
  };

  // Bulk Upload Handler
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🚨 Switch into bulk mode
    setIsBulkMode(true);
    setLoading(true);

    try {
      let products = [];

      if (file.name.endsWith(".csv")) {
        // Parse CSV
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true });
        products = parsed.data.filter((row) => row.SKU && row.product_name);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // Parse Excel
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        products = XLSX.utils.sheet_to_json(sheet);
      } else {
        toast.error("Please upload a CSV or Excel file.");
        setLoading(false);
        return;
      }

      if (!products.length) {
        toast.error("No valid products found in file.");
        setLoading(false);
        return;
      }

      // 🚨 Option A: Bulk endpoint (if backend supports it)
      /*
    await axios.post(
      `${backend}/product/bulk-upload`,
      { products },
      {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}` },
      }
    );
    */

      // 🚨 Option B: Loop each product (if only /add-product exists)
      for (const product of products) {
        try {
          await axios.post(`${backend}/product/add-product`, product, {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          });
        } catch (err) {
          console.error("Failed to add product:", product.SKU, err);
        }
      }

      toast.success(`Uploaded ${products.length} products successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Error processing file");
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 If bulk upload mode is active, skip normal submit
    if (isBulkMode) {
      toast.info(
        "Bulk upload mode active — use the file upload instead of the form."
      );
      return;
    }

    try {
      setLoading(true);
      // ... rest of your existing code

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

      // Validate images
      if (!formData.product_image_sub.length) {
        toast.error("Please upload at least one image");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Basic Information - Required Fields
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("category_name", formData.category_name);
      formDataToSend.append("sub_category_id", formData.sub_category_id);
      formDataToSend.append("sub_category_name", formData.sub_category_name);
      formDataToSend.append(
        "sub_sub_category_name",
        formData.sub_sub_category_name
      );

      // Brand Information
      if (formData.brand_id)
        formDataToSend.append("brand_id", formData.brand_id);
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
        formDataToSend.append(
          "no_of_product_instock",
          Number(formData.no_of_product_instock)
        );
      }

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

      // Pricing Information - Convert to numbers
      if (formData.non_discounted_price) {
        formDataToSend.append(
          "non_discounted_price",
          Number(formData.non_discounted_price)
        );
      }
      if (formData.discounted_single_product_price) {
        formDataToSend.append(
          "discounted_single_product_price",
          Number(formData.discounted_single_product_price)
        );
      }
      if (formData.discount) {
        formDataToSend.append("discount", Number(formData.discount));
      }
      if (formData.discounted_price_with_gst) {
        formDataToSend.append(
          "discounted_price_with_gst",
          Number(formData.discounted_price_with_gst)
        );
      }

      // Multiple Quantity Pricing - Convert to numbers
      if (formData.multiple_quantity_price_5_10) {
        formDataToSend.append(
          "multiple_quantity_price_5_10",
          Number(formData.multiple_quantity_price_5_10)
        );
      }
      if (formData.multiple_quantity_price_10_20) {
        formDataToSend.append(
          "multiple_quantity_price_10_20",
          Number(formData.multiple_quantity_price_10_20)
        );
      }
      if (formData.multiple_quantity_price_20_50) {
        formDataToSend.append(
          "multiple_quantity_price_20_50",
          Number(formData.multiple_quantity_price_20_50)
        );
      }
      if (formData.multiple_quantity_price_50_100) {
        formDataToSend.append(
          "multiple_quantity_price_50_100",
          Number(formData.multiple_quantity_price_50_100)
        );
      }
      if (formData.multiple_quantity_price_100_plus) {
        formDataToSend.append(
          "multiple_quantity_price_100_plus",
          Number(formData.multiple_quantity_price_100_plus)
        );
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
        setLoading(false);
        // Reset form to initial state
        setFormData({
          category_id: "",
          category_name: "",
          sub_category_id: "",
          sub_category_name: "",
          sub_sub_category_name: "",
          brand_id: "",
          brand_name: "",
          SKU: "",
          product_name: "",
          product_image_main: null,
          product_image_sub: [],
          product_type: "",
          model: "",
          product_instock: true,
          no_of_product_instock: 0,
          product_feature: "",
          product_overview: "",
          specifications: [{ title: "", data: [{ key: "", value: "" }] }],
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
        setPreviewImages([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.data?.message || "Failed to add product"
      );
      setLoading(false);
    }
  };

  // Step Components
  const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Basic Information
      </h3>

      {/* Category Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Category ID *
          </label>
          <input
            type="text"
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter category ID"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Category Name *
          </label>
          <input
            type="text"
            name="category_name"
            value={formData.category_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter category name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Sub Category ID *
          </label>
          <input
            type="text"
            name="sub_category_id"
            value={formData.sub_category_id}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter sub category ID"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Sub Category Name
          </label>
          <input
            type="text"
            name="sub_category_name"
            value={formData.sub_category_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter sub category name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Sub Sub Category Name
          </label>
          <input
            type="text"
            name="sub_sub_category_name"
            value={formData.sub_sub_category_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter sub sub category name"
          />
        </div>
      </div>

      {/* Brand Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Brand ID
          </label>
          <input
            type="text"
            name="brand_id"
            value={formData.brand_id}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter brand ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Brand Name
          </label>
          <input
            type="text"
            name="brand_name"
            value={formData.brand_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter brand name"
          />
        </div>
      </div>

      {/* Product Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            SKU *
          </label>
          <input
            type="text"
            name="SKU"
            value={formData.SKU}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter SKU"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Name *
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter product name"
            required
          />
        </div>
      </div>

      {/* Product Type and Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Type
          </label>
          <input
            type="text"
            name="product_type"
            value={formData.product_type}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter product type"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Model
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter model"
          />
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Stock & Pricing
      </h3>

      {/* Stock Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product In Stock
          </label>
          <select
            name="product_instock"
            value={formData.product_instock}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Number of Products in Stock
          </label>
          <input
            type="number"
            name="no_of_product_instock"
            value={formData.no_of_product_instock}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      {/* Pricing Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Non-Discounted Price
          </label>
          <input
            type="number"
            name="non_discounted_price"
            value={formData.non_discounted_price}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Discounted Single Product Price
          </label>
          <input
            type="number"
            name="discounted_single_product_price"
            value={formData.discounted_single_product_price}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Discounted Price with GST
          </label>
          <input
            type="number"
            name="discounted_price_with_gst"
            value={formData.discounted_price_with_gst}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Multiple Quantity Pricing */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-700">Bulk Pricing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price (5-10 units)
            </label>
            <input
              type="number"
              name="multiple_quantity_price_5_10"
              value={formData.multiple_quantity_price_5_10}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price (10-20 units)
            </label>
            <input
              type="number"
              name="multiple_quantity_price_10_20"
              value={formData.multiple_quantity_price_10_20}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price (20-50 units)
            </label>
            <input
              type="number"
              name="multiple_quantity_price_20_50"
              value={formData.multiple_quantity_price_20_50}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price (50-100 units)
            </label>
            <input
              type="number"
              name="multiple_quantity_price_50_100"
              value={formData.multiple_quantity_price_50_100}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price (100+ units)
            </label>
            <input
              type="number"
              name="multiple_quantity_price_100_plus"
              value={formData.multiple_quantity_price_100_plus}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Product Details
      </h3>

      {/* Product Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Feature
          </label>
          <textarea
            name="product_feature"
            value={formData.product_feature}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-32 resize-vertical"
            placeholder="Describe the key features of the product"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Overview
          </label>
          <textarea
            name="product_overview"
            value={formData.product_overview}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-32 resize-vertical"
            placeholder="Provide an overview of the product"
          />
        </div>
      </div>

      {/* Specifications */}
      <div>
        <label className="block text-sm font-medium mb-4 text-gray-700">
          Specifications
        </label>
        {formData.specifications.map((spec, specIndex) => (
          <div
            key={specIndex}
            className="border border-gray-200 p-4 mb-4 rounded-lg bg-gray-50"
          >
            <input
              type="text"
              name="title"
              placeholder="Specification Title (e.g., Technical Specs)"
              value={spec.title}
              onChange={(e) => handleSpecChange(specIndex, e)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors mb-3"
            />

            {spec.data.map((item, dataIndex) => (
              <div
                key={dataIndex}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3 items-end"
              >
                <input
                  type="text"
                  name="key"
                  placeholder="Key (e.g., Voltage)"
                  value={item.key}
                  onChange={(e) =>
                    handleSpecDataChange(specIndex, dataIndex, e)
                  }
                  className="sm:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <input
                  type="text"
                  name="value"
                  placeholder="Value (e.g., 12V)"
                  value={item.value}
                  onChange={(e) =>
                    handleSpecDataChange(specIndex, dataIndex, e)
                  }
                  className="sm:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                {dataIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSpecDataField(specIndex, dataIndex)}
                    className="bg-red-500 text-white px-3 py-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <IoClose size={16} />
                  </button>
                )}
              </div>
            ))}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => addSpecDataField(specIndex)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Specification Item
              </button>

              {specIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeField("specifications", specIndex)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove Specification Group
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addField("specifications")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Specification Group
        </button>
      </div>

      {/* Product Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Height
          </label>
          <input
            type="text"
            name="product_dimension_height"
            value={formData.product_dimension_height}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="e.g., 10cm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Length/Breadth
          </label>
          <input
            type="text"
            name="product_dimension_length_breadth"
            value={formData.product_dimension_length_breadth}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="e.g., 20x15cm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Weight
          </label>
          <input
            type="text"
            name="product_dimension_weight"
            value={formData.product_dimension_weight}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="e.g., 500g"
          />
        </div>
      </div>

      {/* Product Time */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Product Time
        </label>
        <input
          type="text"
          name="product_time"
          value={formData.product_time}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="e.g., Delivery time or production time"
        />
      </div>

      {/* Product Description and Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Description
          </label>
          <textarea
            name="product_description"
            value={formData.product_description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-32 resize-vertical"
            placeholder="Detailed product description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Caution
          </label>
          <textarea
            name="product_caution"
            value={formData.product_caution}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-32 resize-vertical"
            placeholder="Safety cautions or warnings"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Warranty
          </label>
          <textarea
            name="product_warranty"
            value={formData.product_warranty}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-32 resize-vertical"
            placeholder="Warranty information"
          />
        </div>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Media & Additional Information
      </h3>

      {/* Images Upload */}
      <div>
        <label className="block text-sm font-medium mb-4 text-gray-700">
          Product Images *
        </label>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center w-full px-6 py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <svg
              className="w-12 h-12 text-gray-500 mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span className="text-lg text-gray-600 mb-2">
              Click to upload images
            </span>
            <span className="text-sm text-gray-500">
              PNG, JPG, JPEG up to 10MB each
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {previewImages.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {previewImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white h-8 w-8 flex justify-center items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Color
          </label>
          <input
            type="text"
            name="product_colour"
            value={formData.product_colour}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="e.g., Black, White"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Video Link
          </label>
          <input
            type="url"
            name="product_video_link"
            value={formData.product_video_link}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Manual Link
          </label>
          <input
            type="url"
            name="product_manual_link"
            value={formData.product_manual_link}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="https://example.com/manual.pdf"
          />
        </div>
      </div>

      {/* Package Include and Tags */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Package Include
          </label>
          <textarea
            name="package_include"
            value={formData.package_include}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-24 resize-vertical"
            placeholder="What's included in the package"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="electronics, arduino, sensor (separated by commas)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Coupon
          </label>
          <input
            type="text"
            name="coupon"
            value={formData.coupon}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Coupon code if applicable"
          />
        </div>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Review & Final
      </h3>

      {/* Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Number of Reviews
          </label>
          <input
            type="number"
            name="no_of_reviews"
            value={formData.no_of_reviews}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Review Stars
          </label>
          <input
            type="number"
            name="review_stars"
            value={formData.review_stars}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      {/* Bulk Upload Option */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-800 mb-3">
          Bulk Upload Option
        </h4>
        <p className="text-blue-700 mb-4">
          Alternatively, you can upload multiple products at once using a CSV or
          Excel file.
        </p>
        <div>
          <label className="block text-sm font-medium mb-2 text-blue-700">
            Upload Products File
          </label>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleBulkUpload}
            className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
          <p className="text-xs text-blue-600 mt-2">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">
          Product Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Product Name:</span>
            <p className="text-gray-800">
              {formData.product_name || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">SKU:</span>
            <p className="text-gray-800">{formData.SKU || "Not specified"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Category:</span>
            <p className="text-gray-800">
              {formData.category_name || "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Images:</span>
            <p className="text-gray-800">{previewImages.length} uploaded</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Price:</span>
            <p className="text-gray-800">
              ₹
              {formData.discounted_single_product_price ||
                formData.non_discounted_price ||
                "Not specified"}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Stock:</span>
            <p className="text-gray-800">
              {formData.product_instock
                ? `${formData.no_of_product_instock || 0} in stock`
                : "Out of stock"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      default:
        return <Step1 />;
    }
  };

  if (!isAuthorized) {
    return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Add New Product
            </h1>
            <p className="text-blue-100 text-center">
              Complete the form in steps to add your product
            </p>
          </div>

          <div className="p-6">
            <Stepper />

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="min-h-[500px]">{renderCurrentStep()}</div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  <IoChevronBack size={20} />
                  Previous
                </button>

                <div className="text-sm text-gray-500">
                  Step {currentStep} of {totalSteps}
                </div>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep(currentStep)) {
                        nextStep();
                      } else {
                        toast.error(
                          "Please fill in all required fields before proceeding."
                        );
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <IoChevronForward size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isBulkMode}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                      isBulkMode
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isBulkMode ? "Bulk Upload Active" : "Add Product"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default AddProduct;
