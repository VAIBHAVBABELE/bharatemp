import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Custom styles for the component
const styles = {
  container: {
    padding: "12px 16px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.2s",
  },
  buttonHover: {
    backgroundColor: "#2563eb",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
  },
  buttonOutlineHover: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    marginBottom: "16px",
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  },
  cardContent: {
    padding: "20px",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    borderColor: "#3b82f6",
  },
  textarea: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  select: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  badgePublished: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  badgeDraft: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  tableHeaderCell: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  tableCell: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  },
  modalBody: {
    padding: "24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "20px",
  },
  tabButton: {
    padding: "12px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    borderBottom: "2px solid transparent",
    transition: "all 0.2s",
  },
  tabButtonActive: {
    color: "#3b82f6",
    borderBottomColor: "#3b82f6",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1f2937",
    margin: "8px 0",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#6b7280",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "24px",
  },
  paginationButton: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  searchContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    alignItems: "end",
  },
  searchInput: {
    flex: 1,
    position: "relative",
  },
  icon: {
    width: "16px",
    height: "16px",
  },
  actionButton: {
    padding: "6px 8px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    borderRadius: "4px",
    color: "#6b7280",
  },
  actionButtonHover: {
    backgroundColor: "#f3f4f6",
  },
  deleteButton: {
    color: "#ef4444",
  },
  deleteButtonHover: {
    backgroundColor: "#fef2f2",
  },
};

