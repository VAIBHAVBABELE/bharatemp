import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaArrowLeft, FaTimes, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

// Move AddressForm outside the main component to prevent re-renders
const AddressForm = ({
  isEditing = false,
  onClose,
  onSubmit,
  address,
  onInputChange,
  errors,
}) => (
  <div className="border-2 border-gray-300 rounded-2xl p-6 mb-6 relative">
    <button
      onClick={onClose}
      className="absolute right-4 cursor-pointer top-4 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
    >
      <FaTimes size={12} />
    </button>

    <h3 className="font-semibold text-lg mb-4">
      {isEditing ? "Edit Address" : "Add New Address"}
    </h3>

    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          className={`w-full border ${
            errors?.address ? "border-red-500" : "border-gray-300"
          } rounded-lg p-2`}
          value={address.address}
          onChange={onInputChange}
        />
        {errors?.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter city"
            className={`w-full border ${
              errors?.city ? "border-red-500" : "border-gray-300"
            } rounded-lg p-2`}
            value={address.city}
            onChange={onInputChange}
          />
          {errors?.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            placeholder="Enter state"
            className={`w-full border ${
              errors?.state ? "border-red-500" : "border-gray-300"
            } rounded-lg p-2`}
            value={address.state}
            onChange={onInputChange}
          />
          {errors?.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
        <div className="w-1/3">
          <label className="block text-gray-700 mb-1">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            placeholder="6 digits"
            maxLength="6"
            className={`w-full border ${
              errors?.postalCode ? "border-red-500" : "border-gray-300"
            } rounded-lg p-2`}
            value={address.postalCode}
            onChange={onInputChange}
          />
          {errors?.postalCode && (
            <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className={`w-full border border-gray-300 rounded-lg p-2`}
            value={address.companyName}
            onChange={onInputChange}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 mb-1">Gst Number</label>
          <input
            type="text"
            name="gstNumber"
            placeholder="Gst Number"
            className={`w-full border border-gray-300 rounded-lg p-2`}
            value={address.gstNumber}
            onChange={onInputChange}
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="bg-[#f7941d] cursor-pointer text-white px-6 py-2 rounded-3xl text-sm font-medium"
      >
        {isEditing ? "Save Address" : "Add Address"}
      </button>
    </div>
  </div>
);

const Checkout = () => {
  const { cartItems, appliedCoupon, couponDiscount } = useCart();
  const backend = import.meta.env.VITE_BACKEND;
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliveryDates, setDeliveryDates] = useState("");
  const [_orderId, setOrderId] = useState(null);
  const access = import.meta.env.VITE_ACCESS_TOKEN;
  const secret = import.meta.env.VITE_SECRET_KEY;
  const [rate, setRate] = useState(0);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  // Delivery addresses state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [errors, setErrors] = useState({});

  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    companyName: "",
    gstNumber: "",
  });

  // Get selected address
  const selectedAddress =
    addresses.find((addr) => addr.id === selectedAddressId) || addresses[0];

  // Calculate total amount using discounted price or bulk price
  const calculateTotalAmount = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.isBulkOrder 
        ? Number(item.price || 0)
        : Number(item.discounted_single_product_price || 0);
      return sum + price * item.quantity;
    }, 0);
  };

  // Calculate the total MRP (original price)
  const calculateTotalMRP = () => {
    return cartItems.reduce((sum, item) => {
      const mrp = item.isBulkOrder 
        ? Number(item.originalPrice || item.discounted_single_product_price || 0)
        : Number(item.discounted_single_product_price || 0);
      return sum + mrp * item.quantity;
    }, 0);
  };

  const totalAmount = calculateTotalAmount();
  const totalMRP = calculateTotalMRP();

  // Calculate pricing
  const shippingFee = rate;
  // const discountOnMrp = Math.round((totalMRP - totalAmount) * 100) / 100;

  // Calculate final total using only discounted price
  const subtotalAfterCoupon = Math.max(0, totalAmount - couponDiscount);
  const finalTotal = Math.max(
    0,
    subtotalAfterCoupon + shippingFee + subtotalAfterCoupon * 0.18
  );

  // Validation functions
  const validateAddress = (address) => {
    return address.trim().length > 0 ? null : "Address cannot be empty";
  };

  const validateCity = (city) => {
    return city.trim().length > 0 ? null : "City cannot be empty";
  };

  const validatePostalCode = (postalCode) => {
    // Allow either 6 digits or empty (will be filled with default)
    return !postalCode || /^[0-9]{6}$/.test(postalCode)
      ? null
      : "Please enter a valid 6-digit postal code";
  };

  // Handle address form input change with validation
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate all fields
  const validateFields = () => {
    const newErrors = {};

    const addressError = validateAddress(newAddress.address);
    if (addressError) newErrors.address = addressError;

    const cityError = validateCity(newAddress.city);
    if (cityError) newErrors.city = cityError;

    const postalCodeError = validatePostalCode(newAddress.postalCode);
    if (postalCodeError) newErrors.postalCode = postalCodeError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update user address on API
  const updateUserAddress = async (address, index) => {
    if (!userId || !token) {
      return false;
    }

    toast.dismiss();

    try {
      const fullAddress = `${address.address}, ${address.city}${address.state ? `, ${address.state}` : ''}, ${address.postalCode}`;

      const response = await axios.post(
        `${backend}/user/${userId}/update-address`,
        {
          user: {
            address_index: index,
            address_value: fullAddress,
            companyName: address.companyName,
            gstNumber: address.gstNumber,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        toast.success("Address updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.response?.data?.message || "Failed to update address");
      return false;
    }
  };

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    if (!userId || !token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${backend}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        const user = response.data.data.user;
        setUserData(user);

        // Handle addresses array
        if (Array.isArray(user.address) && user.address.length > 0) {
          const formattedAddresses = user.address.map((addr, index) => {
            // First, try to extract postal code using regex (6 digits)
            const postalCodeMatch = addr.match(/\b\d{6}\b/);
            const postalCode = postalCodeMatch ? postalCodeMatch[0] : "";

            // Remove postal code from the string for further processing
            let remainingAddress = addr.replace(
              postalCodeMatch ? postalCodeMatch[0] : "",
              ""
            );

            // Split remaining address by commas
            const parts = remainingAddress
              .split(",")
              .map((part) => part.trim())
              .filter(Boolean);

            // Initialize address components
            let streetAddress = "";
            let city = "";
            let state = "";

            if (parts.length >= 3) {
              // Last part is state, second last is city
              state = parts[parts.length - 1];
              city = parts[parts.length - 2];
              streetAddress = parts.slice(0, -2).join(", ");
            } else if (parts.length >= 2) {
              // Last part is city, no state
              city = parts[parts.length - 1];
              streetAddress = parts.slice(0, -1).join(", ");
            } else {
              // Use the whole string as street address
              streetAddress = parts.join(", ");
            }

            // Clean up any trailing/leading commas and extra spaces
            streetAddress = streetAddress.replace(/,\s*$/, "").trim();
            city = city.replace(/,\s*$/, "").trim();
            state = state.replace(/,\s*$/, "").trim();

            return {
              id: index + 1,
              address: streetAddress || addr, // Fallback to full address if parsing fails
              city: city || "City", // Provide default value
              state: state || "", // State field
              postalCode: postalCode || "000000", // Provide default value
              fullAddress: addr, // Keep original full address
              companyName: user.companyName || "",
              gstNumber: user.gstNumber || "",
            };
          });

          setAddresses(formattedAddresses);
          setSelectedAddressId(1);
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [userId, token, backend]);

  // Handle adding a new address with validation
  const handleAddAddress = () => {
    if (!validateFields()) {
      return;
    }

    const newId =
      addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1;
    const userName = userData
      ? (userData.firstName + " " + userData.lastName).trim()
      : "User";

    const addressToAdd = {
      id: newId,
      name: userName,
      ...newAddress,
      // Combine address components for display
      fullAddress: `${newAddress.address}, ${newAddress.city}${newAddress.state ? `, ${newAddress.state}` : ''}, ${newAddress.postalCode}`,
      gstNumber: newAddress.gstNumber,
      companyName: newAddress.companyName,
      isSelected: false,
    };

    const newAddresses = [...addresses, addressToAdd];
    setAddresses(newAddresses);
    setSelectedAddressId(newId);
    setNewAddress({
      address: "",
      city: "",
      state: "",
      postalCode: "",
      companyName: "",
      gstNumber: "",
    });
    setShowAddForm(false);
    setErrors({});

    // Update user address in API
    updateUserAddress(addressToAdd, newId - 1);
  };

  // Start editing an address
  const startEditAddress = (id) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (addressToEdit) {
      // If the address was created before the split field update,
      // extract city and postal code from the city field
      let cityValue = addressToEdit.city || "";
      let postalCodeValue = addressToEdit.postalCode || "";

      // Handle legacy addresses that might have combined city and postal code
      if (!addressToEdit.postalCode && addressToEdit.city) {
        const postalCodeMatch = addressToEdit.city.match(/[0-9]{6}/);
        if (postalCodeMatch) {
          postalCodeValue = postalCodeMatch[0];
          cityValue = addressToEdit.city.replace(postalCodeValue, "").trim();
          cityValue = cityValue.replace(/,$/, "").trim(); // Remove trailing comma if any
        }
      }

      setNewAddress({
        address: addressToEdit.address,
        city: cityValue,
        state: addressToEdit.state || "",
        postalCode: postalCodeValue,
        companyName: addressToEdit.companyName,
        gstNumber: addressToEdit.gstNumber,
      });
      setEditingAddressId(id);
      setShowEditForm(true);
    }
  };

  // Handle saving edited address with validation
  const handleSaveEditedAddress = () => {
    if (!validateFields()) {
      return;
    }

    const userName = userData
      ? (userData.firstName + " " + userData.lastName).trim()
      : "User";

    const updatedAddresses = addresses.map((addr, index) => {
      if (addr.id === editingAddressId) {
        const updatedAddress = {
          ...addr,
          name: userName,
          address: newAddress.address,
          city: newAddress.city,
          state: newAddress.state,
          postalCode: newAddress.postalCode,
          // Update the combined address
          fullAddress: `${newAddress.address}, ${newAddress.city}${newAddress.state ? `, ${newAddress.state}` : ''}, ${newAddress.postalCode}`,
          gstNumber: newAddress.gstNumber,
          companyName: newAddress.companyName,
        };

        // Update user address in API
        updateUserAddress(updatedAddress, index);

        return updatedAddress;
      }
      return addr;
    });

    setAddresses(updatedAddresses);
    setShowEditForm(false);
    setEditingAddressId(null);
    setNewAddress({
      address: "",
      city: "",
      state: "",
      postalCode: "",
      companyName: "",
      gstNumber: "",
    });
    setErrors({});

    // Update userData state
    setUserData((prev) => ({
      ...prev,
      address: updatedAddresses.map((addr) => addr.fullAddress),
    }));
  };

  // Handle removing an address
  const handleRemoveAddress = async (id) => {
    try {
      const indexToRemove = addresses.findIndex((addr) => addr.id === id);
      if (indexToRemove === -1) return;

      // Update in backend first - send empty string to remove the address
      const success = await updateUserAddress(
        { address: "", city: "", state: "", postalCode: "" },
        indexToRemove
      );

      if (success) {
        const updatedAddresses = addresses.filter((addr) => addr.id !== id);
        setAddresses(updatedAddresses);
        if (id === selectedAddressId) {
          setSelectedAddressId(
            updatedAddresses.length > 0 ? updatedAddresses[0].id : null
          );
        }

        // Update userData state
        setUserData((prev) => ({
          ...prev,
          address: updatedAddresses.map((addr) => addr.fullAddress),
        }));
      }
    } catch (error) {
      console.error("Error removing address:", error);
      toast.error("Failed to remove address");
    }
  };

  // Handle selecting an address
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    const selectedAddr = addresses.find((addr) => addr.id === id);
    if (selectedAddr) {
      updateUserAddress(selectedAddr, selectedAddr.id - 1);
    }
  };

  // console.log("Selected Address:", selectedAddress?.postalCode);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        // console.log("All Cart Items:", cartItems);

        // Calculate total dimensions and weight for all items
        let totalWeight = 0;
        let totalLength = 0;
        let totalWidth = 0;
        let maxHeight = 0;

        // Process each item in the cart
        for (const item of cartItems) {
          // Handle missing dimensions with defaults
          const dimensionStr = item.product_dimension_length_breadth || "10*10";
          const [lengthStr, widthStr] = dimensionStr.split("*").map((s) => s.trim());

          const itemLength = parseFloat(lengthStr) || 10;
          const itemWidth = parseFloat(widthStr) || 10;
          const itemHeight = parseFloat(item.product_dimension_height) || 5;
          const itemWeight = parseFloat(item.product_dimension_weight) || 0.1;

          // Calculate based on quantity
          const quantity = item.quantity || 1;

          // Add weight (cumulative)
          totalWeight += itemWeight * quantity;

          // For dimensions, you can choose different strategies:
          // Option 1: Sum all dimensions (assuming items are packed together)
          totalLength += itemLength * quantity;
          totalWidth = Math.max(totalWidth, itemWidth); // Take maximum width
          maxHeight = Math.max(maxHeight, itemHeight); // Take maximum height

          // console.log(`Item: ${item.product_name}`);
          // console.log(`Quantity: ${quantity}`);
          // console.log(`Dimensions: ${itemLength} x ${itemWidth} x ${itemHeight} cm`);
          // console.log(`Weight: ${itemWeight * quantity} kg`);
          // console.log('---');
        }

        // console.log("Total Calculated Dimensions:");
        // console.log(`Total Weight: ${totalWeight} kg`);
        // console.log(`Total Length: ${totalLength} cm`);
        // console.log(`Total Width: ${totalWidth} cm`);
        // console.log(`Max Height: ${maxHeight} cm`);

        // Make API call with calculated totals
        const response = await axios.post(
          "https://my.ithinklogistics.com/api_v3/rate/check.json",
          {
            data: {
              from_pincode: "201301",
              to_pincode: selectedAddress?.postalCode || "000000",
              shipping_length_cms: totalLength,
              shipping_width_cms: totalWidth,
              shipping_height_cms: maxHeight,
              shipping_weight_kg: totalWeight,
              order_type: "forward",
              payment_method: "Prepaid",
              product_mrp: totalMRP,
              access_token: access,
              secret_key: secret,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const rateOptions = response.data?.data;
        // console.log("Rate Check API Response:", response.data);
        setDeliveryDates(response?.data?.expected_delivery_date);

        if (!rateOptions || !Array.isArray(rateOptions)) {
          console.log("No rate options available");
          return;
        }

        // Find the rate option for DTDC with service_type "Air"
        const dtdcAirOption = rateOptions.find(
          (option) =>
            option.logistic_name === "DTDC" && option.service_type === "Air"
        );

        if (dtdcAirOption) {
          // console.log("Selected Rate (DTDC Air):", dtdcAirOption.rate);
          setRate(dtdcAirOption.rate);
        } else {
          // console.log("DTDC Air not available, using default rate option:", rateOptions[0]?.rate);
          setRate(rateOptions[0]?.rate || 0);
        }
      } catch (error) {
        console.error("Error while calling Rate Check API:", error);
        if (error.response) {
          console.error("API Error Response:", error.response.data);
        }
      }
    };

    if (selectedAddress) {
      fetchRate();
    }
  }, [selectedAddress, cartItems, totalMRP, access, secret]);



  // Update the handlePayment function to create order and initiate payment
  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add products to continue.");
      navigate('/allproducts');
      return;
    }

    if (addresses.length === 0 || !selectedAddressId) {
      toast.error("Please add a delivery address");
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Validate stock for all products before creating order
      console.log('Validating stock for cart items before order creation...');
      
      for (const item of cartItems) {
        try {
          const response = await axios.get(`${backend}/product/${item._id}`);
          const product = response.data?.data?.product;
          
          if (!product || !product.product_instock || product.no_of_product_instock < item.quantity) {
            toast.error(`${product?.product_name || 'Product'} is out of stock or insufficient quantity available`, {
              position: "top-right",
              autoClose: 5000,
            });
            throw new Error('Stock validation failed');
          }
          
          console.log(`Stock validated for ${product.product_name}: ${product.no_of_product_instock} available, ${item.quantity} requested`);
        } catch (stockError) {
          if (stockError.message !== 'Stock validation failed') {
            toast.error('Unable to validate product stock. Please try again.', {
              position: "top-right",
              autoClose: 5000,
            });
          }
          throw new Error('Stock validation failed');
        }
      }
      
      console.log('All products stock validated successfully. Proceeding with order creation...');

      // Get the selected address details
      const selectedAddr = addresses.find(
        (addr) => addr.id === selectedAddressId
      );

      // Use default postal code if not available
      const postalCode = selectedAddr.postalCode || "000000";

      // Calculate expected delivery date (3-4 days from now)
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 4);

      // Prepare order items with bulk order information
      const orderItems = cartItems.map((item) => {
        console.log("Processing cart item:", item);
        
        if (!item._id || !item.quantity || item.quantity <= 0) {
          throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
        }
        
        return {
          product_id: item._id,
          quantity: item.quantity,
          product_name: item.product_name,
          product_sku: item.SKU,
          product_price: item.isBulkOrder ? item.price : item.discounted_single_product_price,
          product_tax_rate: "0",
          product_hsn_code: "0",
          product_discount: item.isBulkOrder ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : "0",
          product_img_url: item.product_image_main,
          is_bulk_order: item.isBulkOrder || false,
          bulk_range: item.bulkRange || null,
          original_price: item.originalPrice || null,
        };
      });
      
      console.log("Order items prepared:", orderItems);

      // Ensure pincode is exactly 6 digits
      const validPincode = postalCode && postalCode.length === 6 ? postalCode : "000000";
      
      // Extract state from city field if it contains comma-separated values
      let cityName = selectedAddr.city || "City";
      let stateName = "";
      
      if (cityName.includes(',')) {
        const parts = cityName.split(',').map(part => part.trim());
        cityName = parts[0] || "City";
        stateName = parts[1] || "";
      }
      
      const orderData = {
        user_id: userId,
        products: orderItems,
        totalPrice: finalTotal,
        shippingAddress: selectedAddr.fullAddress,
        shippingCost: shippingFee,
        email: userData?.email,
        phone: userData?.phone,
        pincode: validPincode,
        name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || userData?.name || 'Guest User',
        firstName: userData?.firstName || 'Guest',
        lastName: userData?.lastName || 'User',
        city: cityName,
        state: stateName,
        expectedDelivery: expectedDelivery,
        hasBulkItems: cartItems.some(item => item.isBulkOrder),
        bulkOrderCount: cartItems.filter(item => item.isBulkOrder).length,
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountPercentage: appliedCoupon.discountPercentage,
          discountAmount: couponDiscount
        } : null,
        couponDiscount: couponDiscount || 0,
      };

      // Create the order
      const orderResponse = await axios.post(
        `${backend}/order/new`,
        {
          order: orderData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        !orderResponse.data ||
        !orderResponse.data.data ||
        !orderResponse.data.data.order._id
      ) {
        throw new Error("Failed to create order");
      }

      const createdOrderId = orderResponse.data.data.order._id;
      console.log('Order created successfully with ID:', createdOrderId);
      setOrderId(createdOrderId);

      // Use PhonePe payment gateway
      const FRONTEND_URL = window.location.origin;

      const paymentData = {
        orderId: createdOrderId,
        userId: userId,
        MUID: "T" + Date.now(),
        FRONTEND_URL: FRONTEND_URL,
      };

      console.log('Sending PhonePe payment request with data:', paymentData);
      
      const paymentResponse = await axios.post(
        `${backend}/payment/create-phonepe-payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );
      console.log('PhonePe payment response:', paymentResponse.data);
      
      if (paymentResponse.data?.status === "Success" && paymentResponse.data?.data?.response) {
        const { response } = paymentResponse.data.data;
        const phonepeResponse = response.phonepeResponse;
        
        let redirectUrl = null;
        
        if (phonepeResponse?.data?.instrumentResponse?.redirectInfo?.url) {
          redirectUrl = phonepeResponse.data.instrumentResponse.redirectInfo.url;
        } else if (phonepeResponse?.redirectUrl) {
          redirectUrl = phonepeResponse.redirectUrl;
        } else if (phonepeResponse?.data?.redirectUrl) {
          redirectUrl = phonepeResponse.data.redirectUrl;
        }
        
        if (redirectUrl) {
          sessionStorage.setItem('pendingPayment', JSON.stringify({
            orderId: createdOrderId,
            paymentId: response.payment._id,
            amount: finalTotal,
            timestamp: Date.now()
          }));
          
          console.log('Redirecting to PhonePe payment page:', redirectUrl);
          window.location.href = redirectUrl;
        } else {
          throw new Error("Payment gateway redirect URL not found.");
        }
      } else {
        throw new Error("Failed to initialize PhonePe payment.");
      }
    } catch (error) {
      
      let errorMessage = "Failed to process payment. Please try again.";
      
      // Handle stock validation errors silently
      if (error.message === 'Stock validation failed') {
        setProcessingPayment(false);
        return;
      }
      
      // Handle authentication errors (403 Unauthorized)
      if (error.response?.status === 403) {
        console.error('Authentication error:', error);
        errorMessage = "You need to sign up first. Please create your account to continue.";
        
        // Show popup and redirect to signup
        setTimeout(() => {
          if (window.confirm("You need to sign up first. Would you like to go to the signup page?")) {
            navigate('/signup');
          }
        }, 1000);
      }
      // Handle payment gateway errors
      else if (error.response?.status === 500) {
        console.error('Payment gateway error:', error);
        errorMessage = "Payment service temporarily unavailable. Please try again later.";
      }
      // Handle other errors
      else if (error.response?.status === 400) {
        errorMessage = "Invalid payment request. Please check your order details.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      
      // Only show toast for non-stock errors
      if (error.message !== 'Stock validation failed') {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 8000,
        });
      }
      
      console.error('Payment gateway error:', error);
      
      setProcessingPayment(false);
    }
  };

  // Get user token and ID
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        // Parse token if stored as JSON string, otherwise use directly
        const parsedToken = storedToken.startsWith('"')
          ? JSON.parse(storedToken)
          : storedToken;
        const decoded = jwtDecode(parsedToken);
        const id = decoded.id || decoded.userId || decoded._id || decoded.sub;

        if (id) {
          setUserId(id);
          setToken(parsedToken);
        } else {
          navigate("/login", { state: { from: "cart" } });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login", { state: { from: "cart" } });
      }
    } else {
      navigate("/login", { state: { from: "cart" } });
    }

    window.scrollTo(0, 0);
  }, [navigate]);

  // Debug cart items
  useEffect(() => {
    console.log('Cart items in checkout:', cartItems);
    console.log('Cart items length:', cartItems.length);
  }, [cartItems]);

  // Fetch user details when userId and token are available
  useEffect(() => {
    if (userId && token) {
      fetchUserDetails();
    }
  }, [userId, token, fetchUserDetails]);

  // Show add form by default if no addresses
  useEffect(() => {
    if (addresses.length === 0 && !showAddForm && !showEditForm && !loading) {
      setShowAddForm(true);
    }
  }, [addresses.length, showAddForm, showEditForm, loading]);

  // Check if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="bg-white py-6 min-h-screen font-[outfit]">
        <ToastContainer />
        <div className="px-4 md:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to your cart to proceed with checkout.</p>
              <button
                onClick={() => navigate('/allproducts')}
                className="bg-[#f7941d] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#e88a1a] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-6 min-h-screen font-[outfit]">
      <ToastContainer />
      <div className="px-4 md:px-10 lg:px-16">
        {/* Breadcrumb Navigation */}
        <nav className="w-full font-[outfit] pb-6 flex flex-wrap items-center gap-2 text-[#2F294D] text-sm md:text-base font-medium px-4 py-4 mt-4">
          <button
            onClick={handleBack}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full hover:bg-[#e88a1a] transition-colors"
          >
            <FaArrowLeft size={12} />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-[#f7941d] transition-colors">
              Home
            </Link>
            <FaChevronRight className="text-gray-400" size={12} />

            <Link
              to="/allproducts"
              className="hover:text-[#f7941d] transition-colors"
            >
              All Products
            </Link>
            <FaChevronRight className="text-gray-400" size={12} />

            <Link to="/cart" className="hover:text-[#f7941d] transition-colors">
              Shopping Cart
            </Link>
            <FaChevronRight className="text-gray-400" size={12} />

            <span className="text-[#f7941d]">Checkout</span>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Delivery Address Section */}
          <div className="p-0 lg:p-6 md:w-[65%]">
            <h1 className="text-xl font-bold text-gray-800 mb-4">
              Select Delivery Address
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Enter Your Delivery Address for smooth order Delivery.
            </p>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
              </div>
            ) : (
              <>
                {/* Display existing addresses */}
                {addresses.length > 0 && !showAddForm && !showEditForm && (
                  <div className="space-y-4 mb-6">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border-2 ${
                          addr.id === selectedAddressId
                            ? "border-[#f7941d]"
                            : "border-gray-300"
                        } rounded-2xl p-6 relative cursor-pointer`}
                        onClick={() => handleSelectAddress(addr.id)}
                      >
                        <div className="absolute right-4 top-4">
                          <div
                            className={`w-4 h-4 border-2 ${
                              addr.id === selectedAddressId
                                ? "border-[#f7941d]"
                                : "border-gray-300"
                            } rounded-full flex items-center justify-center`}
                          >
                            {addr.id === selectedAddressId && (
                              <div className="w-2 h-2 bg-[#f7941d] rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {userData && (
                          <h3 className="font-semibold text-lg mb-2">
                            {userData.firstName} {userData.lastName}
                          </h3>
                        )}
                        <p className="text-gray-600 mb-3">
                          {addr.fullAddress ||
                            `${addr.address}, ${addr.city}${
                              addr.postalCode ? `, ${addr.postalCode}` : ""
                            }`}
                        </p>

                        <div className="flex gap-3">
                          <button
                            className="bg-[#f7941d] cursor-pointer text-white px-4 py-2 rounded-3xl text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAddress(addr.id);
                            }}
                          >
                            Remove
                          </button>
                          <button
                            className="border border-gray-300 cursor-pointer px-4 py-2 rounded-3xl text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditAddress(addr.id);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show add address form */}
                {showAddForm && (
                  <AddressForm
                    onClose={() => {
                      if (addresses.length > 0) {
                        setShowAddForm(false);
                        setNewAddress({
                          address: "",
                          city: "",
                          state: "",
                          postalCode: "",
                          companyName: "",
                          gstNumber: "",
                        });
                        setErrors({});
                      }
                    }}
                    onSubmit={handleAddAddress}
                    address={newAddress}
                    onInputChange={handleAddressInputChange}
                    errors={errors}
                  />
                )}

                {/* Show edit address form */}
                {showEditForm && (
                  <AddressForm
                    isEditing={true}
                    onClose={() => {
                      setShowEditForm(false);
                      setEditingAddressId(null);
                      setNewAddress({
                        address: "",
                        city: "",
                        state: "",
                        postalCode: "",
                        companyName: "",
                        gstNumber: "",
                      });
                      setErrors({});
                    }}
                    onSubmit={handleSaveEditedAddress}
                    address={newAddress}
                    onInputChange={handleAddressInputChange}
                    errors={errors}
                  />
                )}

                {/* Add new address button */}
                {!showAddForm && !showEditForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full flex items-center cursor-pointer text-2xl font-semibold text-[#1E3473] py-2 px-4 rounded-xl border-2 border-gray-300"
                  >
                    <span className="mr-2 text-4xl ">+</span> Add new Address
                  </button>
                )}
              </>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="bg-gray-50 rounded-xl p-6 md:w-[35%] font-[outfit]">
            {selectedAddress && (
              <div className="bg-white p-4 rounded-xl mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Deliver Between :{" "}
                  <span className="text-[#f7941d]">{deliveryDates}</span>
                </h3>
                <p className="text-gray-500 text-sm">
                  {selectedAddress.fullAddress ||
                    `${selectedAddress.address}, ${selectedAddress.city}${
                      selectedAddress.postalCode
                        ? `, ${selectedAddress.postalCode}`
                        : ""
                    }`}
                </p>
              </div>
            )}

            <h2 className="text-xl font-bold text-[#2F294D] mb-6">Summary</h2>
            <div className="space-y-4 text-[#2F294D]">
              <div className="flex justify-between">
                <span className="text-gray-600">Total MRP</span>
                <span className="font-medium">₹{totalMRP.toFixed(2)}</span>
              </div>
              {totalMRP > totalAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bulk Discount</span>
                  <span className="font-medium text-green-600">
                    -₹{(totalMRP - totalAmount).toFixed(2)}
                  </span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-medium text-green-600">
                    -₹{couponDiscount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18% tax)</span>
                <span className="font-medium">
                  ₹{(subtotalAfterCoupon * 0.18).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">Shipping fees</span>
                </div>
                <span className="font-medium">₹{shippingFee.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <div className="flex justify-between font-bold text-xl text-[#2F294D]">
                <span>Total Amount</span>
                <span>₹ {finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className={`w-full ${
                !selectedAddress || processingPayment
                  ? "bg-gray-400"
                  : "bg-[#f7941d]"
              } cursor-pointer text-white py-3 rounded-2xl font-medium mt-4 flex items-center justify-center`}
              disabled={!selectedAddress || processingPayment}
            >
              {processingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : !selectedAddress ? (
                "Add delivery address to continue"
              ) : (
                "Proceed to Payment"
              )}
            </button>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
