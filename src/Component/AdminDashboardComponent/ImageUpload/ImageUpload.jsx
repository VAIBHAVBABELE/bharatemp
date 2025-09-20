import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageUpload = ({ onUploadSuccess, uploadType = 'product', multiple = false, maxFiles = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const backend = import.meta.env.VITE_BACKEND;

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    try {
      let endpoint = '';
      const token = JSON.parse(localStorage.getItem('token'));
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      if (uploadType === 'blog') {
        formData.append('image', files[0]);
        endpoint = `${backend}/blog/upload-image`;
      } else if (uploadType === 'product') {
        // Use same endpoint for both single and multiple
        Array.from(files).slice(0, maxFiles).forEach(file => {
          formData.append('img', file);
        });
        endpoint = `${backend}/product/upload-image`;
      }
        
      console.log('Sending request to:', endpoint);
      console.log('FormData files:', formData.getAll('img'));
      
      const response = await axios.post(endpoint, formData, { headers });
      
      console.log('Response:', response.data);

      if (response.data.status === 'Success' || response.data.status === 'SUCCESS') {
        toast.success(response.data.message || 'Upload successful!');
        
        // Handle different response formats
        let uploadData = response.data.data;
        console.log('Upload data:', uploadData);
        
        // If single image, wrap in array for consistency
        if (uploadData && !Array.isArray(uploadData) && uploadData.url) {
          uploadData = [uploadData];
        }
        
        onUploadSuccess && onUploadSuccess(uploadData);
      } else {
        console.error('Upload failed:', response.data);
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? openFileSelector : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 10MB {multiple ? `(max ${maxFiles} files)` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;