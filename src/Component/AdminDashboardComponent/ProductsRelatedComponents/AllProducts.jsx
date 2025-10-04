import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSortAmountDown,
  FaSortAmountUp,
  FaPlus,
  FaThLarge,
  FaListUl,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import EditProduct from "./EditProductForm";
import { useAdminRouteProtection } from "../../../utils/AuthUtils";
import UnauthorizedPopup from "../../../utils/UnAuthorizedPopup";

const backend = import.meta.env.VITE_BACKEND;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(false);
  const [editPopUp, setEditPopUp] = useState(false);
  const productsPerPage = 8;
  const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection([
    "SuperAdmin",
  ]);

  // Open Modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // Open Modal for delete products
  const openModalDelete = (id) => {
    setSelectedProduct(id);
    setIsDeleteModalOpen(true);
  };

  // Close Modal  for delete products
  const closeModalDelete = () => {
    setSelectedProduct(null);
    setIsDeleteModalOpen(false);
  };

  // Open Modal for edit products
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditPopUp(true);
  };

  // Close Modal for edit products
  const closeEditModal = () => {
    setSelectedProduct(null);
    setEditPopUp(false);
  };

  // Optimized filtering logic with debounced search
  const filteredProducts = products.filter((product) => {
    // Search query matching with debounced search
    const searchLower = debouncedSearchQuery.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      product?.product_name?.toLowerCase().includes(searchLower) ||
      product?.category_name?.toLowerCase().includes(searchLower) ||
      product?.brand_name?.toLowerCase().includes(searchLower) ||
      product?.SKU?.toLowerCase().includes(searchLower);

    // Category filtering - show only products of selected category
    const matchesCategory =
      selectedCategory === "all" ||
      product?.category_name?.toLowerCase() === selectedCategory?.toLowerCase();

    // Stock filtering - respect the showOutOfStock toggle
    const stockCheck = showOutOfStock
      ? true
      : product?.no_of_product_instock > 0;

    return matchesSearch && matchesCategory && stockCheck;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;

    switch (sortBy) {
      case "price": {
        const aPrice =
          a.discounted_single_product_price || a.non_discounted_price || 0;
        const bPrice =
          b.discounted_single_product_price || b.non_discounted_price || 0;
        return (aPrice - bPrice) * modifier;
      }
      case "stock": {
        const aStock = a.no_of_product_instock || 0;
        const bStock = b.no_of_product_instock || 0;
        return (aStock - bStock) * modifier;
      }
      case "name":
        return (
          (a.product_name || "").localeCompare(b.product_name || "") * modifier
        );
      case "category":
        return (
          (a.category_name || "").localeCompare(b.category_name || "") *
          modifier
        );
      default:
        return 0;
    }
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  // Pagination
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginatedProducts = sortedProducts; // Use all filtered products since we have server pagination

  // Bulk actions
  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkDelete = () => {
    setProducts((prev) =>
      prev.filter((p) => !selectedProducts.includes(p._id))
    );
    setSelectedProducts([]);
    setCurrentPage(1);
  };

  // Single product delete
  const handleDelete = (productId) => {
    openModalDelete(productId);
  };

  // Handle stock update
  const handleStockUpdate = async (productId, newStock) => {
    try {
      const response = await axios.post(
        `${backend}/product/${productId}/update`,
        {
          product: {
            no_of_product_instock: newStock,
            product_instock: newStock > 0
          }
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );
      
      if (response.data.status === "Success") {
        // Update local state
        setProducts(prev => prev.map(p => 
          p._id === productId 
            ? { ...p, no_of_product_instock: newStock, product_instock: newStock > 0 }
            : p
        ));
        
        toast.success("Stock updated successfully");
        
        // Trigger refresh in products page
        localStorage.setItem('refreshProducts', 'true');
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  async function deleteProduct(id) {
    toast.dismiss();
    try {
      setLoading(true);
      const response = await axios.post(
        `${backend}/product/${id}/remove`,
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
        setLoading(false);
        setSelectedProduct(null);
        toast.success("Product deleted successfully.");
        
        // Trigger refresh in products page
        localStorage.setItem('refreshProducts', 'true');
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('productDeleted'));
        
        fetchAllProducts();
        closeModalDelete();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  }

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const url = `${backend}/product/allProduct?page=${currentPage}&limit=${productsPerPage}`;
      console.log('🔄 Fetching products from:', url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      console.log('📦 API Response:', response.data);
      if (response.data.status === "Success" || response.data.status === "SUCCESS") {
        const products = response.data.data.products || [];
        setTotalProducts(response.data.data.totalCount || 0);
        setProducts(products);
        console.log('✅ Products loaded:', products.length, 'of', response.data.data.totalCount);
      } else {
        console.log('❌ Unexpected response status:', response.data.status);
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      console.error("❌ Error response:", error.response?.data);
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, productsPerPage]);

  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchAllProducts();
    window.scrollTo(0, 0);
  }, [fetchAllProducts]);

  // Listen for product refresh events
  useEffect(() => {
    const handleProductRefresh = () => {
      fetchAllProducts();
    };

    // Check for refresh flag in localStorage
    const checkRefreshFlag = () => {
      if (localStorage.getItem('refreshProducts') === 'true') {
        localStorage.removeItem('refreshProducts');
        fetchAllProducts();
      }
    };

    // Check immediately and set up interval
    checkRefreshFlag();
    const interval = setInterval(checkRefreshFlag, 1000);

    // Listen for custom events
    window.addEventListener('productAdded', handleProductRefresh);
    window.addEventListener('productUpdated', handleProductRefresh);
    window.addEventListener('productDeleted', handleProductRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('productAdded', handleProductRefresh);
      window.removeEventListener('productUpdated', handleProductRefresh);
      window.removeEventListener('productDeleted', handleProductRefresh);
    };
  }, [fetchAllProducts]);

  // View mode toggle buttons
  const ViewModeToggle = () => (
    <div className="flex gap-2 border rounded-md p-1 bg-gray-100">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-2 rounded ${
          viewMode === "grid"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600"
        }`}
      >
        <FaThLarge />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`p-2 rounded ${
          viewMode === "list"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600"
        }`}
      >
        <FaListUl />
      </button>
    </div>
  );

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative group">
        <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          <img
            src={product.product_image_main}
            alt={product.product_name}
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={() => toggleProductSelection(product._id)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded bg-white shadow-sm"
            />
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => openModal(product)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-blue-50 transition-colors"
            >
              <FaEye className="text-blue-600 text-sm" />
            </button>
            <button
              onClick={() => openEditModal(product)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-green-50 transition-colors"
            >
              <FaEdit className="text-green-600 text-sm" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                getStockStatus(product.no_of_product_instock) === "Out of Stock"
                  ? "bg-red-500 text-white"
                  : getStockStatus(product.no_of_product_instock) === "Low Stock"
                  ? "bg-yellow-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {getStockStatus(product.no_of_product_instock)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 leading-tight">
            {product.product_name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
              {product.category_name}
            </span>
            <span className="text-xs text-gray-500">
              SKU: {product.SKU}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-green-600">
              ₹{(product.discounted_single_product_price ?? product.non_discounted_price)?.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.non_discounted_price?.toLocaleString()}
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Stock: {product.no_of_product_instock || 0} units</span>
            {product.product_warranty && (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {product.product_warranty}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => openModal(product)}
              className="flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <FaEye size={12} /> View
            </button>
            <button
              onClick={() => openEditModal(product)}
              className="flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <FaEdit size={12} /> Edit
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <FaTrash size={12} /> Delete
            </button>
          </div>
          
          {/* Quick Stock Update */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Quick Stock:</span>
            <input
              type="number"
              min="0"
              value={product.no_of_product_instock || 0}
              onChange={(e) => handleStockUpdate(product._id, Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!isDeleteModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            onClick={closeModalDelete}
          >
            <FaTimes size={20} />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              Are you sure you want to delete this product?
            </h2>
            <p className="text-gray-500 mt-2">This action cannot be undone.</p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={closeModalDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProduct(selectedProduct)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal Component
  const ProductModal = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const allImages = [
      selectedProduct.product_image_main,
      ...selectedProduct.product_image_sub,
    ];

    const nextImage = () => {
      if (currentImageIndex < allImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    };

    const prevImage = () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative overflow-hidden">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            onClick={closeModal}
          >
            <FaTimes size={22} />
          </button>

          <div
            className="max-h-[80vh] overflow-y-auto p-2"
            style={{
              scrollbarWidth: "thin",
            }}
          >
            <div className="relative">
              <img
                src={allImages[currentImageIndex]}
                alt={selectedProduct.product_name}
                className="w-full h-64 object-cover rounded-md"
              />

              {currentImageIndex > 0 && (
                <button
                  className="absolute top-1/2 left-2 bg-black/50 text-white p-2 rounded-full transform -translate-y-1/2"
                  onClick={prevImage}
                >
                  <FaChevronLeft size={20} />
                </button>
              )}

              {currentImageIndex < allImages.length - 1 && (
                <button
                  className="absolute top-1/2 right-2 bg-black/50 text-white p-2 rounded-full transform -translate-y-1/2"
                  onClick={nextImage}
                >
                  <FaChevronRight size={20} />
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {selectedProduct.product_name}
            </h2>
            <p className="text-gray-500">{selectedProduct.category_name}</p>
            <p className="text-gray-500">{selectedProduct.brand_name}</p>

            <div className="flex items-center gap-4 mt-3">
              <span className="text-2xl font-bold text-blue-600">
                ₹
                {selectedProduct.discounted_single_product_price ??
                  selectedProduct.non_discounted_price}
              </span>
              {selectedProduct.discount > 0 && (
                <span className="text-gray-500 line-through">
                  ₹{selectedProduct.non_discounted_price}
                </span>
              )}
            </div>

            <p className="mt-2 text-gray-600">
              Warranty: {selectedProduct.product_warranty}
            </p>
            <p className="mt-2 text-gray-600">
              Stock: {selectedProduct.no_of_product_instock} units available
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Features</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedProduct.product_feature}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedProduct.product_overview}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Specifications</h3>
              {selectedProduct.product_specification.map((spec, index) => (
                <div key={index} className="mt-2">
                  <h4 className="font-medium">{spec.title}</h4>
                  <ul className="list-none ml-4">
                    {spec.data.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-gray-700 flex justify-between py-1 border-b"
                      >
                        <span className="font-medium">{item.key}:</span>
                        <span>{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedProduct.product_description}
              </p>
            </div>

            {selectedProduct.product_caution && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-red-600">Caution</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {selectedProduct.product_caution}
                </p>
              </div>
            )}

            {selectedProduct.package_include && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Package Includes</h3>
                <p className="text-gray-600">
                  {selectedProduct.package_include}
                </p>
              </div>
            )}

            {selectedProduct.product_tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProduct.product_tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // List View Item Component
  const ListItem = ({ product }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={selectedProducts.includes(product._id)}
          onChange={() => toggleProductSelection(product._id)}
          className="form-checkbox h-5 w-5 text-blue-600 rounded"
        />
        <img
          src={product.product_image_main}
          alt={product.product_name}
          className="w-24 h-24 object-cover rounded-md"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{product.product_name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                getStockStatus(product.no_of_product_instock) === "Out of Stock"
                  ? "bg-red-100 text-red-800"
                  : getStockStatus(product.no_of_product_instock) ===
                    "Low Stock"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {getStockStatus(product.no_of_product_instock)}
            </span>
          </div>
          <div className="text-sm text-gray-500">{product.category_name}</div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xl font-bold text-blue-600">
              ₹
              {product.discounted_single_product_price ??
                product.non_discounted_price}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.non_discounted_price}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(product)}
            className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAuthorized) {
    return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
  }

  // console.log("products", products);
  // console.log("totalProducts", totalProducts);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-blue-50 p-8 pt-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>
          <div className="flex items-center gap-4">
            <ViewModeToggle />
            <Link
              to="/admin-dashboard/addproduct"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Product
            </Link>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, category, brand, or SKU..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <select
              className="p-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Categories</option>
              {Array.from(new Set(products.map((p) => p.category_name)))
                .filter(Boolean)
                .sort()
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>

            <div className="flex items-center gap-2">
              <select
                className="p-2 border rounded-md flex-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price">Price</option>
                <option value="stock">Stock</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="p-2 border rounded-md hover:bg-gray-100"
              >
                {sortOrder === "asc" ? (
                  <FaSortAmountDown />
                ) : (
                  <FaSortAmountUp />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="outOfStock"
                checked={showOutOfStock}
                onChange={(e) => {
                  setShowOutOfStock(e.target.checked);
                  setCurrentPage(1);
                }}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="outOfStock" className="text-sm">
                Show Out of Stock
              </label>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="bg-yellow-100 p-4 rounded-md flex flex-col gap-4 md:flex-row items-center justify-between">
              <span>{selectedProducts.length} selected</span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <FaTrash /> Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Search Results Info */}
        {debouncedSearchQuery && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-medium">
                {filteredProducts.length} results found for "{debouncedSearchQuery}"
              </span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Products Display */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">
              {debouncedSearchQuery ? "No products found" : "No products available"}
            </h3>
            <p className="text-gray-400">
              {debouncedSearchQuery 
                ? `No products match "${debouncedSearchQuery}"` 
                : "No products match your current criteria"}
            </p>
            {debouncedSearchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear search and show all products
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedProducts.map((product) => (
              <ListItem key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft size={12} /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
                    </>
                  )}

                  {/* Pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white border border-blue-600"
                            : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Product Details Modal */}
      {isModalOpen && <ProductModal />}
      {/* Product delete modal */}
      {isDeleteModalOpen && <DeleteConfirmationModal />}
      {/* LoadingSpinner */}
      {loading && <LoadingSpinner />}
      {/* Edit Popup */}
      {editPopUp && (
        <EditProduct
          selectedProduct={selectedProduct}
          onOpen={openEditModal}
          onClose={closeEditModal}
          fetchAllProducts={fetchAllProducts}
        />
      )}
    </div>
  );
};

export default AllProducts;
