import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import PropertyCard from "../components/PropertyCard";
import BlogCard from "../components/BlogCard";
import EnquiryForm from "../components/EnquiryForm";
import LazyVideo from "../components/LazyVideo";
import StarRating from "../components/StarRating";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import useDragAutoScroll from "../hooks/useDragAutoScroll";
import { API_BASE_URL, SITE_URL } from "../config/api";

const videoList = [
  {
    id: 1,
    title: "Resort & Poolside Tour",
    subtitle: "Experience luxury living in Sasan Gir & Patdi",
    thumb: "/assets/img/destination/1.jpg",
    videoUrl: "/assets/img/video/video.mp4",
    duration: "02:15",
    tag: "Resort Life"
  },
  {
    id: 2,
    title: "Fine Dining & Cuisine",
    subtitle: "Multi-cuisine regional thalis & poolside dining",
    thumb: "/assets/img/destination/2.jpg",
    videoUrl: "/assets/img/video/video-2.mp4",
    duration: "01:45",
    tag: "Dining"
  },
  {
    id: 3,
    title: "Luxury Villas & Suites",
    subtitle: "Spacious rooms built for restful retreats",
    thumb: "/assets/img/destination/3.jpg",
    videoUrl: "/assets/img/video/video-3.mp4",
    duration: "01:30",
    tag: "Villas"
  }
];

