import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Eye, Loader, X, Edit } from 'lucide-react';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import { toast } from 'react-toastify';

const backend = import.meta.env.VITE_BACKEND;

function NewsUpdates() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [newsToDelete, setNewsToDelete] = useState(null);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedNewsToEdit, setSelectedNewsToEdit] = useState(null);

    // Form states
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post(`${backend}/news/list`, {
                pageNum: 1,
                pageSize: 20,
                filters: {}
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "Success") {
                setNews(response.data.data.newsList);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNews = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('token'));
            const formData = new FormData();

            formData.append('title', title);
            formData.append('subtitle', subtitle);
            formData.append('description', description);
            images.forEach((image) => {
                formData.append('img', image);
            });

            await axios.post(`${backend}/news/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            fetchNews();
            setIsCreatePopupOpen(false);
            resetForm();
            toast.success('News created successfully!');
        } catch (error) {
            console.error("Error creating news:", error);
        } finally {
            setLoading(false);
        }
    };

    const openEditPopup = (newsItem) => {
        setSelectedNewsToEdit(newsItem);
        setTitle(newsItem.title);
        setSubtitle(newsItem.subtitle);
        setDescription(newsItem.description);
        setExistingImages([...newsItem.image]);
        setIsEditPopupOpen(true);
    };

    const handleUpdateNews = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('token'));
            const formData = new FormData();

            formData.append('title', title);
            formData.append('subtitle', subtitle);
            formData.append('description', description);
            formData.append('existingImages', JSON.stringify(existingImages));
            formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

            images.forEach((image) => {
                formData.append('img', image);
            });

            await axios.post(`${backend}/news/${selectedNewsToEdit._id}/update-v2`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            fetchNews();
            setIsEditPopupOpen(false);
            resetForm();
            toast.success('News updated successfully!');
        } catch (error) {
            console.error("Error updating news:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageRemove = (index, isExisting) => {
        if (isExisting) {
            const imageToDelete = existingImages[index];
            setImagesToDelete([...imagesToDelete, imageToDelete]);
            setExistingImages(existingImages.filter((_, i) => i !== index));
        } else {
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
        }
    };

    const handleDeleteNews = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('token'));
            await axios.post(`${backend}/news/${newsToDelete._id}/remove`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            fetchNews();
            setNewsToDelete(null);
            toast.success('News deleted successfully!');
        } catch (error) {
            console.error("Error deleting news:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setSubtitle('');
        setDescription('');
        setImages([]);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newTotal = images.length + files.length;
        
        if (newTotal > 5) {
            return toast.error('You can only upload a maximum of 5 images.');
        }
        
        // Append new files to existing images
        setImages(prev => [...prev, ...files.slice(0, 5 - prev.length)]);
    };

    return (
        <div className="px-5 md:px-10 lg:px-20 pt-14  bg-gradient-to-b from-gray-50 to-blue-50 w-full mx-auto min-h-screen pb-10">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center mb-8">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800">News & Updates Management</h1>
                <button
                    onClick={() => setIsCreatePopupOpen(true)}
                    className="bg-blue-600 text-white w-48 sm:w-auto px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} /> Create News
                </button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {item.image[0] && (
                                <img
                                    src={item.image[0]}
                                    alt={item.title}
                                    className="w-full h-48 xl:h-56 object-cover cursor-pointer"
                                    onClick={() => setSelectedNews(item)}
                                />
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{item.title.substring(0, 200)}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.subtitle.substring(0, 200)}</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => openEditPopup(item)}
                                        className="text-gray-600 hover:text-green-600"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedNews(item)}
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => setNewsToDelete(item)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create News Popup */}
            {isCreatePopupOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[95vh] overflow-y-auto"
                        style={{
                            scrollbarWidth: "none",
                            WebkitOverflowScrolling: "touch"
                        }}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Create News Article</h2>
                                <button
                                    onClick={() => {
                                        setIsCreatePopupOpen(false);
                                        resetForm();
                                    }}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-white/90 mt-1 text-sm">Fill in the details below to create a new news article</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateNews} className="p-6">
                            <div className="space-y-6">
                                {/* Title Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Enter news title"
                                        required
                                    />
                                </div>

                                {/* Subtitle Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Subtitle <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Enter a short subtitle"
                                        required
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2 border resize-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px]"
                                        placeholder="Write the full news content here..."
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Images <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(Max 5 images)</span>
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                        <div className="space-y-1 text-center">
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload images</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="sr-only"
                                                        required
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, JPEG up to 5MB each
                                            </p>
                                        </div>
                                    </div>
                                    {images.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {Array.from(images).map((file, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index}`}
                                                        className="h-16 w-16 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = [...images];
                                                            newImages.splice(index, 1);
                                                            setImages(newImages);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreatePopupOpen(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="animate-spin" size={18} />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create News
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* News Details Popup */}
            {selectedNews && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="md:text-2xl font-bold">{selectedNews.title}</h2>
                            <button
                                onClick={() => setSelectedNews(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">{selectedNews.subtitle}</p>
                        <p className="text-gray-800 mb-6" style={{ whiteSpace: "pre-line" }}>{selectedNews.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedNews.image.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`News ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {newsToDelete && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete "{newsToDelete.title}"?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setNewsToDelete(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteNews}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                                disabled={loading}
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit News Popup */}
            {isEditPopupOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[95vh] overflow-y-auto" style={{
                        scrollbarWidth: 'none'
                    }}>
                        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Edit News Article</h2>
                                <button
                                    onClick={() => {
                                        setIsEditPopupOpen(false);
                                        resetForm();
                                    }}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-white/90 mt-1 text-sm">Update the news article details</p>
                        </div>

                        <form onSubmit={handleUpdateNews} className="p-6">
                            <div className="space-y-6">
                                {/* Title Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Enter news title"
                                        required
                                    />
                                </div>

                                {/* Subtitle Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Subtitle <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Enter a short subtitle"
                                        required
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2 border resize-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px]"
                                        placeholder="Write the full news content here..."
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Images <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-1">(Max 5 images)</span>
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                        <div className="space-y-1 text-center">
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload images</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, JPEG up to 5MB each
                                            </p>
                                        </div>
                                    </div>
                                    {images.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {Array.from(images).map((file, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index}`}
                                                        className="h-16 w-16 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = [...images];
                                                            newImages.splice(index, 1);
                                                            setImages(newImages);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Existing Images */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Existing Images
                                </label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={img}
                                                alt={`Existing ${index}`}
                                                className="h-16 w-16 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleImageRemove(index, true)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none mt-4 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={18} />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Edit size={18} />
                                        Update News
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsUpdates;