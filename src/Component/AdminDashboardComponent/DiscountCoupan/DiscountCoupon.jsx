import React, { useState, useEffect } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND

const DiscountCoupon = () => {
  // Fake Coupons Data
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: "",
    expiryDate: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon({ ...newCoupon, [name]: value });
  };

  function convertUTCtoIST2(utcDateString) {
    const utcDate = new Date(utcDateString); // Parse UTC date
    return utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }); // Convert to IST
  }

  function convertUTCtoIST(utcDateString) {
    const utcDate = new Date(utcDateString); // Parse UTC date
    if (isNaN(utcDate)) return null; // Handle invalid dates

    // Convert UTC time to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30 in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate; // Return a Date object
  }


  async function getCoupons() {
    try {
      setLoading(true)
      const response = await axios.post(`${backend}/coupon/list`, {
        pageNum: 1,
        pageSize: 20,
        filters: {}
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      })
      if (response.data.status === "Success") {
        setCoupons(response.data.data.couponList)
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setLoading(false)
    }
  }

  // Handle Coupon Submission
  const handleCreateCoupon = async (e) => {
    try {
      e.preventDefault();

      if (!newCoupon.code || !newCoupon.discountPercentage || !newCoupon.expiryDate) {
        toast.error("Please fill all fields!");
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      if (newCoupon.expiryDate < today) {
        toast.error("Expiry date cannot be in the past!");
        return;
      }

      const response = await axios.post(`${backend}/coupon/create-coupon`, newCoupon, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });

      if (response.data.status === "Success") {
        toast.success("Coupon Created Successfully!");
        getCoupons();
        setShowModal(false);
        setNewCoupon({ code: "", discountPercentage: "", expiryDate: "" });
      }

    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error(error?.response?.data?.data?.message || "Failed to create coupon. Please try again.");
    }
  };

  useEffect(() => {
    getCoupons()
  }, [])

  if (!isAuthorized) {
    return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
  }

  return (
    <div className="px-5 w-full py-14 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      {
        loading && <LoadingSpinner />
      }
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold lg:text-4xl">Coupons</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          <IoAdd size={20} />
          Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 border">Coupon Code</th>
              <th className="p-3 border">Discount (%)</th>
              <th className="p-3 border">Expiry Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons
              .filter((coupon) => {
                const nowIST = new Date(convertUTCtoIST(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })))
                const expiryIST = new Date(convertUTCtoIST(coupon.expiryDate));
                return nowIST <= expiryIST;
              })
              .map((coupon) => (
                <tr key={coupon._id} className="border-b text-gray-600">
                  <td className="p-3 border font-semibold">{coupon.code}</td>
                  <td className="p-3 border">{coupon.discountPercentage}%</td>
                  <td className="p-3 border">{convertUTCtoIST2(coupon.expiryDate)}</td>
                  <td className="p-3 border font-semibold text-green-600">Active</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={() => setShowModal(false)}>
              <IoClose size={22} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Create Coupon</h2>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                  type="text"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter coupon code"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={newCoupon.discountPercentage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter discount percentage"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  value={newCoupon.expiryDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split("T")[0]} // Restricts past dates
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCoupon;
