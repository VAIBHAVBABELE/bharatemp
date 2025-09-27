import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [emailModal, setEmailModal] = useState(null);
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const backend = import.meta.env.VITE_BACKEND;

  const statusColors = {
    'Open': 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    'Low': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Urgent': 'bg-red-100 text-red-800'
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend}/complaint/admin/all`);
      
      if (response.data.status === 'Success') {
        setComplaints(response.data.data.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await axios.put(
        `${backend}/complaint/admin/update/${complaintId}`,
        {
          status: newStatus,
          admin_response: adminResponse
        }
      );

      if (response.data.status === 'Success') {
        toast.success('Complaint updated successfully');
        fetchComplaints();
        setSelectedComplaint(null);
        setAdminResponse('');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const sendEmail = async (complaintId) => {
    try {
      setSendingEmail(true);
      const response = await axios.post(
        `${backend}/complaint/admin/send-email/${complaintId}`,
        { message: emailMessage }
      );

      if (response.data.status === 'Success') {
        toast.success('Email sent successfully');
        setEmailModal(null);
        setEmailMessage('');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7941D]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Complaints</h1>
        <button
          onClick={fetchComplaints}
          className="bg-[#F7941D] text-white px-4 py-2 rounded-lg hover:bg-[#e38616] transition-colors"
        >
          Refresh
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No complaints found</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {complaint.subject}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[complaint.status]}`}>
                      {complaint.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[complaint.priority]}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p><span className="font-medium">Customer:</span> {complaint.name}</p>
                      <p><span className="font-medium">Email:</span> {complaint.email}</p>
                      <p><span className="font-medium">Phone:</span> {complaint.phone}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Category:</span> {complaint.category}</p>
                      <p><span className="font-medium">Created:</span> {formatDate(complaint.created_at)}</p>
                      {complaint.resolved_at && (
                        <p><span className="font-medium">Resolved:</span> {formatDate(complaint.resolved_at)}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium text-gray-700 mb-2">Description:</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{complaint.description}</p>
                  </div>

                  {complaint.admin_response && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-2">Admin Response:</p>
                      <p className="text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                        {complaint.admin_response}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEmailModal(complaint)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
                <button
                  onClick={() => setSelectedComplaint(complaint)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Send Email Response</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">To: {emailModal.email}</p>
              <p className="text-sm text-gray-600 mb-1">Customer: {emailModal.name}</p>
              <p className="text-sm text-gray-600">Subject: {emailModal.subject}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Message *
              </label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
                placeholder="Type your response message to the customer..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEmailModal(null);
                  setEmailMessage('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => sendEmail(emailModal._id)}
                disabled={sendingEmail || !emailMessage.trim()}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {sendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Update Complaint Status</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Subject: {selectedComplaint.subject}</p>
              <p className="text-sm text-gray-600">Customer: {selectedComplaint.name}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Response (Optional)
              </label>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent"
                placeholder="Add your response to the customer..."
              />
            </div>

            <div className="flex gap-2 mb-4">
              {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateComplaintStatus(selectedComplaint._id, status)}
                  disabled={updatingStatus}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    selectedComplaint.status === status
                      ? 'bg-[#F7941D] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {updatingStatus ? 'Updating...' : status}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setAdminResponse('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;