const resolveImageUrl = (pathStr) => {
  if (!pathStr) return "/assets/img/slider/hero-bg.jpg";
  if (pathStr.startsWith("http://") || pathStr.startsWith("https://") || pathStr.startsWith("blob:")) {
    // Auto-upgrade CDN width & quality parameters for crisp Full HD rendering
    let enhancedUrl = pathStr
      .replace(/([?&])w=\d+/gi, "$1w=1920")
      .replace(/([?&])width=\d+/gi, "$1width=1920")
      .replace(/([?&])q=\d+/gi, "$1q=95");
    return enhancedUrl;
  }
  if (pathStr.startsWith("/uploads/") || pathStr.startsWith("uploads/")) {
    const cleanPath = pathStr.startsWith("/") ? pathStr : `/${pathStr}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return pathStr;
};

const galleryCategories = [
  {
    id: "property",
    subTag: "EXPLORE PROPERTY",
    title: "Property Photographs",
    text: "A first look at our hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh.",
    fallbackImages: [
      "/assets/img/image-grid/1.jpg",
      "/assets/img/image-grid/2.jpg",
      "/assets/img/image-grid/3.jpg",
      "/assets/img/image-grid/4.jpg",
      "/assets/img/image-grid/5.jpg",
    ],
  },
  {
    id: "rooms",
    subTag: "ACCOMMODATIONS",
    title: "Rooms & Stays",
    text: "Comfortable, well-appointed rooms and suites designed for a relaxing stay.",
    fallbackImages: [
      "/assets/img/product/1.jpg",
      "/assets/img/product/2.jpg",
      "/assets/img/product/3.jpg",
      "/assets/img/product/4.jpg",
      "/assets/img/product/5.jpg",
    ],
  },
  {
    id: "facilities",
    subTag: "RESORT AMENITIES",
    title: "Resort Facilities",
    text: "Pools, lawns, lounges and amenities that make every Wanderama property feel like a getaway.",
    fallbackImages: [
      "/assets/img/product/9.jpg",
      "/assets/img/product/10.jpg",
      "/assets/img/product/11.jpg",
      "/assets/img/product/12.jpg",
      "/assets/img/product/13.jpg",
    ],
  },
  {
    id: "food",
    subTag: "CULINARY DELIGHTS",
    title: "Food & Dining",
    text: "Multi-cuisine dining, local flavours and al-fresco meals across our properties.",
    fallbackImages: [
      "/assets/img/promotional/1.jpg",
      "/assets/img/promotional/2.jpg",
      "/assets/img/promotional/3.jpg",
      "/assets/img/promotional/4.jpg",
      "/assets/img/promotional/1.jpg",
    ],
  },
  {
    id: "events",
    subTag: "CELEBRATIONS",
    title: "Events & Celebrations",
    text: "Weddings, get-togethers and celebrations hosted at our resorts and villas.",
    fallbackImages: [
      "/assets/img/image-grid/6.jpg",
      "/assets/img/image-grid/7.jpg",
      "/assets/img/image-grid/8.jpg",
      "/assets/img/image-grid/9.jpg",
      "/assets/img/image-grid/10.jpg",
    ],
  },
  {
    id: "activities",
    subTag: "EXPERIENCES",
    title: "Activities & Adventure",
    text: "Outdoor adventure, recreation and guided experiences for every kind of traveller.",
    fallbackImages: [
      "/assets/img/destination/sm-1.jpg",
      "/assets/img/destination/sm-2.jpg",
      "/assets/img/destination/sm-3.jpg",
      "/assets/img/destination/sm-4.jpg",
      "/assets/img/destination/sm-5.jpg",
    ],
  },
  {
    id: "destinations",
    subTag: "SCENIC LOCATIONS",
    title: "Destination Highlights",
    text: "The landscapes and destinations surrounding our properties, from lakes to forts to coastlines.",
    fallbackImages: [
      "/assets/img/destination/1.jpg",
      "/assets/img/destination/2.jpg",
      "/assets/img/destination/3.jpg",
      "/assets/img/destination/4.jpg",
      "/assets/img/destination/5.jpg",
    ],
  },
];

// "9+ | Years of Experience" splits explicitly on "|"; plain text is auto-split around its number token.
function splitTrustFeature(text) {
  const raw = String(text || "").trim();
  if (raw.includes("|")) {
    const [value, ...rest] = raw.split("|");
    return { value: value.trim(), label: rest.join("|").trim() };
  }
  const words = raw.split(/\s+/);
  const numIdx = words.findIndex((w) => /\d/.test(w));
  const idx = numIdx === -1 ? 0 : numIdx;
  return { value: words[idx] || raw, label: words.filter((_, i) => i !== idx).join(" ") };
}

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(null);

  const [heroSlides, setHeroSlides] = useState([]);

  const [propertiesList, setPropertiesList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [about, setAbout] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [settings, setSettings] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryCategoryIndex, setGalleryCategoryIndex] = useState(0);
  const [isGalleryChanging, setIsGalleryChanging] = useState(false);

  const introTextRef = useRef(null);
  const introColRef = useRef(null);
  const [introExpanded, setIntroExpanded] = useState(false);
  const [introOverflowing, setIntroOverflowing] = useState(false);
  const [introColHeight, setIntroColHeight] = useState(null);

  // The text column's natural height (title + clamped text + features + CTA)
  // drives the image height, so the photo always matches the text block.
  useEffect(() => {
    if (!introColRef.current) return;

    const syncHeight = () => {
      const colHeight = introColRef.current?.offsetHeight;
      if (colHeight) setIntroColHeight(colHeight);
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(introColRef.current);
    return () => resizeObserver.disconnect();
  }, [about, introExpanded]);

  useEffect(() => {
    if (introTextRef.current) {
      setIntroOverflowing(introTextRef.current.scrollHeight > introTextRef.current.clientHeight + 2);
    }
  }, [about]);

  const propertiesScroll = useDragAutoScroll(propertiesList.length);
  const blogsScroll = useDragAutoScroll(blogsList.length);

  const seo = usePageSeo("home", {
    title: "Home",
    description: "Wanderama Hospitality LLP operates handpicked hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh — book a stay built around comfort, safety and personal service.",
  });

  useEffect(() => {
    const loadHeroSlides = () => {
      fetch(`${API_BASE_URL}/api/hero`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setHeroSlides(data.data);
          }
        })
        .catch(() => {});
    };

    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPropertiesList(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTestimonialsList(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/about`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAbout(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/destinations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDestinations(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBlogsList(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGalleryItems(data.data);
        }
      })
      .catch(() => {});

    loadHeroSlides();
    window.addEventListener("focus", loadHeroSlides);
    return () => window.removeEventListener("focus", loadHeroSlides);
  }, []);

  const whyContentRef = useRef(null);
  const whyImageRef = useRef(null);

  // Synchronize left image height to match right content exactly down to the button
  useEffect(() => {
    const syncWhyHeight = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 992) {
        if (whyContentRef.current && whyImageRef.current) {
          const contentH = whyContentRef.current.offsetHeight;
          if (contentH > 0) {
            whyImageRef.current.style.height = `${contentH}px`;
          }
        }
      } else {
        if (whyImageRef.current) {
          whyImageRef.current.style.height = "";
        }
      }
    };

    syncWhyHeight();
    const timer = setTimeout(syncWhyHeight, 150);

    let ro;
    if (typeof ResizeObserver !== "undefined" && whyContentRef.current) {
      ro = new ResizeObserver(() => {
        syncWhyHeight();
      });
      ro.observe(whyContentRef.current);
    }

    window.addEventListener("resize", syncWhyHeight);
    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", syncWhyHeight);
    };
  }, [about?.why_features, about?.why_text, about?.why_title, about?.why_button_text]);

  const featured = propertiesList.slice(0, 6);
  const whatsappNumber = (settings?.whatsapp_number || "910000000000").replace(/[^0-9]/g, "");

  const switchGalleryCategory = (newIndex) => {
    if (newIndex === galleryCategoryIndex || isGalleryChanging) return;
    setIsGalleryChanging(true);
    setTimeout(() => {
      setGalleryCategoryIndex(newIndex);
      setIsGalleryChanging(false);
    }, 180);
  };

  const handlePrevGallery = () => {
    const nextIdx = (galleryCategoryIndex - 1 + galleryCategories.length) % galleryCategories.length;
    switchGalleryCategory(nextIdx);
  };

  const handleNextGallery = () => {
    const nextIdx = (galleryCategoryIndex + 1) % galleryCategories.length;
    switchGalleryCategory(nextIdx);
  };

  const currentGalleryCategory = galleryCategories[galleryCategoryIndex] || galleryCategories[0];

  // Derive 5 images for current active gallery category
  const activeCategoryImages = (galleryItems || []).filter(
    (item) => item.category === currentGalleryCategory.id && item.type === "image"
  );

  let currentGalleryImages = [];
  if (activeCategoryImages.length >= 5) {
    currentGalleryImages = activeCategoryImages.slice(0, 5);
  } else if (activeCategoryImages.length > 0) {
    currentGalleryImages = [...activeCategoryImages];
    while (currentGalleryImages.length < 5) {
      currentGalleryImages.push(activeCategoryImages[currentGalleryImages.length % activeCategoryImages.length]);
    }
  } else {
    currentGalleryImages = currentGalleryCategory.fallbackImages.map((url, idx) => ({
      id: `fb-${currentGalleryCategory.id}-${idx}`,
      url,
      title: currentGalleryCategory.title,
    }));
  }

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        customSchema={seo.schema}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Wanderama Hospitality LLP",
          url: SITE_URL,
          logo: `${SITE_URL}/assets/img/logo/favicon-512.png`,
          description: "Hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh.",
        }}
      />
      {/* Outer Hero Container with Rounded Margins */}
      {heroSlides.length > 0 && (
      <div className="hero-slider-outer">
        <div className="hero-slider dynamic-920 with-floating-header">
          <Swiper
            key={JSON.stringify(heroSlides)}
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={true}
            speed={1000}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            {heroSlides.map((slide, idx) => (
              <SwiperSlide key={slide.slide_number || slide.id || idx}>
                <div className="slider-card overlay">
                  <picture className="slider-media">
                    <img
                      src={resolveImageUrl(slide.image_url || slide.imageUrl)}
                      width="1920"
                      height="1280"
                      loading="eager"
                      referrerPolicy="no-referrer"
                      alt={slide.image_alt || slide.title || "Wanderama Luxury Resort"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/img/slider/hero-bg.jpg";
                      }}
                    />
                  </picture>
                  <div className="slider-content container">
                    <div className="hero-content-wrapper">
                      <h1 className="hero-title">{slide.title}</h1>
                      <p className="hero-desc" dangerouslySetInnerHTML={{ __html: slide.description }} />
                      <div className="hero-cta-buttons">
                        <Link to="/properties" className="btn-hero-gold">
                          <span>Explore Hotels &amp; Resorts</span>
                        </Link>
                        <Link to="/amenities" className="btn-hero-outline-light">
                          <span>Explore Experiences</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      )}

      {/* Introduction (About Us) */}
      {about && (
      <div className="image-text text-first image-text-about home-band-cream">
        <div className="container">
          {/* Trust Highlights Fixed 4-Section Grid — Above OUR STORY & PHILOSOPHY */}
          {(about.home_intro_features || []).length > 0 && (
            <div className="home-trust-features-bar" data-aos="fade-up">
              <div className="home-trust-features-grid">
                {about.home_intro_features.map((f, i) => {
                  const { value, label } = splitTrustFeature(f);
                  return (
                    <div className="home-trust-feature-item" key={i}>
                      <div className="feature-check-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <div className="feature-content">
                        <span className="feature-value">{value}</span>
                        {label && <span className="feature-text">{label}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="row flex-lg-row-reverse align-items-center">
            <div className="col-xl-5 col-lg-6 col-12 mb-4 mb-lg-0">
              <div className="image-wrap luxury-about-image-wrap">
                <div className="image" data-aos="fade-left">
                  <img
                    src={resolveImageUrl(about.home_intro_image)}
                    width="992"
                    height="1208"
                    loading="lazy" decoding="async"
                    alt={about.home_intro_image_alt || "Wanderama Hospitality"}
                    className="luxury-about-main-img"
                    style={introColHeight ? { "--about-img-height": `${introColHeight}px` } : undefined}
                  />
                  <div className="image-absolute" data-aos="zoom-in-up">
                    <div className="image-shape image-pill luxury-about-sm-img-box">
                      <img src={resolveImageUrl(about.home_intro_image_sm)} width="196" height="279" loading="lazy" decoding="async" alt={about.home_intro_image_alt || "Wanderama property"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 col-12">
              <div className="content about-content-wrapper pr-lg-30" ref={introColRef}>
                <div className="section-sub-tag" data-aos="fade-up">OUR STORY & PHILOSOPHY</div>
                <h2 className="heading section-main-title" data-aos="fade-up" data-aos-delay="30">
                  {about.home_intro_title}
                </h2>
                <div
                  ref={introTextRef}
                  className={`section-body-text${!introExpanded ? " intro-text-clamp" : ""}`}
                  data-aos="fade-up"
                  data-aos-delay="60"
                  dangerouslySetInnerHTML={{ __html: about.home_intro_text }}
                />
                {introOverflowing && (
                  <button
                    type="button"
                    className="intro-see-more-btn"
                    onClick={() => setIntroExpanded((v) => !v)}
                  >
                    {introExpanded ? "See Less" : "See More"}
                  </button>
                )}

                <div className="about-cta-wrapper mt-30" data-aos="fade-up" data-aos-delay="150">
                  <Link to="/about" className="btn-hero-primary" aria-label="About Wanderama">
                    <span>About Wanderama</span>
                    <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Featured Properties */}
      <div className="blog blog-about home-band-white">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <div className="section-sub-tag text-center" data-aos="fade-up">LUXURY RESORTS & VILLAS</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              Featured Properties
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
              A handpicked selection of destinations where Wanderama can take you next
            </p>
          </div>
          <div className="section-content">
            <div className="featured-properties-scroll" {...propertiesScroll}>
              {featured.map((p, i) => (
                <div className="featured-property-item" key={p.slug}>
                  <PropertyCard property={p} delay={i * 50} />
                </div>
              ))}
            </div>
            <div className="section-bottom-button text-center mt-50" data-aos="fade-up">
              <Link to="/properties" className="btn-hero-primary">
                <span>View All Properties</span>
                <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Wanderama */}
      {about?.why_title && (
      <div className="why-wanderama-section home-band-cream">
        <div className="container">
          <div className="row align-items-stretch g-4 g-xl-5 why-wanderama-row">
            <div className="col-lg-5 col-12 why-wanderama-col-img">
              <div className="why-wanderama-image-wrap" ref={whyImageRef} data-aos="fade-right">
                <img
                  src={resolveImageUrl(about.why_image)}
                  width="700"
                  height="520"
                  loading="lazy" decoding="async"
                  alt={about.why_image_alt || about.why_title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/img/image-text/2.jpg";
                  }}
                />
              </div>
            </div>
            <div className="col-lg-7 col-12 why-wanderama-col-content">
              <div className="why-wanderama-content" ref={whyContentRef} data-aos="fade-up" data-aos-delay="30">
                {about.why_tag && (
                  <div className="why-sub-tag">
                    <span className="why-tag-dot">✦</span>
                    <span>{about.why_tag}</span>
                  </div>
                )}
                <h2 className="heading section-main-title why-main-heading">{about.why_title}</h2>
                {about.why_text && <div className="section-body-text why-lead-text" dangerouslySetInnerHTML={{ __html: about.why_text }} />}

                {(about.why_features || []).length > 0 && (
                  <div className={`why-wanderama-features count-${about.why_features.length}`}>
                    {about.why_features.map((f, i) => (
                      <div className="why-feature-item" key={i}>
                        <span className="why-feature-number">{String(i + 1).padStart(2, "0")}</span>
                        <div className="why-feature-text-block">
                          <h4 className="why-feature-title">{f.title}</h4>
                          {f.desc && <p className="why-feature-desc" dangerouslySetInnerHTML={{ __html: f.desc }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {about.why_button_text && (
                  <div className="why-button-wrap">
                    <Link to={about.why_button_link || "/about"} className="btn-why-wanderama" aria-label={about.why_button_text}>
                      <span>{about.why_button_text}</span>
                      <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Group Travel */}
      <div className="group-travel-section home-band-white">
        <div className="container">
          <div className="row align-items-start group-travel-header">
            <div className="col-lg-6 col-12 mb-3 mb-lg-0">
              <div className="section-sub-tag" data-aos="fade-up">GROUP TRAVEL</div>
              <h2 className="heading section-main-title" style={{ marginBottom: 0 }} data-aos="fade-up" data-aos-delay="30">
                Travel Together, Planned Properly
              </h2>
            </div>
            <div className="col-lg-6 col-12">
              <p className="section-body-text" style={{ marginBottom: 0 }} data-aos="fade-up" data-aos-delay="60">
                Keep corporate and school travel as first-class business categories with dedicated landing pages, enquiry forms and package details.
              </p>
            </div>
          </div>
          <div className="row grid-gap" style={{ marginTop: "40px" }}>
            {[
              { title: "Corporate Outings", desc: "Team outings, retreats, group stays, activities and customized planning.", cta: "Plan Corporate Outing" },
              { title: "Corporate Team Building", desc: "Experiences designed around team engagement and group requirements.", cta: "Explore Corporate Experiences" },
              { title: "School Tours", desc: "Organized school trips with accommodation, activities and logistics.", cta: "Plan School Tour" },
              { title: "School Picnics", desc: "Day trips and educational experiences for school groups.", cta: "Explore School Trips" },
            ].map((card, i) => (
              <div className="col-lg-3 col-md-6 col-12 mb-4" data-aos="fade-up" data-aos-delay={i * 50} key={card.title}>
                <div className="group-travel-card">
                  <h3 className="group-travel-card-title">{card.title}</h3>
                  <p className="group-travel-card-desc">{card.desc}</p>
                  <Link to="/contact" className="group-travel-card-link">
                    {card.cta} <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Destination Highlights */}
      <div className="destination-highlights-section home-band-cream">
        <div className="container">
            <div className="section-headings headings-width text-center">
              <div className="section-sub-tag text-center" style={{ color: "#D9A752" }} data-aos="fade-up">
                DESTINATION HIGHLIGHTS
              </div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                Four States, One Standard Of Hospitality
              </h2>
              <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
                Explore our handpicked collection of luxury resorts, heritage stays, and serene retreats
              </p>
            </div>
            <div className="row grid-gap">
              {destinations.slice(0, 4).map((dest, i) => {
                const count = propertiesList.filter((p) => p.state === dest.name).length;
                return (
                  <div className="col-lg-3 col-md-6 col-12" data-aos="fade-up" data-aos-delay={i * 50} key={dest.id}>
                    <Link to="/properties" className="luxury-state-card" aria-label={`Properties in ${dest.name}`}>
                      <div className="state-card-img-wrap">
                        <img src={resolveImageUrl(dest.image_url)} width="768" height="773" loading="lazy" decoding="async" alt={dest.image_alt || dest.name} className="state-card-img" />
                        <div className="state-card-overlay"></div>
                        <span className="state-count-badge">
                          {count} {count > 1 ? "Properties" : "Property"}
                        </span>
                        <div className="state-card-content">
                          <h3 className="state-card-title">{dest.name}</h3>
                          <div className="state-card-link">
                            <span>Explore Stays</span>
                            <svg className="state-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
        </div>
      </div>

      {/* Testimonials (Guest Experiences) */}
      <div className="luxury-testimonials-section home-band-white">
        <div className="container">
          <div className="section-headings headings-width text-center mb-50">
            <div className="section-sub-tag text-center" data-aos="fade-up">GUEST EXPERIENCES</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              What Our Guests Say
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
              Real feedback from families, couples, and travellers who have stayed with us
            </p>
          </div>
          <div className="section-content">
            <div className="row grid-gap">
              {testimonialsList.slice(0, 3).map((t, i) => (
                <div className="col-lg-4 col-md-6 col-12 mb-4" data-aos="fade-up" data-aos-delay={i * 50} key={t.id}>
                  <div className="luxury-testimonial-card">
                    <div className="testimonial-card-top">
                      <div className="testimonial-quote-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="#D9A752" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                        </svg>
                      </div>
                      <StarRating count={t.rating || 5} />
                    </div>
                    <div className="testimonial-stay-property">{t.stay_property}</div>
                    <p className="testimonial-quote-text">&ldquo;<span className="testimonial-quote-inner" dangerouslySetInnerHTML={{ __html: t.quote_text }} />&rdquo;</p>
                    <div className="testimonial-user-footer">
                      <img src={resolveImageUrl(t.avatar_url)} alt={t.avatar_alt || t.author_name} loading="lazy" decoding="async" className="testimonial-user-avatar" onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(t.author_name) + "&background=0564F2&color=FFFFFF"; }} />
                      <div className="testimonial-user-info">
                        <h4 className="testimonial-user-name">{t.author_name}</h4>
                        <span className="testimonial-user-place">{t.author_location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-bottom-button text-center mt-50" data-aos="fade-up">
              <Link to="/testimonials" className="btn-hero-primary">
                <span>Read All Testimonials</span>
                <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Preview */}
      <div className="luxury-gallery-section home-band-cream">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <div className="section-sub-tag text-center" data-aos="fade-up">
              PHOTO GALLERY &bull; {currentGalleryCategory.subTag}
            </div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              A Peek Into Wanderama Life
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "640px", minHeight: "48px" }} data-aos="fade-up" data-aos-delay="60">
              {currentGalleryCategory.text}
            </p>
          </div>
          <div className="gallery-nav-dots-wrapper gallery-nav-dots-top mb-30" data-aos="fade-up">
            {galleryCategories.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                className={`gallery-nav-dot${idx === galleryCategoryIndex ? " active" : ""}`}
                onClick={() => switchGalleryCategory(idx)}
                aria-label={`View ${cat.title}`}
                title={cat.title}
              />
            ))}
          </div>

          <div className={`home-gallery-grid${isGalleryChanging ? " is-changing" : ""}`}>
            {currentGalleryImages.map((img, i) => (
              <div
                className={`home-gallery-item${i === 0 ? " home-gallery-item-large" : ""}`}
                data-aos="fade-up"
                data-aos-delay={i * 30}
                key={`${currentGalleryCategory.id}-${img.id || i}-${i}`}
              >
                <a
                  href={resolveImageUrl(img.url)}
                  data-fancybox={`home-gallery-${currentGalleryCategory.id}`}
                  className="luxury-gallery-card"
                  aria-label={`View ${currentGalleryCategory.title} photo`}
                >
                  <img
                    src={resolveImageUrl(img.url)}
                    width={i === 0 ? "720" : "480"}
                    height={i === 0 ? "720" : "480"}
                    loading="lazy" decoding="async"
                    alt={img.title || `${currentGalleryCategory.title} photo`}
                    className="gallery-card-img"
                  />
                  <div className="gallery-card-overlay"></div>
                  <div className="gallery-card-zoom-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* Luxury Gallery Left/Right Arrow Navigation */}
          <div className="home-gallery-nav-wrapper text-center" data-aos="fade-up">
            <div className="home-gallery-nav-bar">
              <button
                type="button"
                className="gallery-nav-arrow-btn gallery-nav-prev"
                onClick={handlePrevGallery}
                aria-label="Previous gallery section"
                title="Previous section"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                className="gallery-nav-arrow-btn gallery-nav-next"
                onClick={handleNextGallery}
                aria-label="Next gallery section"
                title="Next section"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Latest Blogs */}
      {blogsList.length > 0 && (
      <div className="blog blog-about home-band-white">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <div className="section-sub-tag text-center" data-aos="fade-up">TRAVEL GUIDES & STORIES</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              From The Wanderama Blog
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
              Tips and inspiration for planning your next Wanderama stay
            </p>
          </div>
          <div className="section-content">
            <div className="featured-properties-scroll" {...blogsScroll}>
              {blogsList.slice(0, 6).map((post) => (
                <div className="featured-property-item" key={post.slug}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
            <div className="section-bottom-button text-center mt-50" data-aos="fade-up">
              <Link to="/blog" className="btn-hero-primary">
                <span>View All Blogs</span>
                <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Video Section Showcase */}
      <div className="multiple-video-section home-band-cream">
        <div className="container">
            <div className="section-headings headings-width text-center">
              <div className="section-sub-tag text-center" style={{ color: "#D9A752" }} data-aos="fade-up">
                CINEMATIC TOUR
              </div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                See Wanderama In Motion
              </h2>
              <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
                Take a virtual walkthrough of our luxury resorts, scenic poolside views, and tranquil spaces
              </p>
            </div>
            <div className="row grid-gap">
              {videoList.map((item, index) => (
                <div className="col-lg-4 col-md-6 col-12" key={item.id} data-aos="fade-up" data-aos-delay={index * 80}>
                  <div className="luxury-video-card" onClick={() => setActiveVideo(item)}>
                    <div className="video-card-thumb-wrap">
                      <LazyVideo src={item.videoUrl} poster={item.thumb} className="video-card-thumb" />
                      <div className="video-card-overlay"></div>
                      <span className="video-tag-badge">{item.tag}</span>
                      <span className="video-duration-badge">{item.duration}</span>
                      <div className="video-play-pulse-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5V19L19 12L8 5Z" />
                        </svg>
                      </div>
                      <div className="video-card-info">
                        <h3 className="video-card-title">{item.title}</h3>
                        <p className="video-card-subtitle">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Video Modal Lightbox */}
      {activeVideo && (
        <div className="custom-video-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="custom-video-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close-btn" onClick={() => setActiveVideo(null)} aria-label="Close Video">
              ✕
            </button>
            <div className="video-modal-header-title">{activeVideo.title}</div>
            <div className="video-player-wrapper">
              <video
                controls
                autoPlay
                playsInline
                src={activeVideo.videoUrl}
                className="video-element-frame"
                ref={(el) => {
                  if (el) {
                    el.play().catch(() => {});
                  }
                }}
              >
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </div>
      )}



      {/* Send an Enquiry (About Us Form) */}
      <div className="blog blog-about home-band-cream">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <div className="section-sub-tag text-center" data-aos="fade-up">GET IN TOUCH</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              Send Us Your Travel Plans
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
              Share a few details and our reservations manager will get back to you within 30 minutes
            </p>
          </div>
          <div className="row justify-content-center mt-50">
            <div className="col-lg-8 col-12">
              <EnquiryForm propertiesList={propertiesList} title="Send an Enquiry" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
