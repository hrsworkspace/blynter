"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  Tag,
  User,
  PlusCircle,
  X,
  Layers,
  ChevronRight,
  Loader2,
  Globe,
  Settings,
  HelpCircle,
  Eye,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // null means "Create Mode"
  const [activeTab, setActiveTab] = useState("general"); // general, seo, faqs

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    category: "",
    subCategory: "",
    author: "",
    heroImage: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    faqs: []
  });

  // FAQ Input Temp State
  const [tempFaq, setTempFaq] = useState({ question: "", answer: "" });

  // Custom Toast State
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // Fetch blogs on load
  useEffect(() => {
    fetchBlogs();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blog");
      const result = await response.json();
      if (result.success) {
        setBlogs(result.data || []);
      } else {
        setError(result.error || "Failed to fetch blogs.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred while fetching blogs.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    const slugVal = titleVal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    setFormData((prev) => ({
      ...prev,
      title: titleVal,
      // Only auto-update slug if we are creating or editing and they match/slug is empty
      slug: prev.slug === "" || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        ? slugVal
        : prev.slug
    }));
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setActiveTab("general");
    setFormData({
      title: "",
      slug: "",
      content: "",
      category: "",
      subCategory: "",
      author: "",
      heroImage: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      faqs: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setActiveTab("general");
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      content: blog.content || "",
      category: blog.category || "",
      subCategory: blog.subCategory || "",
      author: blog.author || "",
      heroImage: blog.heroImage || "",
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      metaKeywords: blog.metaKeywords || "",
      faqs: blog.faqs || []
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // FAQ Manager functions
  const addFaq = () => {
    if (!tempFaq.question.trim() || !tempFaq.answer.trim()) {
      showToast("Both FAQ question and answer are required", "error");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { ...tempFaq }]
    }));
    setTempFaq({ question: "", answer: "" });
  };

  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast("Title and Content are required fields.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const url = editingBlog ? `/api/blog/${editingBlog._id}` : "/api/blog";
      const method = editingBlog ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (result.success) {
        showToast(
          editingBlog
            ? "Blog post updated successfully!"
            : "Blog post created successfully!"
        );
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        showToast(result.error || "Failed to save blog post.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving blog post. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE"
      });
      const result = await response.json();

      if (result.success) {
        showToast("Blog post deleted successfully.");
        fetchBlogs();
      } else {
        showToast(result.error || "Failed to delete blog post.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting blog post.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Categories list extracted dynamically
  const categories = ["All", ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  // Filtering blogs based on search and selected category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-16">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-5 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sleek Custom Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#131b2e] border-l-4 border-blue-500 text-slate-200 px-5 py-4 rounded-lg shadow-2xl animate-fade-in max-w-md">
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Main Admin Nav */}
      <nav className="sticky top-0 z-30 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Blynter CMS
              </span>
              <span className="text-2xs text-blue-400/80 block uppercase tracking-widest font-mono">
                Admin Console
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition duration-200 border border-slate-700/60"
            >
              <Globe className="w-3.5 h-3.5" />
              View Site
            </a>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 mt-10 relative">
        
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1 */}
          <div className="relative overflow-hidden bg-[#0d1527] border border-slate-800/80 rounded-2xl p-6 shadow-md transition duration-300 hover:border-slate-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Blog Posts</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{blogs.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden bg-[#0d1527] border border-slate-800/80 rounded-2xl p-6 shadow-md transition duration-300 hover:border-slate-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Categories</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{Math.max(0, categories.length - 1)}</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Tag className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden bg-[#0d1527] border border-slate-800/80 rounded-2xl p-6 shadow-md transition duration-300 hover:border-slate-700">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Unique Authors</p>
                <h3 className="text-3xl font-bold mt-2 text-white">
                  {new Set(blogs.map((b) => b.author).filter(Boolean)).size}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>

        </div>

        {/* Content Controls & List Grid */}
        <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-6 shadow-xl">
          
          {/* Header, Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-6 border-b border-slate-800/60 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Blog Catalog</h2>
              <p className="text-xs text-slate-400 mt-1">Manage, search, edit, or delete database posts</p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#12192a] border border-slate-800 hover:border-slate-700/80 focus:border-blue-500 focus:outline-none rounded-xl py-2 pl-10 pr-4 text-xs placeholder:text-slate-500 transition duration-200"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#12192a] border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-4 text-xs font-semibold cursor-pointer text-slate-300 transition duration-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Blogs Data Display */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-xs font-mono">Connecting to database...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4 bg-red-500/5 rounded-2xl border border-red-500/10">
              <AlertCircle className="w-12 h-12 text-red-500/70 mx-auto mb-4" />
              <h4 className="text-sm font-semibold text-slate-200">Database Connection Failed</h4>
              <p className="text-xs text-red-400/80 max-w-md mx-auto mt-2 leading-relaxed font-mono">
                {error}
              </p>
              <button
                onClick={fetchBlogs}
                className="mt-6 px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h4 className="text-sm font-semibold text-slate-300">No blog posts found</h4>
              <p className="text-xs text-slate-400 mt-2">
                Try adjusting your search terms or create a new blog post.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 font-mono text-2xs uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Author</th>
                    <th className="pb-3 font-semibold">Slug</th>
                    <th className="pb-3 font-semibold">Date Created</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-xs">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-[#0e1628]/40 transition group">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          {blog.heroImage ? (
                            <img
                              src={blog.heroImage}
                              alt={blog.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700/60"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700/30 flex items-center justify-center text-slate-500 font-mono text-2xs">
                              NO IMG
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-slate-200 block group-hover:text-blue-400 transition">
                              {blog.title}
                            </span>
                            <span className="text-2xs text-slate-500 block mt-0.5 truncate max-w-[280px]">
                              {blog.content}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-300">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800/60 text-slate-400 text-2xs font-semibold border border-slate-700/30">
                          {blog.category || "General"}
                        </span>
                        {blog.subCategory && (
                          <span className="text-2xs text-slate-500 ml-2">/ {blog.subCategory}</span>
                        )}
                      </td>
                      <td className="py-4 text-slate-300 font-medium">
                        {blog.author || "Anonymous"}
                      </td>
                      <td className="py-4 text-slate-500 font-mono text-2xs truncate max-w-[120px]">
                        {blog.slug}
                      </td>
                      <td className="py-4 text-slate-400 font-mono text-2xs">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(blog)}
                            className="p-2 rounded-lg bg-slate-800/60 hover:bg-blue-600/10 text-slate-400 hover:text-blue-400 transition"
                            title="Edit Post"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 rounded-lg bg-slate-800/60 hover:bg-red-600/10 text-slate-400 hover:text-red-400 transition"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Beautiful Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070d]/80 backdrop-blur-sm animate-fade-in">
          
          <div className="relative bg-[#0b1120] border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                </h3>
                <p className="text-2xs text-slate-500 mt-1">
                  Fill in categories, content, SEO configurations, and questions.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800/50 bg-[#0e1628]/40 px-6">
              {[
                { id: "general", label: "General Content", icon: FileText },
                { id: "seo", label: "SEO Metadata", icon: Globe },
                { id: "faqs", label: "FAQs & Questions", icon: HelpCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Tabs Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: GENERAL */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Enter blog post title"
                        className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="auto-generated-from-title"
                        className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs font-mono placeholder:text-slate-600 transition"
                      />
                    </div>

                    {/* Author */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Author Name
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe, Blynter Team"
                        className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                      />
                    </div>

                    {/* Hero Image URL */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Hero Image URL
                      </label>
                      <input
                        type="url"
                        name="heroImage"
                        value={formData.heroImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g. Sports, Finance, Tech"
                        className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                      />
                    </div>

                    {/* Subcategory */}
                    <div className="space-y-1.5">
                      <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        placeholder="e.g. Cricket, Stocks, React"
                        className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                      />
                    </div>

                  </div>

                  {/* Content Editor Textarea */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Content / Body *
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Supports HTML and Raw Text</span>
                    </div>
                    <textarea
                      name="content"
                      required
                      rows={10}
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your article description or content here..."
                      className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-3 px-4 text-xs placeholder:text-slate-600 transition font-sans leading-relaxed"
                    />
                  </div>

                </div>
              )}

              {/* TAB 2: SEO METADATA */}
              {activeTab === "seo" && (
                <div className="space-y-5">
                  <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-blue-300">SEO Optimizations</h4>
                      <p className="text-2xs text-slate-400 mt-1 leading-relaxed">
                        Setting meta tags properly ensures search engines like Google can correctly index your content.
                      </p>
                    </div>
                  </div>

                  {/* Meta Title */}
                  <div className="space-y-1.5">
                    <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="Custom SEO Title"
                      className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleInputChange}
                      placeholder="comma, separated, tags"
                      className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-1.5">
                    <label className="text-2xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      rows={4}
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="Provide a search snippet summarizing the article content..."
                      className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2.5 px-3 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FAQS MANAGER */}
              {activeTab === "faqs" && (
                <div className="space-y-6">
                  
                  {/* Info Banner */}
                  <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-300">FAQ Schema Generation</h4>
                      <p className="text-2xs text-slate-400 mt-1 leading-relaxed">
                        Adding FAQs will generate JSON-LD structured data. This helps your search results feature Google rich snippets.
                      </p>
                    </div>
                  </div>

                  {/* Added FAQs List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">FAQ List ({formData.faqs.length})</h4>
                    {formData.faqs.length === 0 ? (
                      <p className="text-2xs text-slate-500 italic py-3 bg-[#0e1628]/20 border border-dashed border-slate-800 rounded-xl text-center">
                        No FAQs added yet. Use the fields below to add.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {formData.faqs.map((faq, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between p-3.5 bg-[#12192a] border border-slate-800 rounded-xl group"
                          >
                            <div className="space-y-1">
                              <span className="text-2xs font-bold text-blue-400 font-mono">Q. {faq.question}</span>
                              <p className="text-2xs text-slate-400 font-medium">A. {faq.answer}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFaq(index)}
                              className="p-1 rounded bg-slate-800/60 hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New FAQ Form Section */}
                  <div className="border-t border-slate-800/80 pt-4 space-y-3">
                    <h5 className="text-2xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                      Add FAQ Item
                    </h5>
                    <div className="space-y-3 p-4 bg-[#0e1628]/40 border border-slate-800/60 rounded-xl">
                      
                      <div className="space-y-1.5">
                        <label className="text-2xs text-slate-400 font-semibold">Question</label>
                        <input
                          type="text"
                          value={tempFaq.question}
                          onChange={(e) => setTempFaq({ ...tempFaq, question: e.target.value })}
                          placeholder="e.g. What is the match timing?"
                          className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-2xs text-slate-400 font-semibold">Answer</label>
                        <textarea
                          rows={2}
                          value={tempFaq.answer}
                          onChange={(e) => setTempFaq({ ...tempFaq, answer: e.target.value })}
                          placeholder="Provide the answer..."
                          className="w-full bg-[#12192a] border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl py-2 px-3 text-xs placeholder:text-slate-600 transition"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={addFaq}
                        className="flex items-center gap-1.5 text-2xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add FAQ to List
                      </button>

                    </div>
                  </div>

                </div>
              )}

            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800/80 bg-[#0e1628]/20 flex items-center justify-between">
              
              {/* Active Tab indicator */}
              <span className="text-2xs text-slate-500 font-mono">
                Tab: {activeTab === "general" ? "General Information" : activeTab === "seo" ? "SEO Metadata" : "FAQs Schema"}
              </span>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 min-w-[100px] px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 transition"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingBlog ? "Save Changes" : "Publish Post"}
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
