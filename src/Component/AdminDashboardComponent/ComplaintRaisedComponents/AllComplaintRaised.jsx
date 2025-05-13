import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { convertUTCtoIST2 } from '../../../utils/TimeConverter';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { useAdminRouteProtection } from '../../../utils/AuthUtils';
import UnauthorizedPopup from '../../../utils/UnAuthorizedPopup';

const backend = import.meta.env.VITE_BACKEND;

function AllComplaintRaised() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showPopup, closePopup, isAuthorized } = useAdminRouteProtection(["SuperAdmin"]);

  // Fetch all complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`${backend}/complaint/list`, {
        pageNum: 1,
        pageSize: 20,
        filters: {}
      });
      if (response.data.status === 'Success') {
        setComplaints(response.data.data.complaintList)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Update complaint status
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      setLoading(true)
      const response = await axios.post(`${backend}/complaint/${complaintId}/update`, { status: newStatus }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      if (response.data.status === 'Success') {
        fetchComplaints()
        setLoading(false)
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setLoading(false)
    }
  };

  if (!isAuthorized) {
    return showPopup ? <UnauthorizedPopup onClose={closePopup} /> : null;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16 bg-gradient-to-b from-gray-50 to-blue-50">
      <h1 className="text-2xl font-bold mb-6">All Raised Complaints</h1>
      {
        loading && <LoadingSpinner />
      }

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Issue Type</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Created At</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{complaint.name}</td>
                <td className="py-3 px-4">{complaint.email}</td>
                <td className="py-3 px-4">{complaint.userId.phone}</td>
                <td className="py-3 px-4">{complaint.issue_type === 'Other' ? complaint.customIssueType : complaint.issue_type}</td>
                <td className="py-3 px-4 max-w-xs">{complaint.description}</td>
                <td className="py-3 px-4">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                    className={`px-2 py-1 rounded ${complaint.status === 'Pending' ? 'bg-yellow-100' :
                      complaint.status === 'In_progress' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In_progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  {convertUTCtoIST2(complaint.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {complaints.length === 0 && !loading && (
        <div className="text-center mt-8 text-gray-500">No complaints found</div>
      )}
    </div>
  );
}

export default AllComplaintRaised;