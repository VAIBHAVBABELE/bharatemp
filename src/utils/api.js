// API utility functions for fetching data from the backend
import { mockProducts } from '../mockData/products';
import axios from 'axios';

// Base URL for API calls
const BASE_URL = import.meta.env.VITE_BACKEND || 'http://localhost:8080';
const backend = import.meta.env.VITE_BACKEND || 'http://localhost:8080';

// Helper to add delay for simulating network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.post(`${backend}/product/list`, {
      pageNum: 1,
      pageSize: 50,
      filters: {},
    });
    
    if (response.data.status === "Success") {
      return response.data.data.productList;
    } else {
      // If API fails or returns no products, use mock data
      return mockProducts;
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // If API call fails, use mock data
    return mockProducts;
  }
};

// Function to fetch products by category
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await axios.post(`${backend}/product/list`, {
      pageNum: 1,
      pageSize: 50,
      filters: {
        category: category
      },
    });
    
    if (response.data.status === "Success") {
      return response.data.data.productList;
    } else {
      // If API fails, filter mock data
      const filteredProducts = mockProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
      return filteredProducts;
    }
  } catch (error) {
    console.error(`Failed to fetch products for category ${category}:`, error);
    // If API call fails, filter mock data
    const filteredProducts = mockProducts.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
    return filteredProducts;
  }
}; 