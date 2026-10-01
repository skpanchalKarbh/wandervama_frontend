import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import { API_BASE_URL } from "../config/api";

// Section metadata (labels/copy) for each gallery category. The actual images
// and videos inside every section are fetched live from the backend.
const categoryMeta = [
  {
    id: "property",
    subTag: "EXPLORE PROPERTY",
    fancybox: "gallery-property",
    title: "Property Photographs",
    text: "A first look at our hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh.",
  },
  {
    id: "rooms",
    subTag: "ACCOMMODATIONS",
    fancybox: "gallery-rooms",
    title: "Rooms & Stays",
    text: "Comfortable, well-appointed rooms and suites designed for a relaxing stay.",
  },
  {
    id: "facilities",
    subTag: "RESORT AMENITIES",
    fancybox: "gallery-facilities",
    title: "Resort Facilities",
    text: "Pools, lawns, lounges and amenities that make every Wanderama property feel like a getaway.",
  },
  {
    id: "food",
    subTag: "CULINARY DELIGHTS",
    fancybox: "gallery-food",
    title: "Food & Dining",
    text: "Multi-cuisine dining, local flavours and al-fresco meals across our properties.",
  },
  {
    id: "events",
    subTag: "CELEBRATIONS",
    fancybox: "gallery-events",
    title: "Events & Celebrations",
    text: "Weddings, get-togethers and celebrations hosted at our resorts and villas.",
  },
  {
    id: "activities",
    subTag: "EXPERIENCES",
    fancybox: "gallery-activities",
    title: "Activities & Adventure",
    text: "Outdoor adventure, recreation and guided experiences for every kind of traveller.",
  },
  {
    id: "destinations",
    subTag: "SCENIC LOCATIONS",
    fancybox: "gallery-destinations",
    title: "Destination Highlights",
    text: "The landscapes and destinations surrounding our properties, from lakes to forts to coastlines.",
  },
];

const resolveGalleryUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return url;
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

const chunkImages = (images, size) => {
  const chunks = [];
  for (let i = 0; i < images.length; i += size) {
    chunks.push(images.slice(i, i + size));
  }
  return chunks;
};

const getVideoThumbnail = (video) => {
  if (video.poster_url) return resolveGalleryUrl(video.poster_url);
  const embed = getYouTubeEmbedUrl(video.url);
  if (embed) {
    const videoId = embed.split("/embed/")[1];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return "/assets/img/slider/hero-bg.jpg";
};

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeVideo, setActiveVideo] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const seo = usePageSeo("gallery", {
    title: "Photo & Video Gallery",
    description: "Explore photos and videos from Wanderama's hotels, resorts and villas — rooms, facilities, dining, events and the destinations surrounding each property.",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGalleryItems(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const whatsappNumber = (settings?.whatsapp_number || "910000000000").replace(/[^0-9]/g, "");

  const categories = categoryMeta.map((cat) => ({
    ...cat,
    images: galleryItems.filter((item) => item.category === cat.id && item.type === "image"),
  }));

  const videos = galleryItems.filter((item) => item.category === "videos" && item.type === "video");

  const filterTabs = [
    { id: "all", label: "All Showcase" },
    { id: "property", label: "Properties" },
    { id: "rooms", label: "Rooms & Stays" },
    { id: "facilities", label: "Facilities" },
    { id: "food", label: "Food & Dining" },
    { id: "events", label: "Events" },
    { id: "activities", label: "Activities" },
    { id: "destinations", label: "Destinations" },
    { id: "videos", label: "Videos" },
  ];

  const nonEmptyCategories = categories.filter((c) => c.images.length > 0);

  const visibleCategories = activeTab === "all" || activeTab === "videos"
    ? nonEmptyCategories
    : nonEmptyCategories.filter((c) => c.id === activeTab);

  const showVideos = (activeTab === "all" || activeTab === "videos") && videos.length > 0;

  const renderGalleryCard = (img, cat) => (
    <a
      href={resolveGalleryUrl(img.url)}
      data-fancybox={cat.fancybox}
      className="luxury-gallery-card hover-on-image"
      aria-label={`${cat.title} image`}
    >
      <div className="gallery-img-wrap">
        <img
          src={resolveGalleryUrl(img.url)}
          width="480"
          height="480"
          loading="lazy" decoding="async"
          alt={img.title || `Wanderama ${cat.title}`}
          className="gallery-card-img"
        />
        <div className="gallery-card-overlay">
          <div className="gallery-zoom-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <span className="gallery-cat-badge">{cat.title.split(" ")[0]}</span>
        </div>
      </div>
    </a>
  );

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />
      <PageBanner title="Visual Gallery" current="Gallery" />

      {/* Interactive Filter Navigation */}
      <div className="gallery-filter-navigation mt-60 mb-60">
        <div className="container text-center">
          <div className="gallery-filter-pills d-inline-flex flex-wrap justify-content-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`gallery-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {/* Section-Wise Image Galleries */}
      {!loading && visibleCategories.map((cat, catIndex) => (
        <div className={`luxury-gallery-section ${catIndex % 2 === 0 ? "home-band-cream" : "home-band-white"} ${catIndex === 0 ? "mt-20" : "mt-100"}`} key={cat.id}>
          <div className="container">
            <div className="section-headings headings-width text-center mb-40">
              <div className="section-sub-tag text-center" data-aos="fade-up">
                {cat.subTag}
              </div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                {cat.title}
              </h2>
              <p className="section-body-text text-center mx-auto" style={{ maxWidth: "660px" }} data-aos="fade-up" data-aos-delay="60">
                {cat.text}
              </p>
            </div>
            {chunkImages(cat.images, 5).map((group, groupIndex) =>
              group.length === 5 ? (
                <div className="home-gallery-grid mb-4" key={`${cat.id}-group-${groupIndex}`}>
                  {group.map((img, i) => (
                    <div
                      className={`home-gallery-item${i === 0 ? " home-gallery-item-large" : ""}`}
                      data-aos="fade-up"
                      data-aos-delay={i * 30}
                      key={img.id}
                    >
                      {renderGalleryCard(img, cat)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row grid-gap" key={`${cat.id}-group-${groupIndex}`}>
                  {group.map((img, i) => (
                    <div className="col-lg-3 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay={i * 30} key={img.id}>
                      {renderGalleryCard(img, cat)}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      ))}

      {/* Section-Wise Video Gallery */}
      {showVideos && (
        <div className="luxury-video-gallery-section home-band-cream mt-100 mb-100">
          <div className="container">
            <div className="section-headings headings-width text-center mb-40">
              <div className="section-sub-tag text-center" style={{ color: "#D9A752" }} data-aos="fade-up">
                CINEMATIC TOURS
              </div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                Video Gallery
              </h2>
              <p className="section-body-text text-center mx-auto" style={{ maxWidth: "660px" }} data-aos="fade-up" data-aos-delay="60">
                Promotional films, property walkthroughs and resort experience videos captured across our destinations.
              </p>
            </div>
            <div className="row grid-gap">
              {videos.map((v, i) => (
                <div className="col-lg-4 col-md-6 col-12 mb-4" data-aos="fade-up" data-aos-delay={i * 50} key={v.id}>
                  <div className="luxury-video-card">
                    <div className="video-poster-wrap">
                      <img
                        src={getVideoThumbnail(v)}
                        width="640"
                        height="400"
                        loading="lazy" decoding="async"
                        alt={v.title}
                        className="video-poster-img"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/slider/hero-bg.jpg"; }}
                      />
                      <div className="video-poster-overlay"></div>
                      <button
                        type="button"
                        className="luxury-play-btn"
                        onClick={() => setActiveVideo(v)}
                        aria-label={`Play ${v.title}`}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </button>
                    </div>
                    <div className="video-card-body">
                      <h3 className="video-card-title">{v.title}</h3>
                      <p className="video-card-caption" dangerouslySetInnerHTML={{ __html: v.caption }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <div className="luxury-video-modal-backdrop" onClick={() => setActiveVideo(null)}>
          <div className="luxury-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="luxury-video-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close Video"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <div className="ratio ratio-16x9">
              {getYouTubeEmbedUrl(activeVideo.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.url)}
                  title={activeVideo.title || "Video"}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-100 h-100 rounded-3"
                  style={{ border: "none" }}
                ></iframe>
              ) : (
                <video controls autoPlay className="w-100 h-100 rounded-3">
                  <source src={resolveGalleryUrl(activeVideo.url)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Closing CTA */}
      <div className="luxury-cta-section mt-100 mb-100">
        <div className="container">
          <div className="luxury-cta-banner radius24 text-center">
            <div className="section-sub-tag text-center" style={{ color: "#D9A752" }} data-aos="fade-up">
              START YOUR JOURNEY
            </div>
            <h2 className="heading section-main-title text-center" style={{ color: "#10372B" }} data-aos="fade-up" data-aos-delay="30">
              Ready To See It In Person?
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "660px", color: "#4A5568" }} data-aos="fade-up" data-aos-delay="60">
              Explore our properties in detail or get in touch for personalised recommendations.
            </p>
            <div className="cta-buttons-wrapper justify-content-center mt-35" data-aos="fade-up" data-aos-delay="100">
              <Link to="/properties" className="btn-hero-primary" aria-label="View Our Properties">
                <span>View Our Properties</span>
                <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-luxury"
                aria-label="Chat on WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
