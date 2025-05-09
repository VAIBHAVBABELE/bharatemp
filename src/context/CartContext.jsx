import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create cart context
const CartContext = createContext();

// Initial state
const initialState = {
  cartItems: [],
  totalItems: 0,
  uniqueItems: 0,
  totalAmount: 0,
  shipping: 0,
  tax: 0
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + 1
        };

        return {
          ...state,
          cartItems: updatedCartItems
        };
      } else {
        // Add new item to cart
        const newItem = { ...action.payload, quantity: 1 };
        return {
          ...state,
          cartItems: [...state.cartItems, newItem]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: []
      };

    case 'INCREASE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    case 'DECREASE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CALCULATE_TOTALS':
      const { totalItems, totalAmount } = state.cartItems.reduce(
        (acc, item) => {
          acc.totalItems += item.quantity;
          acc.totalAmount += item.price * item.quantity;
          return acc;
        },
        { totalItems: 0, totalAmount: 0 }
      );

      // Count uniqueItems (number of different products)
      const uniqueItems = state.cartItems.length;

      // Calculate shipping (free over 1000, otherwise 5% of total with min 50)
      const shipping = totalAmount > 1000 ? 0 : Math.max(totalAmount * 0.05, 50);
      
      // Calculate tax (8% of total)
      const tax = totalAmount * 0.08;

      return {
        ...state,
        totalItems,
        uniqueItems,
        totalAmount,
        shipping,
        tax
      };

    default:
      return state;
  }
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        Object.keys(initialState).forEach(key => {
          if (parsedCart[key] === undefined) {
            parsedCart[key] = initialState[key];
          }
        });
        
        // Set the cart state with the saved cart
        Object.entries(parsedCart).forEach(([key, value]) => {
          if (key === 'cartItems' && Array.isArray(value)) {
            dispatch({ type: 'CLEAR_CART' });
            value.forEach(item => {
              dispatch({ type: 'ADD_TO_CART', payload: item });
            });
          }
        });
        
        // Recalculate totals
        dispatch({ type: 'CALCULATE_TOTALS' });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(state));
    } else {
      localStorage.removeItem('cart');
    }
  }, [state]);

  // Calculate totals whenever cart items change
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  // Clear the entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Increase item quantity
  const increaseQuantity = (productId) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: productId });
  };

  // Decrease item quantity
  const decreaseQuantity = (productId) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: productId });
  };

  // Update item quantity directly
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity: parseInt(quantity) }
    });
  };

  // Check if item exists in cart
  const isInCart = (productId) => {
    return state.cartItems.some(item => item.id === productId);
  };

  // Get quantity of specific item in cart
  const getItemQuantity = (productId) => {
    const item = state.cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
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
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
