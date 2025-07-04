import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
const backend = import.meta.env.VITE_BACKEND;

const OrderModal = ({ order, onClose }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate total price from products
  const calculateTotalPrice = () => {
    return order.products.reduce((total, product) => {
      return total + (product.product_id.discounted_single_product_price * product.quantity);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 shadow-2xl">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes size={30} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Order #{order._id.slice(-6)}</h4>
              <span className="font-bold text-lg text-[#F7941D]">
                ₹{calculateTotalPrice().toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Placed on: {formatDate(order.created_at)}
            </p>
            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
              {order.status}
            </div>
          </div>

          {/* Shipping Details */}
          <div>
            <h4 className="font-medium mb-2">Shipping Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-1">
              <p className="text-sm"><span className="font-medium">Name:</span> {order.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {order.email}</p>
              <p className="text-sm"><span className="font-medium">Address:</span> {order.shippingAddress}</p>
              <p className="text-sm"><span className="font-medium">City:</span> {order.city}</p>
              <p className="text-sm"><span className="font-medium">Pincode:</span> {order.pincode}</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div>
            <h4 className="font-medium mb-2">Delivery Information</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-1">
              <p className="text-sm"><span className="font-medium">Expected Delivery:</span> {formatDate(order.expectedDelivery)}</p>
              <p className="text-sm"><span className="font-medium">Shipping Cost:</span> ₹{order.shippingCost}</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-medium mb-2">Products</h4>
            <div className="space-y-4">
              {order.products.map((item) => (
                <div key={item._id} className="bg-gray-50 p-4 rounded-lg flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.product_id.product_image_main}
                      alt={item.product_id.product_name}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="flex-grow space-y-2">
                    <h5 className="font-medium">{item.product_id.product_name}</h5>
                    <p className="text-sm"><span className="font-medium">SKU:</span> {item.product_id.SKU}</p>
                    <p className="text-sm"><span className="font-medium">Quantity:</span> {item.quantity}</p>
                    <p className="text-sm"><span className="font-medium">Price:</span> ₹{item.product_id.discounted_single_product_price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return Request Button */}
          {order.status === 'Delivered' && !order.return_request && (
            <div className="pt-4 border-t">
              <button className="w-full bg-[#F7941D] text-white py-2 rounded-lg hover:bg-[#e38616] transition-colors">
                Request Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        const decoded = jwtDecode(parsedToken);
        const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;

        const response = await axios.post(
          `${backend}/order/my-orders`,
          { userId },
          {
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedToken}`
            }
          }
        );

        if (response.data && response.data.status === "Success") {
          const sortedOrders = response.data.data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">Order #{order._id.slice(-6)}</h3>
                  <p>{formatDate(order.created_at || order.createdAt)}</p>
                </div>
                <span className="font-bold text-[#F7941D]">
                  ₹{order.totalPrice?.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-1">
                  {order.shippingAddress}
                </p>
                
                <p className="text-sm text-gray-600">
                  Items: {order.products.reduce((acc, curr) => acc + curr.quantity, 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

const TrackOrder = () => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>
    <p className="text-gray-500">Order tracking feature coming soon!</p>
  </div>
);

const Addresses = ({ user, onEdit }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Your Addresses</h2>
    <div className="space-y-2">
      {user.address && user.address.length > 0 ? (
        user.address.map((addr, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            {addr}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No addresses saved</p>
      )}
    </div>
    <button
      onClick={onEdit}
      className="mt-4 bg-[#F7941D] text-white px-6 py-2 rounded-full"
    >
      Add/Edit Address
    </button>
  </div>
);

const Favorites = () => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-semibold mb-4">Your Favorites</h2>
    <p className="text-gray-500">Favorites feature coming soon!</p>
  </div>
);

const Loyalty = () => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-semibold mb-4">Loyalty Program</h2>
    <p className="text-gray-500">Loyalty program coming soon!</p>
  </div>
);

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Form validation rules
  const nameValidationPattern = {
    value: /^[A-Za-z\s]+$/,
    message: "Only alphabets are allowed"
  };

  const [activeSection, setActiveSection] = useState("profile");

  // Define navigation items
  const navItems = [
    { id: "profile", label: "Account Details" },
    { id: "orders", label: "Orders" },
    { id: "addresses", label: "Addresses" },
    { id: "favorites", label: "My Favorites" },
    { id: "loyalty", label: "Loyalty" }
  ];

  // Update active section based on URL params
  useEffect(() => {
    const section = new URLSearchParams(location.search).get("section");
    if (section && navItems.some(item => item.id === section)) {
      setActiveSection(section);
    }
  }, [location]);

  // Fetch user data from API using token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Ensure editing is false when loading data
        setIsEditing(false);
        
        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }
        
        // Parse token if stored as JSON string, otherwise use directly
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        
        // Decode the JWT token to get userId
        const decoded = jwtDecode(parsedToken);
        const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
        
        if (!userId) {
          setError("User ID not found in token");
          setIsLoading(false);
          return;
        }
        
        // Fetch user details from API using the userId
        const response = await axios.get(`${backend}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${parsedToken}`
          }
        });        
        // Check if the request was successful
        if (response.status === 200 && response.data) {
          const userData = response.data.data.user;
          
          // Set user state with API response data
          const formattedUserData = {
            firstName: userData.firstName || userData.name?.split(" ")[0] || "",
            lastName: userData.lastName || (userData.name?.split(" ").length > 1 ? userData.name.split(" ")[1] : "") || "",
            email: userData.email || "",
            phone: userData.phone || userData.mobile || "",
            address: Array.isArray(userData.address) ? userData.address : [],
          };
          
          setUser(formattedUserData);
          
          // Set form values
          Object.keys(formattedUserData).forEach(key => {
            if (key === 'address') {
              setValue(key, formattedUserData[key].join('\n'));
            } else {
              setValue(key, formattedUserData[key]);
            }
          });
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.response?.data?.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Get token and userId
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
      const decoded = jwtDecode(parsedToken);
      const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
      
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }
      
      // Convert address string to array by splitting on newlines and filtering empty lines
      const addressArray = data.address.split('\n').filter(addr => addr.trim());
      
      // Prepare request body
      const requestBody = { 
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: user.email,
          phone: user.phone,
          address: addressArray
        }
      };
      
      // Make API request
      const response = await axios.post(`${backend}/user/${userId}/update`, requestBody, {
        headers: { Authorization: `Bearer ${parsedToken}` }
      });
      
      // Handle success
      if (response.status === 200 && response.data.status === "Success") {
        const isSuccess = response.data.status === "Success";
        
        if (isSuccess) {
          // Update user data locally with the address array
          setUser({
            ...data,
            address: addressArray
          });
          setIsEditing(false);
          toast.success("Profile updated successfully!");
        } else {
          throw new Error("Update failed");
        }
      } else {
        throw new Error(`Server returned status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      let errorMessage = "Failed to update profile";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <Orders />;
      case "addresses":
        return <Addresses user={user} onEdit={() => setActiveSection("profile")} />;
      case "favorites":
        return <Favorites />;
      case "loyalty":
        return <Loyalty />;
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Profile Image & Edit Button */}
                <div className="w-full lg:w-[20%] flex flex-col items-center justify-center gap-4">
                  <div className="w-40 h-40 bg-[#EAECF0] rounded-full flex items-center justify-center overflow-hidden">
                    {user.firstName && (
                      <div className="text-5xl font-bold text-[#1e3473]">
                        {user.firstName.charAt(0)}
                        {user.lastName ? user.lastName.charAt(0) : ""}
                      </div>
                    )}
                  </div>
                  <button 
                    className="bg-[#F7941D] text-white text-[18px] px-10 py-1 mt-4 rounded-full"
                    onClick={toggleEditMode}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {/* Profile Content */}
                <div className="flex-1">
                  {isEditing === true ? (
                    // Edit Form
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FFFFFF] py-6 px-6 rounded-xl">
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">First Name</label>
                        <input
                          {...register("firstName", { 
                            required: "First name is required",
                            pattern: nameValidationPattern
                          })}
                          className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">Last Name</label>
                        <input
                          {...register("lastName", { 
                            required: "Last name is required",
                            pattern: nameValidationPattern
                          })}
                          className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">Email</label>
                        <input
                          type="email"
                          {...register("email")}
                          className="mt-1 w-full border border-[#E2E2E2] bg-gray-100 rounded-full px-4 py-2 text-sm outline-none cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be edited</p>
                      </div>
                      <div>
                        <label className="block text-[16px] font-medium text-[#656565]">Phone</label>
                        <input
                          type="tel"
                          {...register("phone")}
                          className="mt-1 w-full border border-[#E2E2E2] bg-gray-100 rounded-full px-4 py-2 text-sm outline-none cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Phone number cannot be edited</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[16px] font-medium text-[#656565]">Addresses (One per line)</label>
                        <textarea
                          {...register("address", { required: "At least one address is required" })}
                          className="mt-1 w-full border border-[#E2E2E2] rounded-xl px-4 py-2 text-sm outline-none resize-none"
                          rows={5}
                          placeholder="Enter each address on a new line"
                        />
                        {errors.address && (
                          <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Enter multiple addresses by putting each address on a new line</p>
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end">
                        <button 
                          type="submit" 
                          className="bg-[#F7941D] text-white px-6 py-2 rounded-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Profile Data Display
                    <div className="bg-[#FFFFFF] py-6 px-6 rounded-xl">
                      <div className="flex flex-col space-y-6">
                        {/* Name Section */}
                        <div className="flex flex-col md:flex-row md:space-x-8">
                          <div className="mb-4 md:mb-0 md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">First Name</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.firstName}</p>
                          </div>
                          <div className="md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Last Name</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.lastName}</p>
                          </div>
                        </div>
                        
                        {/* Contact Section */}
                        <div className="flex flex-col md:flex-row md:space-x-8">
                          <div className="mb-4 md:mb-0 md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Email</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.email}</p>
                          </div>
                          <div className="md:w-1/2">
                            <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Phone</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.phone}</p>
                          </div>
                        </div>
                        
                        {/* Address Section */}
                        <div>
                          <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Addresses</h4>
                          <div className="space-y-2">
                            {user.address && user.address.length > 0 ? (
                              user.address.map((addr, index) => (
                                <p key={index} className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                                  {addr}
                                </p>
                              ))
                            ) : (
                              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">No addresses provided</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 p-4 flex flex-col lg:flex-row gap-6 py-10 px-4 md:px-10">
      {/* Sidebar */}
      <div className="bg-[#1e3473] text-white w-full h-auto lg:w-[30%] p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl md:text-[49.5px] font-semibold mb-6">My Profile</h2>
        <ul className="space-y-2 text-[24px] font-medium">
          {navItems.map(item => (
            <li
              key={item.id}
              className={`cursor-pointer transition-colors duration-200 ${
                activeSection === item.id
                  ? "text-[#F7941D]"
                  : "text-white hover:text-[#F7941D]"
              }`}
              onClick={() => {
                setActiveSection(item.id);
                navigate(`/profile?section=${item.id}`);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <hr className="my-6 border-gray-400" />
        <button 
          onClick={handleLogout}
          className="text-white text-[26px] hover:text-[#F7941D]"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[#F8F8FA] flex-1 p-4 lg:p-8 rounded-3xl shadow-md">
        {renderSection()}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
