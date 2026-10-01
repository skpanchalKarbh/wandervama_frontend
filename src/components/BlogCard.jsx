import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const resolveImageUrl = (url) => {
  if (!url) return "/assets/img/blog/1.jpg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return url;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// Mirrors PropertyCard's "luxury-property-card" visual style so blog posts
// and properties share the same card design language across the site.
export default function BlogCard({ post }) {
  if (!post) return null;

  return (
    <Link to={`/blog/${post.slug}`} className="luxury-property-card" aria-label={post.title}>
      <div className="property-card-image-wrap">
        <img
          src={resolveImageUrl(post.featured_image)}
          width="734"
          height="534"
          loading="lazy" decoding="async"
          alt={post.featured_image_alt || post.title}
          className="property-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/img/blog/1.jpg";
          }}
        />
        <span className="property-card-type-badge">Blog</span>
        <span className="property-card-rating-badge">{formatDate(post.created_at)}</span>
      </div>
      <div className="property-card-content">
        <div className="property-card-location">
          <svg className="location-pin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{post.author || "Wanderama Team"}</span>
        </div>
        <h3 className="property-card-title">{post.title}</h3>
        <div className="property-card-tagline" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <div className="property-card-footer">
          <span className="property-card-btn">
            <span>Read More</span>
            <svg className="card-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
