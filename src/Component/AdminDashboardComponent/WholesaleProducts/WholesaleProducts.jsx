import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose, IoPencil, IoTrash, IoAdd } from "react-icons/io5";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { toast } from "react-toastify";
import { useAdminRouteProtection } from "../../../utils/AuthUtils";
import UnauthorizedPopup from "../../../utils/UnAuthorizedPopup";
import BulkOrderDetails from "./BulkOrderDetails";
import BulkOrderRequests from "./BulkOrderRequests";

const backend = import.meta.env.VITE_BACKEND;

const WholesaleProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [wholesaleProducts, setWholesaleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingWholesale, setEditingWholesale] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [wholesaleToDelete, setWholesaleToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection([
    "SuperAdmin",
  ]);

  useEffect(() => {
    fetchAllProducts();
    fetchWholesaleProducts();

    // Listen for real-time product updates
    const handleProductUpdate = (event) => {
      console.log("Product updated in WholesaleProducts:", event.detail);
      fetchAllProducts();
      fetchWholesaleProducts();
    };

    window.addEventListener("productUpdated", handleProductUpdate);
    window.addEventListener("productAdded", handleProductUpdate);
    window.addEventListener("productDeleted", handleProductUpdate);

    return () => {
      window.removeEventListener("productUpdated", handleProductUpdate);
      window.removeEventListener("productAdded", handleProductUpdate);
      window.removeEventListener("productDeleted", handleProductUpdate);
    };
  }, []);

  async function fetchAllProducts() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backend}/product/allProduct?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      console.log("🔄 Fetching all products for wholesale:", response.data);
      if (
        response.data.status === "Success" ||
        response.data.status === "SUCCESS"
      ) {
        // Filter products that are available for bulk order
        // Include products where is_available_for_bulk_order is true OR undefined (for backward compatibility)
        const bulkOrderProducts = (response.data.data.products || []).filter(
          (product) =>
            product.is_available_for_bulk_order === true ||
            product.is_available_for_bulk_order === undefined
        );
        setAllProducts(bulkOrderProducts);
        console.log("✅ Bulk order products loaded:", bulkOrderProducts.length);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWholesaleProducts() {
    try {
      const response = await axios.get(
        `${backend}/wholesale/allWholesaleProducts?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      console.log("🔄 Fetching wholesale products:", response.data);
      if (
        response.data.status === "Success" ||
        response.data.status === "SUCCESS"
      ) {
        setWholesaleProducts(response.data.data.products || []);
        console.log(
          "✅ Wholesale products loaded:",
          response.data.data.products?.length
        );
      }
    } catch (error) {
      console.error("❌ Error fetching wholesale products:", error);
      toast.error("Failed to fetch wholesale products");
    }
  }

  const handleEditClick = (wholesaleProduct) => {
    setEditingWholesale({
      ...wholesaleProduct,
      priceBreaks: wholesaleProduct.priceBreaks.map((b) => ({ ...b })),
    });
  };

  const handleDeleteClick = (wholesaleId) => {
    setWholesaleToDelete(wholesaleId);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      if (wholesaleToDelete) {
        const response = await axios.post(
          `${backend}/wholesale/${wholesaleToDelete}/remove`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );
        if (response.data.status === "Success") {
          toast.success("Wholesale product deleted successfully.");
          fetchWholesaleProducts();

          // Trigger refresh in user products page
          localStorage.setItem("refreshProducts", "true");
          window.dispatchEvent(
            new CustomEvent("productUpdated", {
              detail: {
                action: "wholesale_deleted",
                wholesaleId: wholesaleToDelete,
              },
            })
          );
        }
      } else if (productToDelete) {
        const response = await axios.post(
          `${backend}/product/${productToDelete}/remove`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );
        if (response.data.status === "Success") {
          toast.success("Product deleted successfully.");
          fetchAllProducts();
          fetchWholesaleProducts();
        }
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete.");
    } finally {
      setDeleteModalOpen(false);
      setWholesaleToDelete(null);
      setProductToDelete(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setWholesaleToDelete(null);
    setProductToDelete(null);
  };

  const handleUpdateWholesale = async () => {
    try {
      toast.dismiss();
      // Validation: Check if a product is selected
      if (!editingWholesale || !editingWholesale._id) {
        toast.error("Please select a product.");
        return;
      }

      // Validation: Ensure priceBreaks exist and are not empty
      if (
        !editingWholesale.priceBreaks ||
        editingWholesale.priceBreaks.length === 0
      ) {
        toast.error("Please add at least one price break.");
        return;
      }

      // Validation: Ensure each price break has valid values
      for (const breakItem of editingWholesale.priceBreaks) {
        if (!breakItem.minQuantity || breakItem.minQuantity < 1) {
          toast.error("Min Quantity is required and must be at least 1.");
          return;
        }
        if (breakItem.discount === undefined || breakItem.discount < 0) {
          toast.error("Discount is required and cannot be negative.");
          return;
        }
      }

      setLoading(true);

      const response = await axios.post(
        `${backend}/wholesale/${editingWholesale._id}/update`,
        {
          priceBreaks: editingWholesale.priceBreaks,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (response.data.status === "Success") {
        toast.success("Wholesale product updated successfully.");
        setLoading(false);
        fetchWholesaleProducts();
        setEditingWholesale(null);

        // Trigger refresh in user products page
        localStorage.setItem("refreshProducts", "true");
        window.dispatchEvent(
          new CustomEvent("productUpdated", {
            detail: {
              action: "wholesale_updated",
              wholesaleId: editingWholesale._id,
            },
          })
        );
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
      priceBreaks: [{ minQuantity: 10, discount: 50 }],
    });
  };

  const handlePriceBreakChange = (index, field, value) => {
    if (editingWholesale) {
      // Update price break for editing wholesale product
      setEditingWholesale((prev) => {
        const newPriceBreaks = prev.priceBreaks.map((breakItem, i) =>
          i === index ? { ...breakItem, [field]: value } : breakItem
        );

        return {
          ...prev,
          priceBreaks: newPriceBreaks,
        };
      });
    } else {
      // Update price break for new wholesale product
      setSelectedProduct((prev) => {
        const newPriceBreaks = prev.priceBreaks.map((breakItem, i) =>
          i === index ? { ...breakItem, [field]: value } : breakItem
        );

        return {
          ...prev,
          priceBreaks: newPriceBreaks,
        };
      });
    }
  };

  const addPriceBreak = () => {
    if (editingWholesale) {
      // Add price break for editing wholesale product
      setEditingWholesale((prev) => ({
        ...prev,
        priceBreaks: [...prev.priceBreaks, { minQuantity: 10, discount: 50 }],
      }));
    } else {
      // Add price break for new wholesale product
      setSelectedProduct((prev) => ({
        ...prev,
        priceBreaks: [...prev.priceBreaks, { minQuantity: 10, discount: 50 }],
      }));
    }
  };

  const removePriceBreak = (index) => {
    if (editingWholesale) {
      // Remove price break for editing wholesale product
      const filteredBreaks = editingWholesale.priceBreaks.filter(
        (_, i) => i !== index
      );
      setEditingWholesale((prev) => ({
        ...prev,
        priceBreaks: filteredBreaks,
      }));
    } else {
      // Remove price break for new wholesale product
      const filteredBreaks = selectedProduct.priceBreaks.filter(
        (_, i) => i !== index
      );
      setSelectedProduct((prev) => ({
        ...prev,
        priceBreaks: filteredBreaks,
      }));
    }
  };

  const handleSaveWholesale = async () => {
    try {
      toast.dismiss();
      // Validation: Check if a product is selected
      if (!selectedProduct || !selectedProduct._id) {
        toast.error("Please select a product.");
        return;
      }

      // Validation: Ensure priceBreaks exist and are not empty
      if (
        !selectedProduct.priceBreaks ||
        selectedProduct.priceBreaks.length === 0
      ) {
        toast.error("Please add at least one price break.");
        return;
      }

      // Validation: Ensure each price break has valid values
      for (const breakItem of selectedProduct.priceBreaks) {
        if (!breakItem.minQuantity || breakItem.minQuantity < 1) {
          toast.error("Min Quantity is required and must be at least 1.");
          return;
        }
        if (breakItem.discount === undefined || breakItem.discount < 0) {
          toast.error("Discount is required and cannot be negative.");
          return;
        }
      }

      setLoading(true);

      const wholesaleData = {
        product_id: selectedProduct._id,
        priceBreaks: selectedProduct.priceBreaks,
      };

      const response = await axios.post(
        `${backend}/wholesale/new`,
        wholesaleData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (response.data.status === "Success") {
        toast.success("Wholesale product added successfully.");
        setLoading(false);
        fetchWholesaleProducts();
        setSelectedProduct(null);

        // Trigger refresh in user products page
        localStorage.setItem("refreshProducts", "true");
        window.dispatchEvent(
          new CustomEvent("productUpdated", {
            detail: {
              action: "wholesale_added",
              productId: selectedProduct._id,
            },
          })
        );
      }
    } catch (error) {
      console.error("Error saving wholesale data:", error);
      setLoading(false);
      toast.error("Failed to save wholesale product. Please try again.");
    }
  };

  // Filter products based on search term
  const filteredProducts = allProducts.filter(
    (product) =>
      product?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.product_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const filteredWholesaleProducts = wholesaleProducts.filter(
    (product) =>
      product?.product_id?.product_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product?.product_id?.product_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const getPaginatedProducts = (products) => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const getTotalPages = (products) =>
    Math.ceil(products.length / productsPerPage);

  // Reset to page 1 when switching tabs or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  if (!isAuthorized) {
    return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
  }

  return (
    <div className="container mx-auto p-5 md:px-10 pt-14 bg-gradient-to-b from-gray-50 to-blue-50">
      <h1 className="text-2xl font-bold mb-6 lg:text-4xl">
        Wholesale & Bulk Management
      </h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "products"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Products ({allProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("wholesale")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "wholesale"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Wholesale Products ({wholesaleProducts.length})
        </button>
      </div>

      {/* Search Bar */}
      {(activeTab === "products" || activeTab === "wholesale") && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {loading && <LoadingSpinner />}

      {activeTab === "orders" ? (
        <BulkOrderDetails />
      ) : activeTab === "requests" ? (
        <BulkOrderRequests />
      ) : activeTab === "products" ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">All Products</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No products found
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * productsPerPage,
                  filteredProducts.length
                )}{" "}
                of {filteredProducts.length} products
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getPaginatedProducts(filteredProducts).map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                  >
                    <div className="flex flex-col h-full">
                      <img
                        src={
                          product.product_image_main ||
                          product.image?.[0] ||
                          "/placeholder.webp"
                        }
                        alt={product.product_name}
                        className="w-full h-48 object-contain rounded-md mb-4 bg-gray-50"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {product.product_name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {product.product_description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-green-600">
                            ₹
                            {product.discounted_single_product_price?.toLocaleString(
                              "en-IN"
                            ) || product.price}
                          </span>
                          {product.non_discounted_price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹
                              {product.non_discounted_price.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              product.product_instock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.product_instock
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                          {wholesaleProducts.some(
                            (wp) => wp?.product_id?._id === product._id
                          ) && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Wholesale Available
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {!wholesaleProducts.some(
                          (wp) => wp?.product_id?._id === product._id
                        ) ? (
                          <button
                            onClick={() => handleAddClick(product)}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                          >
                            <IoAdd size={16} />
                            Add Wholesale
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const wholesale = wholesaleProducts.find(
                                (wp) => wp?.product_id?._id === product._id
                              );
                              if (wholesale) handleEditClick(wholesale);
                            }}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                          >
                            <IoPencil size={16} />
                            Edit Wholesale
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          title="Delete Product"
                        >
                          <IoTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination for All Products */}
              {getTotalPages(filteredProducts) > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: getTotalPages(filteredProducts) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, getTotalPages(filteredProducts))
                        )
                      }
                      disabled={currentPage === getTotalPages(filteredProducts)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage === getTotalPages(filteredProducts)
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Wholesale Products</h2>
          {filteredWholesaleProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No wholesale products found
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * productsPerPage,
                  filteredWholesaleProducts.length
                )}{" "}
                of {filteredWholesaleProducts.length} wholesale products
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getPaginatedProducts(filteredWholesaleProducts).map(
                  (product) => (
                    <div
                      key={product._id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                    >
                      <div className="flex flex-col h-full">
                        <img
                          src={
                            product?.product_id?.product_image_main ||
                            product?.product_id?.image?.[0] ||
                            "/placeholder.webp"
                          }
                          alt={product?.product_id?.product_name || "Product"}
                          className="w-full h-48 object-contain rounded-md mb-4 bg-gray-50"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {product?.product_id?.product_name ||
                              "Unknown Product"}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {product?.product_id?.product_description ||
                              "No description available"}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-green-600">
                              ₹
                              {product?.product_id?.discounted_single_product_price?.toLocaleString(
                                "en-IN"
                              ) ||
                                product?.product_id?.price ||
                                0}
                            </span>
                            {product?.product_id?.non_discounted_price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹
                                {product.product_id.non_discounted_price.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            )}
                          </div>

                          {/* Wholesale Price Breaks */}
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Wholesale Rates:
                            </h4>
                            <div className="space-y-1">
                              {product.priceBreaks?.length > 0 ? (
                                product.priceBreaks.map((breakItem, index) => {
                                  const basePrice =
                                    product?.product_id
                                      ?.discounted_single_product_price ||
                                    product?.product_id?.price ||
                                    0;
                                  const discountedPrice = Math.max(
                                    0,
                                    basePrice - breakItem.discount
                                  );
                                  const minTotal =
                                    discountedPrice * breakItem.minQuantity;
                                  const maxTotal = breakItem.maxQuantity
                                    ? discountedPrice * breakItem.maxQuantity
                                    : null;

                                  return (
                                    <div
                                      key={breakItem._id || index}
                                      className="bg-gray-50 p-3 rounded-lg"
                                    >
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-sm">
                                          {breakItem.minQuantity}
                                          {breakItem.maxQuantity
                                            ? ` - ${breakItem.maxQuantity}`
                                            : `+`}{" "}
                                          pcs
                                        </span>
                                        <span className="text-blue-600 font-medium text-sm">
                                          ₹{breakItem.discount} off each
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        <div>
                                          Price per unit: ₹
                                          {discountedPrice.toLocaleString(
                                            "en-IN"
                                          )}
                                        </div>
                                        <div className="font-medium text-green-600">
                                          Total: ₹
                                          {minTotal.toLocaleString("en-IN")}
                                          {maxTotal &&
                                            ` - ₹${maxTotal.toLocaleString(
                                              "en-IN"
                                            )}`}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-xs text-gray-500">
                                  No price breaks available
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                          >
                            <IoPencil size={16} />
                            Edit Rates
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            title="Remove Wholesale"
                          >
                            <IoTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Pagination for Wholesale Products */}
              {getTotalPages(filteredWholesaleProducts) > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: getTotalPages(filteredWholesaleProducts) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            getTotalPages(filteredWholesaleProducts)
                          )
                        )
                      }
                      disabled={
                        currentPage === getTotalPages(filteredWholesaleProducts)
                      }
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage === getTotalPages(filteredWholesaleProducts)
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {(selectedProduct || editingWholesale) && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex z-50 items-center justify-center">
          <div
            className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-scroll"
            style={{
              scrollbarWidth: "none",
            }}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingWholesale ? "Edit" : "Configure"} Wholesale for{" "}
              {editingWholesale?.product_id?.product_name ||
                selectedProduct?.product_name}
            </h2>

            <div className="space-y-6">
              {(
                editingWholesale?.priceBreaks || selectedProduct?.priceBreaks
              )?.map((breakItem, index) => {
                const currentProduct =
                  editingWholesale?.product_id || selectedProduct;
                const basePrice =
                  currentProduct?.discounted_single_product_price ||
                  currentProduct?.price ||
                  0;
                const discountedPrice = Math.max(
                  0,
                  basePrice - (breakItem.discount || 0)
                );
                const minTotal = discountedPrice * (breakItem.minQuantity || 0);
                const maxTotal = breakItem.maxQuantity
                  ? discountedPrice * breakItem.maxQuantity
                  : null;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex gap-4 items-end mb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Min Quantity
                        </label>
                        <input
                          type="number"
                          value={breakItem.minQuantity}
                          onChange={(e) =>
                            handlePriceBreakChange(
                              index,
                              "minQuantity",
                              parseInt(e.target.value)
                            )
                          }
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
                          value={breakItem.maxQuantity || ""}
                          onChange={(e) =>
                            handlePriceBreakChange(
                              index,
                              "maxQuantity",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          className="w-full p-2 border rounded"
                          min={breakItem.minQuantity + 1}
                          step="1"
                          placeholder="Leave empty for unlimited"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Discount (₹)
                        </label>
                        <input
                          type="number"
                          value={breakItem.discount}
                          onChange={(e) =>
                            handlePriceBreakChange(
                              index,
                              "discount",
                              parseInt(e.target.value)
                            )
                          }
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

                    {/* Price Calculation Display */}
                    <div className="bg-white p-3 rounded border">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Price Calculation:
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Base Price: </span>
                          <span className="font-medium">
                            ₹{basePrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            After Discount:{" "}
                          </span>
                          <span className="font-medium text-green-600">
                            ₹{discountedPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Min Total: </span>
                          <span className="font-bold text-blue-600">
                            ₹{minTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                        {maxTotal && (
                          <div>
                            <span className="text-gray-600">Max Total: </span>
                            <span className="font-bold text-blue-600">
                              ₹{maxTotal.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={addPriceBreak}
                className="w-full py-2 px-4 border-2 border-dashed border-blue-300 text-blue-600 hover:text-blue-800 hover:border-blue-400 rounded-lg transition-colors"
              >
                + Add Another Price Break
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
                onClick={
                  editingWholesale ? handleUpdateWholesale : handleSaveWholesale
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingWholesale ? "Update" : "Save"} Wholesale
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex z-50 items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this{" "}
              {productToDelete ? "product" : "wholesale product"}? This action
              cannot be undone.
            </p>

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
