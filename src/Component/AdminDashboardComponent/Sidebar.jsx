import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';

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
            {/* Sidebar */}
            <div 
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full overflow-y-scroll w-64 bg-gray-900 text-white p-6 pb-10 transform ${isOpen ? "translate-x-0" : "-translate-x-64"} transition-transform duration-300 ease-in-out z-50 shadow-lg`}
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#4A5568 #1A202C",
                }}
            >
                {/* Close Button */}
                <button onClick={closeNav} className="absolute top-4 right-4 text-white text-2xl">
                    <FaTimes />
                </button>

                {/* Navigation Links */}
                <nav className="mt-10 space-y-4">
                    <Link to='/admin-dashboard' onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Dashboard</Link>
                    {/* <Link to="/admin-dashboard/statistics" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Statistics</Link> */}
                    <Link to='/admin-dashboard/addproduct' onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Add Product</Link>
                    <Link to="/admin-dashboard/allproduct" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">All Products</Link>
                    <Link to="/admin-dashboard/orders" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Orders</Link>
                    <Link to="/admin-dashboard/coupon" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Discount Coupon</Link>
                    <Link to="/admin-dashboard/wholesale" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Wholesale Products</Link>
                    <Link to="/admin-dashboard/wholesale-bulk-orders" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Bulk Orders</Link>
                    <Link to="/admin-dashboard/area-of-services" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Area of Services</Link>
                    <Link to="/admin-dashboard/invoices" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Invoices</Link>
                    <Link to="/admin-dashboard/return-requests" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Return Requests</Link>
                    <Link to="/admin-dashboard/complaints" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">All Complaint Raised</Link>
                    <Link to="/admin-dashboard/news-updates" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">News & Updates</Link>
                </nav>
            </div>

            {/* Toggle Button */}
            <button 
                className="fixed top-16 sm:top-20 md:top-24 left-2 z-40 text-3xl bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-400 transition duration-200"
                onClick={toggleNav}
            >
                <FaBars />
            </button>

            {/* Background Overlay when sidebar is open */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 bg-opacity-50 z-40"
                    onClick={closeNav} // Clicking outside closes sidebar
                ></div>
            )}
        </>
    );
};

export default Sidebar;
