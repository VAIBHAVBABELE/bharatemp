import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeNav();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-2xl bg-gray-900 text-white p-2 rounded-md shadow-lg"
        onClick={toggleNav}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:relative top-0 left-0 h-auto overflow-y-scroll w-64 bg-gray-900 text-white p-4 pb-10 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4A5568 #1A202C",
        }}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={closeNav}
          className="md:hidden absolute top-4 right-4 text-white text-xl"
        >
          <FaTimes />
        </button>

        {/* Navigation Links */}
        <nav className="mt-12 md:mt-0 space-y-1 md:space-y-4">
          <Link
            to="/admin-dashboard"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Dashboard
          </Link>
          {/* <Link
            to="/admin-dashboard/statistics"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Statistics
          </Link> */}
          <Link
            to="/admin-dashboard/addproduct"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Add Product
          </Link>
          <Link
            to="/admin-dashboard/allproduct"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            All Products
          </Link>
          <Link
            to="/admin-dashboard/orders"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Orders
          </Link>
          <Link
            to="/admin-dashboard/coupon"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Discount Coupon
          </Link>
          <Link
            to="/admin-dashboard/wholesale"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Wholesale Products
          </Link>
          <Link
            to="/admin-dashboard/wholesale-bulk-orders"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Bulk Orders
          </Link>
          <Link
            to="/admin-dashboard/area-of-services"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Area of Services
          </Link>
          <Link
            to="/admin-dashboard/invoices"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Invoices
          </Link>
          <Link
            to="/admin-dashboard/return-requests"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Return Requests
          </Link>
          <Link
            to="/admin-dashboard/complaints"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            All Complaint Raised
          </Link>
          <Link
            to="/admin-dashboard/contactus"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Contact Us
          </Link>
          <Link
            to="/admin-dashboard/news-updates"
            onClick={closeNav}
            className="block p-2 border-t-1 mt-8 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            News & Updates
          </Link>
          <Link
            to="/admin-dashboard/blog-management"
            onClick={closeNav}
            className="block p-2 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Blog Management
          </Link>
          <Link
            to="/"
            onClick={closeNav}
            className="block p-2 border-t-1 mt-8 md:p-3 hover:bg-gray-700 rounded text-sm md:text-base"
          >
            Back to HomePage
          </Link>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeNav}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
