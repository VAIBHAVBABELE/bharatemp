import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProductContext = createContext();
const backend = import.meta.env.VITE_BACKEND;

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(`${backend}/product/list`, {
          pageNum: 1,
          pageSize: 100,
          filters: {},
        });
        if (response.data.status === "Success") {
          setProducts(response.data.data.productList);
        }
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(`${backend}/product/all-categories`);
        setCategories(response.data.data.product.subcategories);
      } catch (error) {
        // Error handled silently
      }
    };
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};