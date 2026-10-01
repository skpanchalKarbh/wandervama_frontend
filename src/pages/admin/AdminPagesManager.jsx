import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RichTextEditor from "../../components/admin/RichTextEditor";
import AdminSidebar from "../../components/admin/AdminSidebar";
import SEO from "../../components/SEO";
import { API_BASE_URL } from "../../config/api";
import resolveImageUrl from "../../utils/resolveImageUrl";

const defaultPageForm = {
  title: "",
  slug: "",
  content: "",
  featuredImage: "",
  featuredImageAlt: "",
  metaTitle: "",
  metaDescription: "",
  schemaMarkup: "",
  status: "published",
};

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminPagesManager() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "form"
  const [editingPageId, setEditingPageId] = useState(null);
  const [form, setForm] = useState(defaultPageForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchPages = () => {
    fetch(`${API_BASE_URL}/api/pages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPages(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToList = () => {
    setView("list");
    setEditingPageId(null);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const openAddForm = () => {
    setEditingPageId(null);
    setForm(defaultPageForm);
    setErrorMsg("");
    setSuccessMsg("");
    setView("form");
  };

  const openEditForm = (page) => {
    setEditingPageId(page.id);
    setForm({
      title: page.title || "",
      slug: page.slug || "",
      content: page.content || "",
      featuredImage: page.featured_image || "",
      featuredImageAlt: page.featured_image_alt || "",
      metaTitle: page.meta_title || "",
      metaDescription: page.meta_description || "",
      schemaMarkup: page.schema_markup || "",
      status: page.status || "published",
    });
    setErrorMsg("");
    setSuccessMsg("");
    setView("form");
  };

  const openDuplicateForm = (page) => {
    setEditingPageId(null); // duplicating always creates a NEW page
    setForm({
      title: `Copy of ${page.title || ""}`,
      slug: `${page.slug || slugify(page.title)}-copy`,
      content: page.content || "",
      featuredImage: page.featured_image || "",
      featuredImageAlt: page.featured_image_alt || "",
      metaTitle: page.meta_title || "",
      metaDescription: page.meta_description || "",
      schemaMarkup: page.schema_markup || "",
      status: "draft", // duplicates start as draft so they don't go live by accident
    });
    setErrorMsg("");
    setSuccessMsg("");
    setView("form");
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForm((prev) => ({ ...prev, featuredImage: data.url }));
      } else {
        setForm((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
      }
    } catch (err) {
      setForm((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const url = editingPageId ? `${API_BASE_URL}/api/pages/${editingPageId}` : `${API_BASE_URL}/api/pages`;
      const res = await fetch(url, {
        method: editingPageId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchPages();
        setSuccessMsg(editingPageId ? "Page updated successfully." : "Page created successfully.");
        // Stay on this form; if it was a new page, switch into edit mode for
        // the page that was just created so a second Save updates it
        // instead of creating a duplicate.
        if (!editingPageId && data.data?.id) {
          setEditingPageId(data.data.id);
        }
      } else {
        setErrorMsg(data.message || "Error saving page");
      }
    } catch (err) {
      setErrorMsg("Network error while saving page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchPages();
      } else {
        alert(data.message || "Error deleting page");
      }
    } catch (err) {
      alert("Network error while deleting page");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
    <SEO title="Pages" noindex />
    <div className="admin-dashboard-root" style={{ display: "flex", minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <AdminSidebar
        activeTab="pages"
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      <main style={{ flexGrow: 1, minWidth: 0 }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-between flex-wrap gap-3"
          style={{ maxWidth: "1040px", margin: "0 auto", padding: "16px 24px" }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-light btn-sm d-lg-none"
              style={{ borderRadius: "8px", fontWeight: "600" }}
            >
              ☰
            </button>
            <button
              type="button"
              onClick={() => (view === "form" ? goToList() : navigate("/admin"))}
              className="btn btn-light btn-sm"
              style={{ borderRadius: "8px", fontWeight: "600" }}
            >
              ← Back
            </button>
            <div>
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {view === "list" ? "📄 Pages" : editingPageId ? "✏️ Edit Page" : "➕ Add New Page"}
              </h4>
              <div style={{ fontSize: "12.5px", color: "#64748B" }}>
                {view === "list" ? "Custom pages, served at /<slug> on the public site" : "Fill in the details and save"}
              </div>
            </div>
          </div>
          {view === "list" ? (
            <button type="button" onClick={openAddForm} className="btn btn-primary" style={{ borderRadius: "8px", fontWeight: "600", padding: "8px 20px" }}>
              + Add Page
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button type="button" onClick={goToList} className="btn btn-light" style={{ borderRadius: "8px", fontWeight: "600" }}>
                Cancel
              </button>
              <button type="submit" form="page-form" disabled={saving} className="btn btn-primary" style={{ borderRadius: "8px", fontWeight: "600", padding: "8px 24px" }}>
                {saving ? "Saving..." : editingPageId ? "💾 Update Page" : "💾 Save Page"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "28px 24px 60px" }}>
        {view === "list" ? (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            {loading ? (
              <p className="text-muted text-center py-4 mb-0">Loading pages...</p>
            ) : pages.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No custom pages yet. Click "+ Add Page" to create one.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {pages.map((page) => (
                  <div key={page.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 border bg-light">
                    <div className="text-truncate me-3">
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ color: "#0F172A" }}>{page.title}</strong>
                        <span className={`badge ${page.status === "published" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`} style={{ fontSize: "10.5px" }}>
                          {page.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <small className="text-muted">/{page.slug}</small>
                    </div>
                    <div className="d-flex gap-2 flex-shrink-0">
                      <button type="button" onClick={() => openEditForm(page)} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: "6px" }}>
                        ✏️ Edit
                      </button>
                      <button type="button" onClick={() => openDuplicateForm(page)} className="btn btn-sm btn-outline-primary" style={{ borderRadius: "6px" }}>
                        📄 Duplicate
                      </button>
                      <button type="button" onClick={() => handleDelete(page.id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: "6px" }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form id="page-form" onSubmit={handleSubmit}>
            {errorMsg && <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">{errorMsg}</div>}
            {successMsg && <div className="alert alert-success py-2 px-3 small rounded-3 mb-3">✅ {successMsg}</div>}

            <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-600">Page Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Careers"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-600">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (hidden from site)</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">URL Slug</label>
                  <div className="input-group">
                    <span className="input-group-text">/</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="auto-generated from title"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>
                  <small className="text-muted">This page will be live at wanderama.in/{form.slug || slugify(form.title) || "your-slug"}</small>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
              <label className="form-label small fw-600 mb-2 d-block">Featured Image (optional)</label>
              <div className="row g-3">
                <div className="col-md-7">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-2"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) handleImageUpload(e.target.files[0]);
                    }}
                  />
                  {uploadingImage && <div className="text-info micro mb-2">⏳ Uploading...</div>}
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="or paste image URL"
                    value={form.featuredImage}
                    onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  />
                  <label className="form-label micro text-muted fw-600 mb-1">Alt Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Describe this image"
                    value={form.featuredImageAlt}
                    onChange={(e) => setForm({ ...form, featuredImageAlt: e.target.value })}
                  />
                </div>
                <div className="col-md-5">
                  {form.featuredImage && (
                    <div style={{ height: "120px", borderRadius: "8px", overflow: "hidden", border: "1px solid #CBD5E1" }}>
                      <img
                        src={resolveImageUrl(form.featuredImage)}
                        alt={form.featuredImageAlt || "Preview"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
              <label className="form-label small fw-600 mb-2 d-block">Page Content</label>
              <RichTextEditor
                rows={14}
                placeholder="Write the page content here..."
                value={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />
            </div>

            <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
              <h6 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>🔍 SEO (optional — leave blank to auto-generate)</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-600">Meta Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={form.title || "Meta title"}
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    maxLength={70}
                  />
                  <small className="text-muted">{(form.metaTitle || "").length}/70</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Meta Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Short description shown in Google search results"
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    maxLength={200}
                  />
                  <small className="text-muted">{(form.metaDescription || "").length}/200</small>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Schema Markup (JSON-LD, optional)</label>
                  <div className="small text-muted mb-1">
                    Advanced: paste valid Schema.org JSON-LD here. Leave blank if unsure — it never overwrites the page's automatic SEO data.
                  </div>
                  <textarea
                    className="form-control"
                    rows={4}
                    style={{ fontFamily: "monospace", fontSize: "12px" }}
                    value={form.schemaMarkup || ""}
                    onChange={(e) => setForm({ ...form, schemaMarkup: e.target.value })}
                    placeholder='{"@context":"https://schema.org","@type":"WebPage",...}'
                  />
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" onClick={goToList} className="btn btn-light" style={{ borderRadius: "8px" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 24px" }}>
                {saving ? "Saving..." : editingPageId ? "💾 Update Page" : "💾 Save Page"}
              </button>
            </div>
          </form>
        )}
      </div>
      </main>
    </div>
    </>
  );
}
