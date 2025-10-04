import React, { createContext, useContext, useReducer, useEffect } from "react";

// Create cart context
const CartContext = createContext();

// Initial state
const initialState = {
  cartItems: [],
  totalItems: 0,
  uniqueItems: 0,
  totalAmount: 0,
  shipping: 0,
  tax: 0,
  appliedCoupon: null,
  couponDiscount: 0,
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.cartItems.findIndex(
        (item) =>
          item._id === action.payload._id &&
          item.isBulkOrder === !!action.payload.isBulkOrder &&
          (item.bulkRange || "") === (action.payload.bulkRange || "")
      );

      if (existingItemIndex >= 0) {
        const updatedCartItems = [...state.cartItems];
        const existingItem = updatedCartItems[existingItemIndex];
        const addedQuantity = action.payload.quantity || 1;
        const updatedQuantity = existingItem.quantity + addedQuantity;
        // FIXED: Always keep the original price, never update it
        const originalPrice = existingItem.price;

        updatedCartItems[existingItemIndex] = {
          ...existingItem,
          quantity: updatedQuantity,
          price: originalPrice, // Keep original price
          total: updatedQuantity * originalPrice,
        };

        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        // FIXED: Set price once and never change it
        const finalPrice = action.payload.isBulkOrder 
          ? action.payload.price 
          : (action.payload.price || action.payload.discounted_single_product_price);
        
        const newItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1,
          price: finalPrice, // Set price once
          total: finalPrice * (action.payload.quantity || 1),
          isBulkOrder: !!action.payload.isBulkOrder,
          bulkRange: action.payload.bulkRange || "",
          // Store original price for reference
          originalPrice: action.payload.discounted_single_product_price,
        };

        return {
          ...state,
          cartItems: [...state.cartItems, newItem],
        };
      }
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item._id !== action.payload
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) => {
          if (item._id === action.payload) {
            // Check stock limit if available
            const maxStock = item.no_of_product_instock;
            if (maxStock && item.quantity >= maxStock) {
              return item; // Don't increase if at stock limit
            }
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        }),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "APPLY_COUPON":
      return {
        ...state,
        appliedCoupon: action.payload.coupon,
        couponDiscount: action.payload.discount,
      };

    case "REMOVE_COUPON":
      return {
        ...state,
        appliedCoupon: null,
        couponDiscount: 0,
      };

    case "LOAD_CART":
      return {
        ...state,
        cartItems: action.payload.cartItems,
        appliedCoupon: action.payload.appliedCoupon,
        couponDiscount: action.payload.couponDiscount,
      };

    case "CALCULATE_TOTALS": {
      const { totalItems, totalAmount } = state.cartItems.reduce(
        (acc, item) => {
          // FIXED: Always use the stored price, never recalculate
          const itemPrice = item.price;
          acc.totalItems += item.quantity;
          acc.totalAmount += itemPrice * item.quantity;
          return acc;
        },
        { totalItems: 0, totalAmount: 0 }
      );

      // Count uniqueItems (number of different products)
      const uniqueItems = state.cartItems.length;

      // Calculate shipping (free over 1000, otherwise 5% of total with min 50)
      const shipping =
        totalAmount > 1000 ? 0 : Math.max(totalAmount * 0.05, 50);

      // Calculate tax (8% of total)
      const tax = totalAmount * 0.08;

      return {
        ...state,
        totalItems,
        uniqueItems,
        totalAmount,
        shipping,
        tax,
      };
    }

    default:
      return state;
  }
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        Object.keys(initialState).forEach((key) => {
          if (parsedCart[key] === undefined) {
            parsedCart[key] = initialState[key];
          }
        });

        // FIXED: Load cart items directly without re-adding to preserve prices
        if (parsedCart.cartItems && Array.isArray(parsedCart.cartItems)) {
          // Directly set the cart items with their original prices
          dispatch({ 
            type: "LOAD_CART", 
            payload: {
              cartItems: parsedCart.cartItems,
              appliedCoupon: parsedCart.appliedCoupon || null,
              couponDiscount: parsedCart.couponDiscount || 0
            }
          });
        }

        // Recalculate totals
        dispatch({ type: "CALCULATE_TOTALS" });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(state));
    } else {
      localStorage.removeItem("cart");
    }
  }, [state]);

  // Calculate totals whenever cart items change
  useEffect(() => {
    dispatch({ type: "CALCULATE_TOTALS" });
  }, [state.cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  // Clear the entire cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // Increase item quantity with stock check
  const increaseQuantity = (productId) => {
    const item = state.cartItems.find(item => item._id === productId);
    if (item && item.no_of_product_instock && item.quantity >= item.no_of_product_instock) {
      // Don't show toast here, let the UI handle it
      return;
    }
    dispatch({ type: "INCREASE_QUANTITY", payload: productId });
  };

  // Decrease item quantity
  const decreaseQuantity = (productId) => {
    const item = state.cartItems.find(item => item._id === productId);
    if (item && item.quantity <= 1) {
      return; // Don't decrease if quantity is already 1 or less
    }
    dispatch({ type: "DECREASE_QUANTITY", payload: productId });
  };

  // Update item quantity directly
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: productId, quantity: parseInt(quantity) },
    });
  };

  // Check if item exists in cart
  const isInCart = (productId) => {
    return state.cartItems.some((item) => item._id === productId);
  };

  // Get quantity of specific item in cart
  const getItemQuantity = (productId) => {
    const item = state.cartItems.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  // Apply coupon
  const applyCoupon = (coupon, discount) => {
    dispatch({ type: "APPLY_COUPON", payload: { coupon, discount } });
  };

  // Remove coupon
  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" });
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    isInCart,
    getItemQuantity,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
