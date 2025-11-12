import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/mobile-responsive.css";

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backend = import.meta.env.VITE_BACKEND;

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backend}/blog/published?pageNum=1&pageSize=4`
      );

      if (response.data.status === "Success") {
        setBlogs(response.data.data.blogs || []);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="py-6 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Latest Blogs
            </h2>
            <p className="text-gray-600 text-lg">
              Stay updated with our latest insights and tutorials
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gray-300"></div>
                <div className="p-4">
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
      <div className="py-6 px-4 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Latest Blogs
          </h2>
          <p className="text-gray-600 text-lg">
            Stay updated with our latest insights and tutorials
          </p>
        </div>

        {/* Desktop Blogs Grid */}
        {blogs.length > 0 ? (
          <>
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Featured Image */}
                  {blog.featured_image_url && (
                    <div className="h-40 overflow-hidden bg-gray-100">
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
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
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {truncateText(blog.excerpt, 80)}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(blog.created_at)}</span>
                      <span>{blog.view_count || 0} views</span>
                    </div>

                    {/* Read More Link */}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Blogs Scroll - Zepto Style */}
            <div className="md:hidden">
              <div className="mobile-blog-container mobile-scroll">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="mobile-blog-card mobile-touch-feedback"
                  >
                    {/* Featured Image */}
                    {blog.featured_image_url && (
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="mobile-blog-image"
                      />
                    )}

                    {/* Content */}
                    <div className="mobile-blog-content">
                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {blog.tags.slice(0, 1).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full"
                              style={{fontSize: '8px'}}
                            >
                              {tag.length > 8 ? tag.substring(0, 8) + '...' : tag}
                            </span>
                          ))}
                          {blog.tags.length > 1 && (
                            <span className="text-gray-500" style={{fontSize: '8px'}}>
                              +{blog.tags.length - 1}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="mobile-blog-title">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p className="mobile-blog-excerpt">
                          {truncateText(blog.excerpt, 80)}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="mobile-blog-meta">
                        <span>{formatDate(blog.created_at)}</span>
                        <span>{blog.view_count || 0} views</span>
                      </div>

                      {/* Read More Link */}
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="mobile-blog-link"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View All Button */}
<div className="text-center mt-8 md:mt-12">
  <Link
    to="/blogs"
    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 md:py-3 md:px-8 md:text-base py-2 px-4 text-sm"
  >
    View All Blogs
  </Link>
</div>

          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No blogs available yet
            </div>
            <Link
              to="/blogs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 md:py-3 md:px-8 md:text-base py-2 px-4 text-sm"
            >
              View All Blogs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsSection;
