import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [readingTime, setReadingTime] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const backend = import.meta.env.VITE_BACKEND;

  const fetchRelatedBlogs = useCallback(
    async (tag) => {
      try {
        const response = await axios.get(
          `${backend}/blog/published?pageNum=1&pageSize=3&tag=${encodeURIComponent(
            tag
          )}`
        );
        if (response.data.status === "Success") {
          // Filter out the current blog and limit to 3
          const filtered = response.data.data.blogs
            .filter((b) => b.slug !== slug)
            .slice(0, 3);
          setRelatedBlogs(filtered);
        }
      } catch (err) {
        console.error("Error fetching related blogs:", err);
      }
    },
    [backend, slug]
  );

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend}/blog/slug/${slug}`);

      if (response.data.status === "Success") {
        setBlog(response.data.data);
        // Calculate reading time
        calculateReadingTime(response.data.data.content);
        // Fetch related blogs based on tags
        if (response.data.data.tags && response.data.data.tags.length > 0) {
          fetchRelatedBlogs(response.data.data.tags[0]);
        }
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog");
    } finally {
      setLoading(false);
    }
  }, [backend, slug, fetchRelatedBlogs]);

  const calculateReadingTime = (content) => {
    if (!content) return;
    // Remove HTML tags and count words
    const text = content.replace(/<[^>]*>/g, "");
    const wordsPerMinute = 200; // Average reading speed
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    setReadingTime(time);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you'd save this to localStorage or send to backend
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedBlogs") || "[]"
    );
    if (!isBookmarked) {
      bookmarks.push(slug);
    } else {
      const index = bookmarks.indexOf(slug);
      if (index > -1) bookmarks.splice(index, 1);
    }
    localStorage.setItem("bookmarkedBlogs", JSON.stringify(bookmarks));
  };

  const shareBlog = (platform) => {
    const url = window.location.href;
    const title = blog?.title || "Check out this blog post";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      default:
        break;
    }
    setShowShareModal(false);
  };

  const printBlog = () => {
    window.print();
  };

  useEffect(() => {
    fetchBlog();
    // Check if blog is bookmarked
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedBlogs") || "[]"
    );
    setIsBookmarked(bookmarks.includes(slug));

    // Add scroll listener for progress bar
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const progressBar = document.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.width = Math.min(100, scrollPercent) + "%";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchBlog, slug]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const renderContent = (content) => {
    if (!content) return null;

    // Simple HTML rendering - in a real app, you'd want to sanitize this
    return { __html: content };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-300"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-6 w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8">{error}</p>
          <Link
            to="/blogs"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-gray-600 text-lg">Blog not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-10">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
        <div className="progress-bar h-full bg-blue-600 transition-all duration-150 ease-out"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/blogs" className="text-blue-600 hover:text-blue-800">
            Blogs
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{blog.title}</span>
        </nav>

        {/* Blog Post */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          {/* Featured Image */}
          {blog.featured_image_url && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={blog.featured_image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{blog.view_count || 0} views</span>
                </div>
                {blog.updated_at && blog.updated_at !== blog.created_at && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Updated {formatDate(blog.updated_at)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={
                    isBookmarked ? "Remove bookmark" : "Bookmark this post"
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill={isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Share this post"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
                <button
                  onClick={printBlog}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Print this post"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="text-xl text-gray-700 mb-8 font-medium italic border-l-4 border-blue-500 pl-6">
                {blog.excerpt}
              </div>
            )}

            {/* Blog Content */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                {blog.content && (
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
                    dangerouslySetInnerHTML={renderContent(blog.content)}
                  />
                )}
              </div>

              {/* Table of Contents - Show only for long content */}
              {blog.content && blog.content.length > 2000 && (
                <div className="lg:w-64 flex-shrink-0">
                  <div className="sticky top-8 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {/* This would be dynamically generated from headings in the content */}
                      <a
                        href="#introduction"
                        className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        Introduction
                      </a>
                      <a
                        href="#main-content"
                        className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        Main Content
                      </a>
                      <a
                        href="#conclusion"
                        className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        Conclusion
                      </a>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Author Info Section */}
        {blog.author && (
          <div className="bg-gray-50 rounded-xl p-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {blog.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {blog.author}
                </h3>
                <p className="text-gray-600 text-sm">Author</p>
              </div>
            </div>
            {blog.author_bio && (
              <p className="text-gray-700 mt-4">{blog.author_bio}</p>
            )}
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Share this post
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareBlog("twitter")}
                  className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span className="text-sm font-medium">Twitter</span>
                </button>
                <button
                  onClick={() => shareBlog("facebook")}
                  className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium">Facebook</span>
                </button>
                <button
                  onClick={() => shareBlog("linkedin")}
                  className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-blue-700"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm font-medium">LinkedIn</span>
                </button>
                <button
                  onClick={() => shareBlog("copy")}
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Related Blogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {relatedBlog.featured_image_url && (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={relatedBlog.featured_image_url}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                    <Link
                      to={`/blog/${relatedBlog.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-30 back-to-top"
          title="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>

        {/* Print Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
              .progress-bar,
              .share-modal,
              .action-buttons,
              .back-to-top,
              nav,
              .comments-section {
                display: none !important;
              }
              .blog-content {
                box-shadow: none !important;
                border: 1px solid #e5e7eb !important;
              }
              body {
                font-size: 12pt;
                line-height: 1.5;
              }
            }
          `,
          }}
        />

        {/* Back to Blogs */}
        <div className="text-center">
          <Link
            to="/blogs"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
