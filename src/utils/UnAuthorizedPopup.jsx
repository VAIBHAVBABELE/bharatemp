import React from 'react';

const UnauthorizedPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-600">Unauthorized Access</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-700 mb-6">
          You don't have permission to access this page. Please contact your administrator.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPopup;