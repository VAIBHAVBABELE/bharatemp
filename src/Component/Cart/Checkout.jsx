import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

// Move AddressForm outside the main component to prevent re-renders
const AddressForm = ({
  isEditing = false,
  onClose,
  onSubmit,
  address,
  onInputChange,
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
        <label className="block text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          className="w-full border border-gray-300 rounded-lg p-2"
          value={address.name}
          onChange={onInputChange}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Address</label>
        <input
          type="text"
          name="address"
          placeholder="Enter address"
          className="w-full border border-gray-300 rounded-lg p-2"
          value={address.address}
          onChange={onInputChange}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">City & Postal Code</label>
        <input
          type="text"
          name="city"
          placeholder="City, State-Pincode"
          className="w-full border border-gray-300 rounded-lg p-2"
          value={address.city}
          onChange={onInputChange}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Mobile Number</label>
        <input
          type="text"
          name="mobile"
          placeholder="10-digit mobile number"
          className="w-full border border-gray-300 rounded-lg p-2"
          value={address.mobile}
          onChange={onInputChange}
        />
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
  const { cartItems, totalAmount, clearCart } = useCart();

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  // Delivery addresses state
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Shubham Home",
      address: "246 Punjabi Bagh, Clubroad,",
      city: "New Delhi, Delhi-110063",
      mobile: "7854655484",
      isSelected: true,
    },
   
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    mobile: "",
  });

  // Get selected address
  const selectedAddress =
    addresses.find((addr) => addr.id === selectedAddressId) || addresses[0];

  // Calculate pricing
  const codeDiscount = 15;
  const platformFee = 5;
  const shippingFee = 5;
  const discountOnMrp = Math.round(totalAmount * 0.01 * 100) / 100;

  // Calculate final total
  const finalTotal =
    totalAmount + platformFee + shippingFee - codeDiscount - discountOnMrp;

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

  // Handle address form input change
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.mobile) {
      alert("Please fill all fields");
      return;
    }

    const newId = addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1;

    const addressToAdd = {
      id: newId,
      ...newAddress,
      isSelected: false,
    };

    setAddresses([...addresses, addressToAdd]);
    setNewAddress({
      name: "",
      address: "",
      city: "",
      mobile: "",
    });
    setShowAddForm(false);
  };

  // Start editing an address
  const startEditAddress = (id) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (addressToEdit) {
      setNewAddress({
        name: addressToEdit.name,
        address: addressToEdit.address,
        city: addressToEdit.city,
        mobile: addressToEdit.mobile,
      });
      setEditingAddressId(id);
      setShowEditForm(true);
    }
  };

  // Handle saving edited address
  const handleSaveEditedAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.mobile) {
      alert("Please fill all fields");
      return;
    }

    const updatedAddresses = addresses.map((addr) => {
      if (addr.id === editingAddressId) {
        return {
          ...addr,
          name: newAddress.name,
          address: newAddress.address,
          city: newAddress.city,
          mobile: newAddress.mobile,
        };
      }
      return addr;
    });

    setAddresses(updatedAddresses);
    setShowEditForm(false);
    setEditingAddressId(null);
    setNewAddress({
      name: "",
      address: "",
      city: "",
      mobile: "",
    });
  };

  // Handle removing an address
  const handleRemoveAddress = (id) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== id);

    if (id === selectedAddressId && updatedAddresses.length > 0) {
      setSelectedAddressId(updatedAddresses[0].id);
    }

    setAddresses(updatedAddresses);
  };

  // Handle selecting an address
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isSelected: addr.id === id,
    }));
    setAddresses(updatedAddresses);
  };

  const handlePayment = () => {
    if (addresses.length === 0) {
      alert("Please add a delivery address");
      return;
    }
    clearCart();
    navigate("/thankyou");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white py-6 min-h-screen font-[outfit]">
      <div className="container mx-auto px-4">
        <div className="w-full font-[outfit] flex md:flex-row flex-col items-center justify-between text-[#2F294D] text-sm font-medium px-4 py-2 mt-4 ">
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center cursor-pointer bg-[#f7941d] text-white rounded-full"
            >
              <FaArrowLeft size={12} />
            </button>
            <span className="text-base">
              Back to previous page | Listed in category:{" "}
              <Link to="/product" className="font-semibold hover:text-[#f7941d]">
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
          <div className="p-6 md:w-[65%]">
            <h1 className="text-xl font-bold text-gray-800 mb-4">
              Select Delivery Address
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Enter Your Delivery Address for smooth order Delivery.
            </p>

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
                    } rounded-2xl p-6 relative`}
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

                    <h3 className="font-semibold text-lg mb-2">{addr.name}</h3>
                    <p className="text-gray-600 mb-1">{addr.address}</p>
                    <p className="text-gray-600 mb-3">{addr.city}</p>
                    <p className="text-gray-600 mb-4">Mobile: {addr.mobile}</p>

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
                  setShowAddForm(false);
                  setNewAddress({ name: "", address: "", city: "", mobile: "" });
                }}
                onSubmit={handleAddAddress}
                address={newAddress}
                onInputChange={handleAddressInputChange}
              />
            )}

            {/* Show edit address form */}
            {showEditForm && (
              <AddressForm
                isEditing={true}
                onClose={() => {
                  setShowEditForm(false);
                  setEditingAddressId(null);
                  setNewAddress({ name: "", address: "", city: "", mobile: "" });
                }}
                onSubmit={handleSaveEditedAddress}
                address={newAddress}
                onInputChange={handleAddressInputChange}
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
          </div>

          {/* Order Summary Section */}
          <div className="bg-gray-50 rounded-xl p-6 md:w-[35%] font-[outfit]">
            {addresses.length > 0 && selectedAddress && (
              <div className="bg-white p-4 rounded-xl mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Deliver Between :{" "}
                  <span className="text-[#f7941d]">
                    {deliveryDates.start} - {deliveryDates.end}
                  </span>
                </h3>
                <p className="text-gray-500 text-sm">
                  {selectedAddress.address}, {selectedAddress.city}
                </p>
              </div>
            )}

            <h2 className="text-xl font-bold text-[#2F294D] mb-6">Summary</h2>
            <div className="space-y-4 text-[#2F294D]">
              <div className="flex justify-between">
                <span className="text-gray-600">Total MRP</span>
                <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
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
              className="w-full bg-[#f7941d] cursor-pointer text-white py-3 rounded-2xl font-medium mt-4 flex items-center justify-center"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;