const backend = import.meta.env.VITE_BACKEND;

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [activeTab, setActiveTab] = useState("content");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    tags: "",
    status: "draft",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const showToast = (message, type = "info") => {
    // Simple toast implementation
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      ${type === "success" ? "background-color: #10b981;" : ""}
      ${type === "error" ? "background-color: #ef4444;" : ""}
      ${type === "info" ? "background-color: #3b82f6;" : ""}
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backend}/blog/list`,
        {
          pageNum: currentPage,
          pageSize: 20,
          filters: {
            ...(statusFilter !== "all" && { status: statusFilter }),
            ...(searchTerm.trim() && { search: searchTerm.trim() }),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (response.data.status === "Success") {
        setPosts(response.data.data.blogList || []);
        setTotalPages(response.data.data.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      showToast("Failed to fetch blog posts", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${backend}/blog/stats`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (response.data.status === "Success") {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [fetchPosts]);

  const handleCreatePost = async () => {
    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        showToast("Title and content are required", "error");
        return;
      }

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        featured_image_url: formData.featured_image_url.trim() || undefined,
        status: formData.status,
        tags: formData.tags.trim()
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined,
        meta_title: formData.meta_title.trim() || undefined,
        meta_description: formData.meta_description.trim() || undefined,
        meta_keywords: formData.meta_keywords.trim()
          ? formData.meta_keywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean)
          : undefined,
      };

      const response = await axios.post(`${backend}/blog/create`, postData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (response.data.status === "Success") {
        showToast("Blog post created successfully", "success");
        setIsCreateModalOpen(false);
        resetForm();
        fetchPosts();
        fetchStats();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showToast(
        error.response?.data?.message || "Failed to create blog post",
        "error"
      );
    }
  };

  const handleEditPost = async () => {
    if (!selectedPost) return;

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        showToast("Title and content are required", "error");
        return;
      }

      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        featured_image_url: formData.featured_image_url.trim() || undefined,
        status: formData.status,
        tags: formData.tags.trim()
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined,
        meta_title: formData.meta_title.trim() || undefined,
        meta_description: formData.meta_description.trim() || undefined,
        meta_keywords: formData.meta_keywords.trim()
          ? formData.meta_keywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean)
          : undefined,
      };

      const response = await axios.put(
        `${backend}/blog/update/${selectedPost._id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );

      if (response.data.status === "Success") {
        showToast("Blog post updated successfully", "success");
        setIsEditModalOpen(false);
        setSelectedPost(null);
        resetForm();
        fetchPosts();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      showToast(
        error.response?.data?.message || "Failed to update blog post",
        "error"
      );
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await axios.delete(`${backend}/blog/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (response.data.status === "Success") {
        showToast("Blog post deleted successfully", "success");
        fetchPosts();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast(
        error.response?.data?.message || "Failed to delete blog post",
        "error"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      featured_image_url: "",
      tags: "",
      status: "draft",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    });
    setActiveTab("content");
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      featured_image_url: post.featured_image_url || "",
      tags: post.tags?.join(", ") || "",
      status: post.status,
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      meta_keywords: post.meta_keywords?.join(", ") || "",
    });
    setIsEditModalOpen(true);
  };

  const renderFormFields = () => (
    <div>
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "content" ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab("content")}
        >
          Content
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "seo" ? styles.tabButtonActive : {}),
          }}
          onClick={() => setActiveTab("seo")}
        >
          SEO Settings
        </button>
      </div>

      {activeTab === "content" && (
        <div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              type="text"
              style={styles.input}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter post title"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              style={{ ...styles.textarea, minHeight: "80px" }}
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Enter post excerpt (recommended for SEO)"
              rows={3}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="content">
              Content *
            </label>
            <textarea
              id="content"
              style={{ ...styles.textarea, minHeight: "200px" }}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Enter post content"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="featured_image">
              Featured Image URL
            </label>
            <input
              id="featured_image"
              type="url"
              style={styles.input}
              value={formData.featured_image_url}
              onChange={(e) =>
                setFormData({ ...formData, featured_image_url: e.target.value })
              }
              placeholder="Enter image URL"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              style={styles.input}
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              style={styles.select}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="meta_title">
              Meta Title
            </label>
            <input
              id="meta_title"
              type="text"
              style={styles.input}
              value={formData.meta_title}
              onChange={(e) =>
                setFormData({ ...formData, meta_title: e.target.value })
              }
              placeholder="SEO meta title (recommended: 50-60 characters)"
              maxLength={60}
            />
            <small style={{ color: "#6b7280", fontSize: "12px" }}>
              {formData.meta_title.length}/60 characters
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="meta_description">
              Meta Description
            </label>
            <textarea
              id="meta_description"
              style={{ ...styles.textarea, minHeight: "80px" }}
              value={formData.meta_description}
              onChange={(e) =>
                setFormData({ ...formData, meta_description: e.target.value })
              }
              placeholder="SEO meta description (recommended: 150-160 characters)"
              rows={3}
              maxLength={160}
            />
            <small style={{ color: "#6b7280", fontSize: "12px" }}>
              {formData.meta_description.length}/160 characters
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="meta_keywords">
              Meta Keywords (comma-separated)
            </label>
            <input
              id="meta_keywords"
              type="text"
              style={styles.input}
              value={formData.meta_keywords}
              onChange={(e) =>
                setFormData({ ...formData, meta_keywords: e.target.value })
              }
              placeholder="Enter SEO keywords separated by commas"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Blog Management</h1>
          <p style={styles.subtitle}>
            Create and manage SEO-optimized blog posts
          </p>
        </div>
        <button
          style={styles.button}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <span>+</span>
          Create Post
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Posts</div>
          <div style={styles.statValue}>{stats.total}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Published</div>
          <div style={{ ...styles.statValue, color: "#10b981" }}>
            {stats.published}
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Drafts</div>
          <div style={{ ...styles.statValue, color: "#f59e0b" }}>
            {stats.draft}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.card}>
        <div style={styles.cardContent}>
          <div style={styles.searchContainer}>
            <div style={styles.searchInput}>
              <label style={styles.label} htmlFor="search">
                Search Posts
              </label>
              <input
                id="search"
                type="text"
                style={styles.input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, content, or tags..."
              />
            </div>
            <div>
              <label style={styles.label} htmlFor="status-filter">
                Status
              </label>
              <select
                id="status-filter"
                style={styles.select}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <button
              style={styles.button}
              onClick={() => {
                setCurrentPage(1);
                fetchPosts();
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>All Blog Posts</h2>
        </div>
        <div style={styles.cardContent}>
          {loading ? (
            <div style={styles.loading}>
              <div>Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <div style={styles.empty}>
              <div>No blog posts found.</div>
              <button
                style={styles.button}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Title</th>
                    <th style={styles.tableHeaderCell}>Status</th>
                    <th style={styles.tableHeaderCell}>Tags</th>
                    <th style={styles.tableHeaderCell}>Created</th>
                    <th style={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td style={styles.tableCell}>
                        <div>
                          <div style={{ fontWeight: "600" }}>{post.title}</div>
                          {post.excerpt && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginTop: "4px",
                              }}
                            >
                              {post.excerpt.length > 100
                                ? `${post.excerpt.substring(0, 100)}...`
                                : post.excerpt}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.badge,
                            ...(post.status === "published"
                              ? styles.badgePublished
                              : styles.badgeDraft),
                          }}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        {post.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              ...styles.badge,
                              backgroundColor: "#e5e7eb",
                              color: "#374151",
                              marginRight: "4px",
                              fontSize: "11px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags && post.tags.length > 2 && (
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            +{post.tags.length - 2} more
                          </span>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            style={styles.actionButton}
                            onClick={() => openEditModal(post)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                            onClick={() => handleDeletePost(post._id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    style={{
                      ...styles.paginationButton,
                      ...(currentPage === 1
                        ? styles.paginationButtonDisabled
                        : {}),
                    }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span style={{ margin: "0 12px", color: "#6b7280" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    style={{
                      ...styles.paginationButton,
                      ...(currentPage === totalPages
                        ? styles.paginationButtonDisabled
                        : {}),
                    }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div style={styles.modal} onClick={() => setIsCreateModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Blog Post</h2>
            </div>
            <div style={styles.modalBody}>
              {renderFormFields()}
              <div style={styles.buttonGroup}>
                <button
                  style={{ ...styles.button, ...styles.buttonOutline }}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button style={styles.button} onClick={handleCreatePost}>
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div style={styles.modal} onClick={() => setIsEditModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Blog Post</h2>
            </div>
            <div style={styles.modalBody}>
              {renderFormFields()}
              <div style={styles.buttonGroup}>
                <button
                  style={{ ...styles.button, ...styles.buttonOutline }}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button style={styles.button} onClick={handleEditPost}>
                  Update Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
