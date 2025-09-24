import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backend = import.meta.env.VITE_BACKEND;

const BulkOrderEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      let token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }
      
      // Parse token if it's JSON stringified
      try {
        token = JSON.parse(token);
      } catch (e) {
        // Token is already a string
      }
      
      const response = await axios.post(`${backend}/bulk-enquiry/list`, {}, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 'Success') {
        setEnquiries(response.data.data.enquiries);
      }
    } catch (error) {
      toast.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      let token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }
      
      // Parse token if it's JSON stringified
      try {
        token = JSON.parse(token);
      } catch (e) {
        // Token is already a string
      }
      
      await axios.post(`${backend}/bulk-enquiry/${id}/update`, 
        { status: newStatus },
        { headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } }
      );
      
      toast.success('Status updated successfully');
      fetchEnquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E3473] mb-2">Bulk Order Enquiries</h1>
          <p className="text-gray-600">Manage and track all bulk order requests</p>
        </div>
        
        <div className="grid gap-6">
          {enquiries.map((enquiry) => (
            <div key={enquiry._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-[#1E3473] to-[#2A4A8A] p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{enquiry.companyName}</h3>
                    <p className="text-blue-100 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                      </svg>
                      {enquiry.contactPerson}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(enquiry.status)} shadow-md`}>
                    {enquiry.status}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Product Info Card */}
                <div className="bg-gradient-to-r from-[#F7941D] to-[#FF8C00] rounded-lg p-4 mb-6 text-white">
                  <h4 className="font-semibold text-lg mb-2">Product Request</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-orange-100 text-sm">Product Name</p>
                      <p className="font-medium">{enquiry.productName}</p>
                    </div>
                    <div>
                      <p className="text-orange-100 text-sm">Quantity</p>
                      <p className="font-medium">{enquiry.quantity} units</p>
                    </div>
                  </div>
                </div>

                {/* Contact & Business Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-[#1E3473] mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      Contact Information
                    </h5>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium text-gray-700">Email:</span> {enquiry.email}</p>
                      <p className="text-sm"><span className="font-medium text-gray-700">Phone:</span> {enquiry.phone}</p>
                      <p className="text-sm"><span className="font-medium text-gray-700">GST:</span> {enquiry.gstNumber || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-[#1E3473] mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      Order Details
                    </h5>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium text-gray-700">Expected Price:</span> {enquiry.expectedPrice || 'Not specified'}</p>
                      <p className="text-sm"><span className="font-medium text-gray-700">Timeline:</span> {enquiry.deliveryTimeline || 'Not specified'}</p>
                      <p className="text-sm"><span className="font-medium text-gray-700">Submitted:</span> {new Date(enquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                {enquiry.address && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-[#1E3473] mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      Delivery Address
                    </h5>
                    <p className="text-gray-700">{enquiry.address}</p>
                  </div>
                )}

                {/* Description Section */}
                {enquiry.description && (
                  <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-[#1E3473] mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                      </svg>
                      Additional Requirements
                    </h5>
                    <p className="text-gray-700">{enquiry.description}</p>
                  </div>
                )}

                {/* Action Section */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Update Status:</span>
                    <select
                      value={enquiry.status}
                      onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent bg-white shadow-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: #{enquiry._id.slice(-6)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {enquiries.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Enquiries Found</h3>
              <p className="text-gray-500">No bulk order enquiries have been submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkOrderEnquiry;