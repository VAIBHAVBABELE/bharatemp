// API utility functions for fetching data from the backend
import axios from "axios";

// Base URL for API calls
const BASE_URL = import.meta.env.VITE_BACKEND || "http://localhost:8080";
const backend = import.meta.env.VITE_BACKEND || "http://localhost:8080";

// Dynamic function to fetch products with flexible parameters
export const fetchProductsDynamic = async (options = {}) => {
  const {
    pageNum = 1,
    pageSize = 50,
    filters = {},
    search = "",
    category = "",
    subcategory = "",
    brand = "",
    priceMin = null,
    priceMax = null,
    sortBy = "",
    sortOrder = "asc",
    useMockData = false,
  } = options;

  // Build dynamic filters object
  const dynamicFilters = { ...filters };

  // Add search filter if provided
  if (search && search.trim()) {
    dynamicFilters.search = search.trim();
  }

  // Add category filter if provided
  if (category && category.trim()) {
    dynamicFilters.category_name = category.trim();
  }

  // Add subcategory filter if provided
  if (subcategory && subcategory.trim()) {
    dynamicFilters.sub_category_name = subcategory.trim();
  }

  // Add brand filter if provided
  if (brand && brand.trim()) {
    dynamicFilters.brand_name = brand.trim();
  }

  // Add price range filters if provided
  if (priceMin !== null && priceMin >= 0) {
    dynamicFilters.min_price = priceMin;
  }
  if (priceMax !== null && priceMax > 0) {
    dynamicFilters.max_price = priceMax;
  }

  // Add sorting if provided
  if (sortBy && sortBy.trim()) {
    dynamicFilters.sort_by = sortBy.trim();
    dynamicFilters.sort_order =
      sortOrder.toLowerCase() === "desc" ? "desc" : "asc";
  }

  try {
    const requestBody = {
      pageNum: Math.max(1, parseInt(pageNum) || 1),
      pageSize: Math.max(1, parseInt(pageSize) || 50),
      filters: dynamicFilters,
    };

    console.log("Fetching products with params:", requestBody);

    const response = await axios.post(`${backend}/product/list`, requestBody, {
      timeout: 10000, // 10 second timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.status === "Success") {
      const products = response.data.data?.productList || [];
      const totalCount = response.data.data?.productCount || 0;

      return {
        success: true,
        products,
        totalCount,
        pageNum: requestBody.pageNum,
        pageSize: requestBody.pageSize,
        hasMore: products.length === requestBody.pageSize,
        filters: dynamicFilters,
      };
    } else {
      throw new Error(
        response.data?.message || "API returned unsuccessful status"
      );
    }
  } catch (error) {
    console.error("Failed to fetch products dynamically:", error);

    // No fallback to mock data - only use database data
    console.log("Database connection failed. No products available.");

    return {
      success: false,
      products: [],
      totalCount: 0,
      error: error.message || "Failed to fetch products",
      pageNum,
      pageSize,
      hasMore: false,
      filters: dynamicFilters,
    };
  }
};

// Function to fetch all products (legacy compatibility)
export const fetchProducts = async () => {
  const result = await fetchProductsDynamic({ pageSize: 1000, useMockData: false });
  return result.success ? result.products : [];
};

// Function to fetch products by category (legacy compatibility)
export const fetchProductsByCategory = async (category) => {
  const result = await fetchProductsDynamic({ category, pageSize: 1000 });
  return result.success ? result.products : [];
};

// Function to fetch products with search
export const fetchProductsWithSearch = async (searchTerm, options = {}) => {
  return await fetchProductsDynamic({
    search: searchTerm,
    ...options,
  });
};

// Function to fetch products by price range
export const fetchProductsByPriceRange = async (
  minPrice,
  maxPrice,
  options = {}
) => {
  return await fetchProductsDynamic({
    priceMin: minPrice,
    priceMax: maxPrice,
    ...options,
  });
};

// Function to fetch featured/top-rated products
export const fetchSpecialProducts = async (type, options = {}) => {
  const filters = { ...options.filters };

  switch (type) {
    case "featured":
      filters.featured = true;
      break;
    case "topRated":
      filters.min_rating = 4.0;
      break;
    case "onSale":
      filters.on_sale = true;
      break;
    default:
      break;
  }

  return await fetchProductsDynamic({
    ...options,
    filters,
  });
};
