import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [debouncedSelectedTag, setDebouncedSelectedTag] = useState("");

  const backend = import.meta.env.VITE_BACKEND;
  const pageSize = 9; // Show 9 blogs per page

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce selected tag
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSelectedTag(selectedTag);
    }, 300); // 300ms delay for tag changes

    return () => clearTimeout(timer);
  }, [selectedTag]);

  const fetchBlogs = useCallback(
    async (page = 1, search = "", tag = "") => {
      try {
        setLoading(true);
        let url = `${backend}/blog/published?pageNum=${page}&pageSize=${pageSize}`;

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        if (tag) {
          url += `&tag=${encodeURIComponent(tag)}`;
        }

        const response = await axios.get(url);

        if (response.data.status === "Success") {
          setBlogs(response.data.data.blogs || []);
          setTotalPages(response.data.data.totalPages || 1);
          setCurrentPage(page);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    },
    [backend, pageSize]
  );

  // Fetch blogs when debounced values change
  useEffect(() => {
    fetchBlogs(1, debouncedSearchTerm, debouncedSelectedTag);
  }, [fetchBlogs, debouncedSearchTerm, debouncedSelectedTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Immediate search on form submit
    fetchBlogs(1, searchTerm, selectedTag);
  };

  const handleTagFilter = (tag) => {
    const newTag = tag === selectedTag ? "" : tag;
    setSelectedTag(newTag);
    setCurrentPage(1);
    // For tag changes, we can fetch immediately since it's a single click
    if (newTag !== debouncedSelectedTag) {
      fetchBlogs(1, debouncedSearchTerm, newTag);
    }
  };

  const handlePageChange = (page) => {
    fetchBlogs(page, debouncedSearchTerm, debouncedSelectedTag);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
    setDebouncedSearchTerm("");
    setDebouncedSelectedTag("");
    fetchBlogs(1, "", "");
  };

  // Check if search is being debounced
  const isSearchDebouncing = searchTerm !== debouncedSearchTerm;
  const isTagDebouncing = selectedTag !== debouncedSelectedTag;

  // Get all unique tags from blogs
  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              All Blogs
            </h1>
            <p className="text-gray-600 text-lg">
              Discover insights, tutorials, and updates from our team
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto text-center py-16">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchBlogs(currentPage, searchTerm, selectedTag)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            All Blogs
          </h1>
          <p className="text-gray-600 text-lg">
            Discover insights, tutorials, and updates from our team
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isSearchDebouncing}
                  className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-1 rounded-md text-sm transition-colors"
                >
                  {isSearchDebouncing ? "..." : "Search"}
                </button>
              </div>
              {isSearchDebouncing && (
                <p className="text-sm text-gray-500 mt-1">Searching...</p>
              )}
            </form>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-700 font-medium mr-2">
                Filter by tags:
              </span>
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagFilter(tag)}
                  disabled={isTagDebouncing}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => handleTagFilter("")}
                  disabled={isTagDebouncing}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                >
                  Clear Filter
                </button>
              )}
              {isTagDebouncing && (
                <span className="text-sm text-gray-500 self-center">
                  Filtering...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Blogs Grid */}
        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Featured Image */}
                  {blog.featured_image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-gray-500 text-xs">
                            +{blog.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {truncateText(blog.excerpt, 120)}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{formatDate(blog.created_at)}</span>
                      <span>{blog.view_count || 0} views</span>
                    </div>

                    {/* Read More Link */}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">
              {searchTerm || selectedTag
                ? "No blogs found matching your criteria"
                : "No blogs available yet"}
            </div>
            {(searchTerm || selectedTag) && (
              <button
                onClick={handleClearFilters}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
