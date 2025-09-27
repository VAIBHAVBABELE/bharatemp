import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backend = import.meta.env.VITE_BACKEND;

const BulkOrderEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailModal, setEmailModal] = useState({ show: false, enquiry: null });
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

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

  const sendEmail = async () => {
    if (!emailMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSendingEmail(true);
    try {
      let token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }
      
      try {
        token = JSON.parse(token);
      } catch (e) {
        // Token is already a string
      }
      
      await axios.post(`${backend}/bulk-enquiry/${emailModal.enquiry._id}/send-email`, 
        { message: emailMessage },
        { headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } }
      );
      
      toast.success('Email sent successfully');
      setEmailModal({ show: false, enquiry: null });
      setEmailMessage('');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const openEmailModal = (enquiry) => {
    setEmailModal({ show: true, enquiry });
    setEmailMessage('');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1E3473] mb-1">Bulk Order Enquiries</h1>
          <p className="text-gray-600 text-sm">Manage and track all bulk order requests</p>
        </div>
        
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-[#1E3473] to-[#2A4A8A] p-4 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-bold">{enquiry.companyName}</h3>
                      <p className="text-blue-100 text-sm">{enquiry.contactPerson}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-100 text-xs">Submitted</p>
                      <p className="text-white text-sm font-medium">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(enquiry.status)}`}>
                    {enquiry.status}
                  </span>
                </div>
              </div>

              {/* Compact Content */}
              <div className="p-4">
                {/* Product & Contact Info in Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  {/* Product Info */}
                  <div className="bg-gradient-to-r from-[#F7941D] to-[#FF8C00] rounded-lg p-3 text-white">
                    <h4 className="font-semibold text-sm mb-2">Product Request</h4>
                    <p className="text-xs text-orange-100">Product</p>
                    <p className="font-medium text-sm truncate">{enquiry.productName}</p>
                    <p className="text-xs text-orange-100 mt-1">Quantity</p>
                    <p className="font-medium text-sm">{enquiry.quantity} units</p>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="font-semibold text-[#1E3473] text-sm mb-2">Contact</h5>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 truncate">{enquiry.email}</p>
                      <p className="text-xs text-gray-600">{enquiry.phone}</p>
                      <p className="text-xs text-gray-600">GST: {enquiry.gstNumber || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h5 className="font-semibold text-[#1E3473] text-sm mb-2">Order Info</h5>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">Price: {enquiry.expectedPrice || 'Not specified'}</p>
                      <p className="text-xs text-gray-600">Timeline: {enquiry.deliveryTimeline || 'Not specified'}</p>
                      <p className="text-xs text-gray-600">ID: #{enquiry._id.slice(-6)}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info - Collapsible */}
                {(enquiry.address || enquiry.description) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                    {enquiry.address && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <h5 className="font-semibold text-[#1E3473] text-sm mb-1">Address</h5>
                        <p className="text-xs text-gray-700 line-clamp-2">{enquiry.address}</p>
                      </div>
                    )}
                    {enquiry.description && (
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <h5 className="font-semibold text-[#1E3473] text-sm mb-1">Requirements</h5>
                        <p className="text-xs text-gray-700 line-clamp-2">{enquiry.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Section */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-700">Status:</span>
                    <select
                      value={enquiry.status}
                      onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => openEmailModal(enquiry)}
                      className="px-3 py-1 bg-[#F7941D] text-white rounded text-xs hover:bg-[#e8850a] transition-colors flex items-center space-x-1"
                    >
                      <span>📧</span>
                      <span>Send Email</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>📧 {enquiry.email}</span>
                    <span>📞 {enquiry.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {enquiries.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No Enquiries Found</h3>
              <p className="text-gray-500 text-sm">No bulk order enquiries have been submitted yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {emailModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#1E3473]">Send Email Response</h3>
              <button
                onClick={() => setEmailModal({ show: false, enquiry: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {emailModal.enquiry && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">To: <span className="font-medium">{emailModal.enquiry.email}</span></p>
                <p className="text-sm text-gray-600">Company: <span className="font-medium">{emailModal.enquiry.companyName}</span></p>
                <p className="text-sm text-gray-600">Product: <span className="font-medium">{emailModal.enquiry.productName}</span></p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Message:</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Enter your response message..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEmailModal({ show: false, enquiry: null })}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                disabled={sendingEmail}
                className="px-4 py-2 bg-[#F7941D] text-white rounded hover:bg-[#e8850a] disabled:opacity-50"
              >
                {sendingEmail ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOrderEnquiry;