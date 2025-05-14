import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const backend = import.meta.env.VITE_BACKEND;

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
            address: userData.address || "",
          };
          
          setUser(formattedUserData);
          
          // Set form values
          Object.keys(formattedUserData).forEach(key => {
            setValue(key, formattedUserData[key]);
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
      
      // Prepare request body
      const requestBody = { 
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          // Preserve existing email and phone since they're disabled in the form
          email: user.email,
          phone: user.phone,
          address: data.address
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
          // Update user data locally
          setUser(data);
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
      
      // Simple error message handling
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

  return (
    <div className="bg-gray-100 p-4 flex flex-col lg:flex-row gap-6 py-10 px-4 md:px-10">
      {/* Sidebar */}
      <div className="bg-[#1e3473] text-white w-full h-auto lg:w-[30%] p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl md:text-[49.5px] font-semibold mb-6">My Profile</h2>
        <ul className="space-y-2 text-[24px] font-medium">
          <li className="text-[#F7941D] text-[26px]">Account Details</li>
          <li>Orders</li>
          <li>Track Your Order</li>
          <li>Addresses</li>
          <li>My Favorites</li>
          <li>Loyalty</li>
        </ul>
        <hr className="my-6 border-gray-400" />
        <button 
          onClick={handleLogout}
          className="text-white text-[26px] hover:text-[#F7941D]"
        >
          Logout
        </button>
      </div>

      {/* Profile Details */}
      <div className="bg-[#F8F8FA] flex-1 p-4 lg:p-8 rounded-3xl shadow-md">
        <h3 className="text-xl md:text-[32px] text-center lg:text-left font-semibold mb-4 text-[#383838]">Profile Details</h3>
        
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
              <label className="block text-[16px] font-medium text-[#656565]">Address</label>
              <textarea
                {...register("address", { required: "Address is required" })}
                className="mt-1 w-full border border-[#E2E2E2] rounded-xl px-4 py-2 text-sm outline-none resize-none"
                rows={3}
              />
              {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                    )}
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
                // Profile Data Display - Should show by default
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
                      <h4 className="text-[#1e3473] text-lg font-semibold mb-1">Address</h4>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg min-h-[80px]">{user.address || "No address provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
