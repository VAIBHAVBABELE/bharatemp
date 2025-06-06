import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
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
            placeholder="City, State"
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
  const { cartItems, clearCart } = useCart();
  const backend = import.meta.env.VITE_BACKEND;
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);

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
    postalCode: "",
  });

  // Get selected address
  const selectedAddress =
    addresses.find((addr) => addr.id === selectedAddressId) || addresses[0];

  // Calculate total amount using only discounted price
  const calculateTotalAmount = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.discounted_single_product_price || 0);
      return sum + (price * item.quantity);
    }, 0);
  };

  // Calculate the total MRP (original price)
  const calculateTotalMRP = () => {
    return cartItems.reduce((sum, item) => {
      const mrp = Number(item.discounted_single_product_price || 0);
      return sum + (mrp * item.quantity);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();
  const totalMRP = calculateTotalMRP();

  // Calculate pricing
  const codeDiscount = 15;
  const platformFee = 5;
  const shippingFee = 5;
  const discountOnMrp = Math.round((totalMRP - totalAmount) * 100) / 100;
  
  // Calculate final total using only discounted price
  const finalTotal = Math.max(0, totalAmount + platformFee + shippingFee - codeDiscount);

  // Delivery date calculation
  const getDeliveryDates = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 3);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 4);

    return {
      start:
        startDate.getDate() +
        " " +
        startDate.toLocaleString("default", { month: "short" }).toLowerCase(),
      end:
        endDate.getDate() +
        " " +
        endDate.toLocaleString("default", { month: "short" }).toLowerCase(),
    };
  };

  const deliveryDates = getDeliveryDates();

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
  const updateUserAddress = async (address) => {
    if (!userId || !token) {
      return;
    }

    try {
      const fullAddress = `${address.address}, ${address.city}, ${address.postalCode}`;
      
      // Get existing addresses
      const currentAddresses = userData?.address || [];
      let updatedAddresses;

      if (editingAddressId !== null) {
        // If editing, replace the address at that index
        updatedAddresses = currentAddresses.map((addr, index) => 
          index === editingAddressId ? fullAddress : addr
        );
      } else {
        // If adding new, append to existing addresses
        updatedAddresses = [...currentAddresses, fullAddress];
      }

      const response = await axios.post(
        `${backend}/user/${userId}/update`,
        {
          user: {
            address: updatedAddresses,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Address updated successfully");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };

  // Fetch user details
  const fetchUserDetails = async () => {
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
            let remainingAddress = addr.replace(postalCodeMatch ? postalCodeMatch[0] : "", "");
            
            // Split remaining address by commas
            const parts = remainingAddress.split(",").map(part => part.trim()).filter(Boolean);

            // Initialize address components
            let streetAddress = "";
            let city = "";

            if (parts.length >= 2) {
              // Last non-empty part before postal code is typically the city
              city = parts[parts.length - 1];
              // Everything else is the street address
              streetAddress = parts.slice(0, -1).join(", ");
            } else {
              // If we don't have enough parts, use the whole string as street address
              streetAddress = parts.join(", ");
            }

            // Clean up any trailing/leading commas and extra spaces
            streetAddress = streetAddress.replace(/,\s*$/, "").trim();
            city = city.replace(/,\s*$/, "").trim();

            // If we still don't have a city but have a street address
            if (!city && streetAddress) {
              const addressParts = streetAddress.split(" ");
              if (addressParts.length > 2) {
                // Use the last part as city if it's not the postal code
                const lastPart = addressParts[addressParts.length - 1];
                if (lastPart !== postalCode) {
                  city = lastPart;
                  streetAddress = addressParts.slice(0, -1).join(" ");
                }
              }
            }

            return {
              id: index + 1,
              address: streetAddress || addr, // Fallback to full address if parsing fails
              city: city || "City", // Provide default value
              postalCode: postalCode || "000000", // Provide default value
              fullAddress: addr, // Keep original full address
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
  };

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
      // Combine city and postal code for display
      fullAddress: `${newAddress.address}, ${newAddress.city}, ${newAddress.postalCode}`,
      isSelected: false,
    };

    const newAddresses = [...addresses, addressToAdd];
    setAddresses(newAddresses);
    setSelectedAddressId(newId);
    setNewAddress({
      address: "",
      city: "",
      postalCode: "",
    });
    setShowAddForm(false);
    setErrors({});

    // Update user address in API
    updateUserAddress(addressToAdd);
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
        postalCode: postalCodeValue,
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

    const updatedAddresses = addresses.map((addr) => {
      if (addr.id === editingAddressId) {
        const updatedAddress = {
          ...addr,
          name: userName,
          address: newAddress.address,
          city: newAddress.city,
          postalCode: newAddress.postalCode,
          // Update the combined address
          fullAddress: `${newAddress.address}, ${newAddress.city}, ${newAddress.postalCode}`,
        };

        // Update user address in API
        updateUserAddress(updatedAddress);

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
      postalCode: "",
    });
    setErrors({});
  };

  // Handle removing an address
  const handleRemoveAddress = async (id) => {
    try {
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      setAddresses(updatedAddresses);
      
      if (id === selectedAddressId) {
        setSelectedAddressId(
          updatedAddresses.length > 0 ? updatedAddresses[0].id : null
        );
      }

      // Update the address array in the backend
      const addressStrings = updatedAddresses.map(addr => addr.fullAddress);
      await axios.post(
        `${backend}/user/${userId}/update`,
        {
          user: {
            address: addressStrings,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Address removed successfully");
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
      updateUserAddress(selectedAddr);
    }
  };

  // Update the handlePayment function to create order and initiate payment
  const handlePayment = async () => {
    if (addresses.length === 0 || !selectedAddressId) {
      toast.error("Please add a delivery address");
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Get the selected address details
      const selectedAddr = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      
      // Use default postal code if not available
      const postalCode = selectedAddr.postalCode || "000000";

      // Calculate expected delivery date (3-4 days from now)
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 4);

      // Prepare order items with warranty information
      const orderItems = cartItems.map((item) => {
        // Calculate warranty expiry (1 year from now by default)
        const warrantyExpiry = new Date();
        warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + 1);

        return {
          product_id: item._id,
          quantity: item.quantity,
          warranty_expiry_date: warrantyExpiry,
          extended_warranty: 0, // Default to 0 as it's not implemented yet
          total_warranty: 12, // 12 months default warranty
        };
      });

      const orderData = {
        user_id: userId,
        products: orderItems,
        totalPrice: finalTotal,
        shippingAddress: selectedAddr.fullAddress,
        shippingCost: shippingFee,
        email: userData?.email,
        pincode: postalCode,
        name: userData ? `${userData.name}` : "",
        city: selectedAddr.city || "City", // Provide default if missing
        expectedDelivery: expectedDelivery,
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

      // Initiate PhonePe payment with the newly created orderId
      const FRONTEND_URL =  "https://www.bharatronix.com/thankyou/";

      const paymentData = {
        orderId: createdOrderId, // Use the orderId directly instead of from state
        userId: userId,
        FRONTEND_URL: FRONTEND_URL,
      };


      const paymentResponse = await axios.post(
        `${backend}/payment/create-payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        paymentResponse.data.data.response.phonepeResponse.redirectUrl
      ) {
        // Set the orderId in state before redirecting
        setOrderId(createdOrderId);
        // Redirect to PhonePe payment page
        window.location.href =
          paymentResponse.data.data.response.phonepeResponse.redirectUrl;
          ;
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error) {
      console.error("Payment error:", error);
      let errorMessage = "Failed to process payment";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
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
          navigate("/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    window.scrollTo(0, 0);
  }, [navigate]);

  // Fetch user details when userId and token are available
  useEffect(() => {
    if (userId && token) {
      fetchUserDetails();
    }
  }, [userId, token]);

  // Show add form by default if no addresses
  useEffect(() => {
    if (addresses.length === 0 && !showAddForm && !showEditForm && !loading) {
      setShowAddForm(true);
    }
  }, [addresses.length, showAddForm, showEditForm, loading]);

  return (
    <div className="bg-white py-6 min-h-screen font-[outfit]">
      <ToastContainer />
      <div className="px-4 md:px-10 lg:px-16">
        <div className="w-full font-[outfit] flex lg:flex-row flex-col items-center justify-between text-[#2F294D] text-sm font-medium py-2 mt-4 ">
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full"
            >
              <FaArrowLeft size={12} />
            </button>
            <span className="text-base">
              Back to previous page | Listed in category:{" "}
              <Link
                to="/product"
                className="font-semibold hover:text-[#f7941d]"
              >
                All Products
              </Link>
            </span>
            <div className="text-[#2F294D] pl-0 md:pl-10 font-semibold whitespace-nowrap">
              Checkout
            </div>
          </div>
        </div>

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
                          postalCode: "",
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
                      setNewAddress({ address: "", city: "", postalCode: "" });
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
                  <span className="text-[#f7941d]">
                    {deliveryDates.start} - {deliveryDates.end}
                  </span>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Code Discount</span>
                <span className="font-medium">₹{codeDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">Platform fees</span>
                  <button className="ml-2 text-blue-700 text-sm font-medium">
                    Know more
                  </button>
                </div>
                <span className="font-medium">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600">Shipping fees</span>
                  <button className="ml-2 text-blue-700 text-sm font-medium">
                    Know more
                  </button>
                </div>
                <span className="font-medium">₹{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-4">
                <span className="text-gray-600">Discount on MRP</span>
                <span className="font-medium text-green-600">
                  ₹{discountOnMrp.toFixed(2)}
                </span>
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
                "Continue to Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
