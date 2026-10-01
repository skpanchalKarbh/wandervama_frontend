import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";
import { stripHtml } from "../utils/richText";
import { API_BASE_URL, SITE_URL } from "../config/api";

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
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const calculateReadTime = (htmlContent) => {
  if (!htmlContent) return "2 min read";
  const cleanText = htmlContent.replace(/<[^>]+>/g, " ");
  const wordCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

// Title Case formatter for cleaner display (e.g., "one DAY PICNIC" -> "One Day Picnic")
const formatTitle = (str) => {
  if (!str) return "";
  // Check if title is ALL CAPS or weird mixed case
  const isWeirdCase = str === str.toUpperCase() || /^[a-z]/.test(str) || /\b[A-Z]{3,}\b/.test(str);
  if (!isWeirdCase) return str;

  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v\.?|vs\.?|via)$/i;
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, index, array) => {
      if (index > 0 && index < array.length - 1 && smallWords.test(word)) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [tocMobileOpen, setTocMobileOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/blog/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPost(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${API_BASE_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setOtherPosts(data.data);
      })
      .catch(() => {});
  }, [slug]);

  const { contentHtml, tocItems } = useMemo(() => {
    if (!post?.content) return { contentHtml: "", tocItems: [] };
    if (typeof DOMParser === "undefined") return { contentHtml: post.content, tocItems: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    const autoItems = [];
    const usedIds = new Set();
    const byNormalizedText = new Map();

    headings.forEach((heading, idx) => {
      const text = heading.textContent.trim();
      if (!text) return;
      const baseId =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") || `section-${idx}`;
      let id = baseId;
      let suffix = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${suffix++}`;
      }
      usedIds.add(id);
      heading.id = id;
      const level = heading.tagName.toLowerCase();
      autoItems.push({ id, text, level });
      byNormalizedText.set(text.toLowerCase(), { id, level });
    });

    const manualItems = Array.isArray(post.toc_items)
      ? post.toc_items
          .filter((item) => item && item.label && item.label.trim())
          .map((item) => {
            const match = byNormalizedText.get((item.heading || "").trim().toLowerCase());
            return {
              id: match ? match.id : null,
              text: item.label.trim(),
              description: (item.description || "").trim(),
              level: match ? match.level : "h2",
            };
          })
      : [];

    return {
      contentHtml: doc.body.innerHTML,
      tocItems: manualItems.length > 0 ? manualItems : autoItems,
    };
  }, [post?.content, post?.toc_items]);

  const handleTocClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "65vh" }}>
        <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem", color: "#10372B" }}>
          <span className="visually-hidden">Loading story...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <SEO title="Article Not Found" noindex />
        <PageBanner title="Blog" current="Not Found" />
        <div className="container text-center py-5 my-5">
          <div className="p-5 bg-white rounded-24 shadow-sm border mx-auto" style={{ maxWidth: "560px" }}>
            <h2 className="heading text-32 fw-700 text-dark mb-3">Article Not Found</h2>
            <p className="text-secondary mb-4">The travel guide or story you are looking for does not exist or may have been updated.</p>
            <Link to="/blog" className="btn-hero-primary d-inline-flex align-items-center gap-2">
              <span>← Back to All Articles</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const related = otherPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const authorName = post.author || "Wanderama Team";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const formattedTitle = formatTitle(post.title);
  const shareUrl = `${SITE_URL}/blog/${post.slug}`;

  const sidebarCta = {
    title: post.cta_title || "Ready to Plan Your Stay?",
    description:
      post.cta_description ||
      "Explore Wanderama's luxury resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh.",
    buttonText: post.cta_button_text || "Explore Wanderama Resorts",
    buttonLink: post.cta_button_link || "/properties",
  };

  let customSchema = null;
  if (post.schema_markup) {
    try {
      customSchema = JSON.parse(post.schema_markup);
    } catch (e) {
      customSchema = null;
    }
  }

  return (
    <>
      <SEO
        title={post.meta_title || formattedTitle}
        description={post.meta_description || stripHtml(post.excerpt) || `${formattedTitle} — a travel and hospitality story from Wanderama.`}
        image={post.featured_image}
        customSchema={customSchema}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: formattedTitle,
          image: post.featured_image ? [resolveImageUrl(post.featured_image)] : undefined,
          author: { "@type": "Organization", name: authorName },
          publisher: { "@type": "Organization", name: "Wanderama Hospitality LLP" },
          datePublished: post.created_at,
          dateModified: post.updated_at,
          mainEntityOfPage: shareUrl,
        }}
      />

      <div className="blog-details-section">
        {/* Hero: title + author/meta on the left, featured image on the right */}
        <section className="blog-hero">
          <div className="blog-hero-inner">
            <div className="blog-hero-text">
                  {/* Breadcrumb Navigation */}
                  <nav className="blog-breadcrumbs" aria-label="breadcrumb" >
                    <ol>
                      <li><Link to="/">Home</Link></li>
                      <li className="bc-sep">/</li>
                      <li><Link to="/blog">Blog</Link></li>
                      <li className="bc-sep">/</li>
                      <li className="bc-current">{post.category || "Travel & Hospitality"}</li>
                    </ol>
                  </nav>

              <h1 className="blog-hero-title" data-aos="fade-up">
                {formattedTitle}
              </h1>

                  {/* Author & Publication Metadata Bar */}
                  <div className="blog-meta-bar" data-aos="fade-up" data-aos-delay="80">
                    <div className="meta-author-group">
                      <div className="author-avatar">{authorInitial}</div>
                      <div className="author-text">
                        <span className="author-name">{authorName}</span>
                        <span className="author-role">Wanderama Editorial</span>
                      </div>
                    </div>

                    <div className="meta-info-group">
                      <div className="meta-item">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{formatDate(post.created_at)}</span>
                      </div>

                      <div className="meta-dot"></div>

                      <div className="meta-item">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{calculateReadTime(post.content)}</span>
                      </div>

                      <div className="meta-dot"></div>

                      <span className="verified-story-tag">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Verified Story
                      </span>
                    </div>
                  </div>
            </div>

            <div className="blog-hero-media" data-aos="fade-up" data-aos-delay="100">
              <img
                src={resolveImageUrl(post.featured_image)}
                alt={post.featured_image_alt || formattedTitle}
                width="1200"
                height="675"
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/img/blog/1.jpg";
                }}
              />
            </div>
          </div>
        </section>

        <div className={`blog-details-layout-wrapper${tocItems.length > 0 ? "" : " no-left-sidebar"}`}>
          {/* Left Sidebar (Table of Contents) */}
          {tocItems.length > 0 && (
            <aside className="blog-details-left-sidebar">
              <div className="sidebar-sticky-inner">
              {/* Table of Contents Widget */}
                <div className="sidebar-widget sidebar-toc-widget" data-aos="fade-up">
                  <button
                    type="button"
                    className="toc-widget-header toc-widget-toggle"
                    onClick={() => setTocMobileOpen((open) => !open)}
                    aria-expanded={tocMobileOpen}
                  >
                    <div className="toc-header-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      <span>Table of Contents</span>
                    </div>
                    <div className="toc-header-right">
                      <span className="toc-count-badge">{tocItems.length}</span>
                      <span className="toc-expand-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </button>

                  <nav className={`toc-nav-list${tocMobileOpen ? " is-open" : ""}`}>
                    <ul>
                      {tocItems.map((item, idx) => {
                        let displayTitle = item.text || "";
                        let displayDesc = item.description || "";

                        if (displayDesc && displayTitle.endsWith(displayDesc)) {
                          displayTitle = displayTitle.slice(0, -displayDesc.length).trim();
                        }

                        return (
                          <li
                            key={item.id || `toc-${idx}`}
                            className={`toc-nav-item ${item.level === "h3" ? "toc-item-sub" : ""}`}
                          >
                            <a href={item.id ? `#${item.id}` : "#"} onClick={(e) => handleTocClick(e, item.id)}>
                              <span className="toc-number">{idx + 1}.</span>
                              <div className="toc-text-wrap">
                                <span className="toc-title">{displayTitle}</span>
                                {displayDesc && (
                                  <span className="toc-desc" dangerouslySetInnerHTML={{ __html: displayDesc }} />
                                )}
                              </div>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </div>
            </aside>
          )}

          {/* Main Article Content (Center Column) */}
          <main className="blog-details-main-content">
            {/* Category Badge & Main Title */}
            <div className="blog-header-box" data-aos="fade-up">
              <span className="blog-category-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                {post.category || "Travel & Hospitality"}
              </span>


              {post.excerpt && (
                <p className="blog-main-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              )}
            </div>

            {/* Article Content */}
            <div
              className="blog-rich-content"
              dangerouslySetInnerHTML={{ __html: contentHtml || post.content || "" }}
              data-aos="fade-up"
              data-aos-delay="120"
            />

            {/* Article Footer & Author Spotlight */}
            <div className="blog-article-footer" data-aos="fade-up">
              {/* Author Spotlight Box */}
              <div className="blog-author-card">
                <div className="author-card-avatar">{authorInitial}</div>
                <div className="author-card-content">
                  <h4>{authorName}</h4>
                  <span className="author-card-subtitle">Wanderama Editorial & Content Team</span>
                  <p>
                    Curating authentic stay guides, wildlife safari tips, and regional travel itineraries across Gujarat, Maharashtra, Rajasthan, and Madhya Pradesh.
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar (CTA, Contact Widgets) */}
          <aside className="blog-details-sidebar blog-details-right-sidebar">
            <div className="sidebar-sticky-inner">
              {/* CTA Widget */}
              <div className="sidebar-widget sidebar-cta-widget" data-aos="fade-up">
                <div className="cta-icon-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className="cta-heading">{sidebarCta.title}</h3>
                <p className="cta-subtext" dangerouslySetInnerHTML={{ __html: sidebarCta.description }} />
                <Link to={sidebarCta.buttonLink} className="cta-action-btn">
                  <span>{sidebarCta.buttonText}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {/* Instant Assistance Widget (Need Help Booking?) */}
              <div className="sidebar-widget sidebar-contact-widget" data-aos="fade-up" data-aos-delay="40">
                <h4 className="widget-title">Need Help Booking?</h4>
                <p className="widget-desc">Speak with our Wanderama reservations desk for instant resort bookings and group packages.</p>
                <div className="contact-actions">
                  <a href="tel:+910000000000" className="contact-btn phone-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>Call Desk</span>
                  </a>
                  <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.16 4.237 4.29-1.127z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQs (admin-managed) */}
        {Array.isArray(post.faqs) && post.faqs.length > 0 && (
          <div className="container mt-100 mb-50">
            <div className="property-faqs-header text-center">
              <div className="property-amenities-eyebrow mb-2">FAQs</div>
              <h2 className="property-faqs-heading text-center">Frequently Asked Questions</h2>
            </div>

            <div className="property-faqs-list" style={{ maxWidth: "820px", margin: "0 auto" }}>
              {post.faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div className={`property-faq-item ${isOpen ? "is-open" : ""}`} key={i}>
                    <button
                      type="button"
                      className="property-faq-question"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <span className="property-faq-toggle">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={isOpen ? "property-faq-toggle-vline is-hidden" : "property-faq-toggle-vline"} />
                          <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && <div className="property-faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        {related.length > 0 && (
          <section className="blog-related-section">
            <div className="container">
              <div className="section-headings text-center mb-45">
                <div className="section-sub-tag text-center" data-aos="fade-up">MORE STORIES</div>
                <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                  You May Also Like
                </h2>
              </div>
              <div className="row grid-gap justify-content-center">
                {related.map((p, idx) => (
                  <div className="col-lg-4 col-md-6 col-12" key={p.id || p.slug} data-aos="fade-up" data-aos-delay={idx * 60}>
                    <BlogCard post={p} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

