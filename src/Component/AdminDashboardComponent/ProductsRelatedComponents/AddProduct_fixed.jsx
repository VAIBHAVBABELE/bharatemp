import axios from "axios";
import React, { useState, useMemo, useCallback } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { useAdminRouteProtection } from "../../../utils/AuthUtils";
import UnauthorizedPopup from "../../../utils/UnAuthorizedPopup";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import ImageUpload from "../ImageUpload/ImageUpload.jsx";

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
    product_image_urls: [],

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
  


  // Define form steps - memoized to prevent recreation
  const steps = useMemo(() => [
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
  ], []);

  const totalSteps = steps.length;

  // All event handlers memoized to prevent re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleTagsChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      product_tags: e.target.value
        .split(",")
        .map((tag) => tag.trim()),
    }));
  }, []);

  const removeImage = useCallback((index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      product_image_sub: prev.product_image_sub.filter((_, i) => i !== index),
      product_image_urls: prev.product_image_urls?.filter((_, i) => i !== index) || []
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
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
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev < totalSteps ? prev + 1 : prev);
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => prev > 1 ? prev - 1 : prev);
  }, []);

  const validateStep = useCallback((step) => {
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
        return true;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        const hasRequiredFields = (
          formData.category_id &&
          formData.category_name &&
          formData.sub_category_id &&
          formData.SKU &&
          formData.product_name
        );
        const hasImages = (
          (formData.product_image_urls && formData.product_image_urls.length > 0) ||
          previewImages.length > 0
        );
        return hasRequiredFields && hasImages;
      default:
        return true;
    }
  }, [formData.category_id, formData.category_name, formData.sub_category_id, formData.SKU, formData.product_name, formData.product_image_urls, previewImages.length]);

  const handleSpecChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSpecs = [...prev.specifications];
      updatedSpecs[index] = { ...updatedSpecs[index], [name]: value };
      return { ...prev, specifications: updatedSpecs };
    });
  }, []);

  const handleSpecDataChange = useCallback((specIndex, dataIndex, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSpecs = [...prev.specifications];
      const updatedData = [...updatedSpecs[specIndex].data];
      updatedData[dataIndex] = { ...updatedData[dataIndex], [name]: value };
      updatedSpecs[specIndex] = { ...updatedSpecs[specIndex], data: updatedData };
      return { ...prev, specifications: updatedSpecs };
    });
  }, []);

  const addField = useCallback((fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [
        ...prev[fieldName],
        fieldName === "specifications"
          ? { title: "", data: [{ key: "", value: "" }] }
          : "",
      ],
    }));
  }, []);

  const addSpecDataField = useCallback((specIndex) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, index) =>
        index === specIndex
          ? { ...spec, data: [...spec.data, { key: "", value: "" }] }
          : spec
      ),
    }));
  }, []);

  const removeField = useCallback((fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  }, []);

  const removeSpecDataField = useCallback((specIndex, dataIndex) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, index) =>
        index === specIndex
          ? { ...spec, data: spec.data.filter((_, i) => i !== dataIndex) }
          : spec
      ),
    }));
  }, []);

  const handleBulkUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsBulkMode(true);
    setLoading(true);

    try {
      let products = [];

      if (file.name.endsWith(".csv")) {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true });
        products = parsed.data.filter((row) => row.SKU && row.product_name);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
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
  }, [backend]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (isBulkMode) {
      toast.info(
        "Bulk upload mode active — use the file upload instead of the form."
      );
      return;
    }

    try {
      setLoading(true);

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

      if ((!formData.product_image_urls || formData.product_image_urls.length === 0) && formData.product_image_sub.length === 0) {
        toast.error("Please upload at least one image before submitting");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("category_name", formData.category_name);
      formDataToSend.append("sub_category_id", formData.sub_category_id);
      formDataToSend.append("sub_category_name", formData.sub_category_name);
      formDataToSend.append(
        "sub_sub_category_name",
        formData.sub_sub_category_name
      );

      if (formData.brand_id)
        formDataToSend.append("brand_id", formData.brand_id);
      formDataToSend.append("brand_name", formData.brand_name);

      formDataToSend.append("SKU", formData.SKU);
      formDataToSend.append("product_name", formData.product_name);

      if (formData.product_image_urls && formData.product_image_urls.length > 0) {
        formDataToSend.append("product_image_urls", JSON.stringify(formData.product_image_urls));
      }

      formDataToSend.append("product_type", formData.product_type);
      formDataToSend.append("model", formData.model);

      formDataToSend.append("product_instock", formData.product_instock);
      if (formData.no_of_product_instock) {
        formDataToSend.append(
          "no_of_product_instock",
          Number(formData.no_of_product_instock)
        );
      }

      formDataToSend.append("product_feature", formData.product_feature);
      formDataToSend.append("product_overview", formData.product_overview);

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

      if (formData.no_of_reviews) {
        formDataToSend.append("no_of_reviews", Number(formData.no_of_reviews));
      }
      if (formData.review_stars) {
        formDataToSend.append("review_stars", Number(formData.review_stars));
      }

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
        setLoading(false);
        
        localStorage.setItem('refreshProducts', 'true');
        window.dispatchEvent(new CustomEvent('productAdded'));
        
        toast.success("Product added successfully", {
          position: "top-right",
          autoClose: 3000,
        });

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
          product_image_urls: [],
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
        setCurrentStep(1);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      
      let errorMessage = "❌ Failed to add product to database";
      
      if (error.response?.data?.data?.message) {
        const message = error.response.data.data.message;
        if (message.includes("duplicate key error") && message.includes("SKU")) {
          errorMessage = `❌ SKU "${formData.SKU}" already exists! Please use a unique SKU.`;
        } else {
          errorMessage = message;
        }
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [formData, previewImages, isBulkMode, backend]);

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

  // Step Components - properly memoized
  const Step1 = useMemo(() => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Basic Information
      </h3>

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
  ), [formData, handleInputChange]);

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return Step1;
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Stock & Pricing
            </h3>
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
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Product Details
            </h3>
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
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Media & Additional Information
            </h3>
            <div>
              <label className="block text-sm font-medium mb-4 text-gray-700">
                Product Images *
              </label>
              <ImageUpload
                uploadType="product"
                multiple={true}
                maxFiles={10}
                onUploadSuccess={(uploadedData) => {
                  if (uploadedData && Array.isArray(uploadedData)) {
                    const newImages = uploadedData.map(item => ({
                      url: item?.url || item,
                      cloudinary_url: item?.url || item
                    }));
                    setPreviewImages(prev => [...prev, ...newImages]);
                    setFormData(prev => ({
                      ...prev,
                      product_image_urls: [...(prev.product_image_urls || []), ...uploadedData.map(item => item?.url || item)]
                    }));
                  } else if (uploadedData) {
                    const imageUrl = uploadedData.url || uploadedData;
                    const newImage = {
                      url: imageUrl,
                      cloudinary_url: imageUrl
                    };
                    setPreviewImages(prev => [...prev, newImage]);
                    setFormData(prev => ({
                      ...prev,
                      product_image_urls: [...(prev.product_image_urls || []), imageUrl]
                    }));
                  }
                }}
              />
              
              {previewImages.length > 0 && (
                <div className="flex gap-3 flex-wrap mt-4">
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
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Product Tags
              </label>
              <input
                type="text"
                name="product_tags"
                value={formData.product_tags.join(", ")}
                onChange={handleTagsChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="electronics, arduino, sensor (separated by commas)"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Review & Final
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-xl font-semibold text-blue-800 mb-4">
                Product Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="font-medium text-gray-800">
                    {formData.product_name || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium text-gray-800">
                    {formData.SKU || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Images:</span>
                  <span className={`font-medium ${
                    previewImages.length > 0 ? "text-green-600" : "text-gray-500"
                  }`}>
                    {previewImages.length > 0 ? `${previewImages.length} uploaded` : "No images"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return Step1;
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
                    type="button"
                    onClick={(e) => {
                      if (!validateStep(5)) {
                        toast.error(
                          "Please complete all required fields and upload at least one image before adding the product."
                        );
                        return;
                      }
                      handleSubmit(e);
                    }}
                    disabled={isBulkMode || loading}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                      isBulkMode || loading
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Product
                      </>
                    )}
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