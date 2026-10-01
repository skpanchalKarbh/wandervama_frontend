import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import AmenityIcon from "../components/AmenityIcon";
import PropertyCard from "../components/PropertyCard";
import EnquiryForm from "../components/EnquiryForm";
import SEO from "../components/SEO";
import { API_BASE_URL, SITE_URL } from "../config/api";

const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
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

export default function PropertyDetails() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [masterAmenities, setMasterAmenities] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const [galleryOffset, setGalleryOffset] = useState(0);
  const [isGallerySliding, setIsGallerySliding] = useState(false);

  useEffect(() => {
    setGalleryOffset(0);
    fetch(`${API_BASE_URL}/api/properties/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProperty(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setAllProperties(data.data);
      })
      .catch(() => {});
  }, [slug]);

  const slideGalleryTo = (newOffset) => {
    if (isGallerySliding) return;
    setIsGallerySliding(true);
    setTimeout(() => {
      setGalleryOffset(newOffset);
      setIsGallerySliding(false);
    }, 150);
  };

  const handlePrevGallerySlide = () => {
    if (!galleryList.length) return;
    const nextOffset = (galleryOffset - 1 + galleryList.length) % galleryList.length;
    slideGalleryTo(nextOffset);
  };

  const handleNextGallerySlide = () => {
    if (!galleryList.length) return;
    const nextOffset = (galleryOffset + 1) % galleryList.length;
    slideGalleryTo(nextOffset);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/amenities`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setMasterAmenities(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const whatsappNumber = (settings?.whatsapp_number || "910000000000").replace(/[^0-9]/g, "");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <>
        <SEO title="Property Not Found" noindex />
        <div className="container text-center py-5">
          <h2>Property Not Found</h2>
          <p>The property you are looking for does not exist or has been removed.</p>
          <Link to="/properties" className="btn btn-primary mt-3">
            Back to Properties
          </Link>
        </div>
      </>
    );
  }

  const related = allProperties
    .filter((p) => p.slug !== property.slug && p.state === property.state)
    .slice(0, 2);

  // Extract gallery images safely
  const galleryList = Array.isArray(property.gallery) && property.gallery.length > 0
    ? property.gallery
    : [property.heroImage || property.thumbImage || "/assets/img/slider/hero-bg.jpg"];

  // Extract videos safely (array or single string)
  const videoList = Array.isArray(property.videos)
    ? property.videos.filter(Boolean)
    : (property.video || property.videoUrl ? [property.video || property.videoUrl].filter(Boolean) : []);

  const rawBadges = property.badges;
  const highlightBadges = Array.isArray(rawBadges) && rawBadges.length > 0
    ? rawBadges
    : (typeof rawBadges === "string" && rawBadges.trim()
        ? (rawBadges.startsWith("[")
            ? (() => { try { return JSON.parse(rawBadges); } catch (e) { return rawBadges.split(",").map(s => s.trim()).filter(Boolean); } })()
            : rawBadges.split(",").map(s => s.trim()).filter(Boolean))
        : (Array.isArray(property.amenities) && property.amenities.length > 0
            ? property.amenities.slice(0, 5)
            : ["AC Deluxe Rooms", "Swimming Pool", "Fine Dining", "Free Wi-Fi", "Family Friendly"]));

  const heroSubheadingText =
    property.heroSubheading ||
    property.hero_subheading ||
    `${property.name.toUpperCase()} BY WANDERAMA • ${(property.location || "GUJARAT").toUpperCase()}, ${(property.state || "INDIA").toUpperCase()}`;

  const heroTitleText =
    property.heroTitle ||
    property.hero_title ||
    `${property.name} in ${property.location || "Gujarat"}`;

  const heroDescriptionText = property.tagline || property.description;

  const heroImageSrc = resolveMediaUrl(property.heroImage || galleryList[0]);
  const thumbImageSrc = resolveMediaUrl(property.thumbImage || galleryList[0] || property.heroImage);

  const renderGalleryTile = (img, idx, extraCount) => (
    <div
      key={idx}
      onClick={() => setLightboxIndex(idx)}
      className="property-gallery-tile luxury-gallery-card-item"
      data-aos="fade-up"
      data-aos-delay={idx * 35}
    >
      <img
        src={resolveMediaUrl(img)}
        alt={`${property.name} gallery ${idx + 1}`}
        loading="lazy" decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/img/slider/hero-bg.jpg";
        }}
      />
      <div className="gallery-card-hover-overlay d-flex align-items-center justify-content-center">
        {extraCount > 0 ? (
          <span className="property-gallery-more-badge">+{extraCount} More</span>
        ) : (
          <span
            className="px-3 py-2 rounded-pill text-white fw-600 shadow-sm"
            style={{
              fontSize: "13px",
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            🔍 Expand View
          </span>
        )}
      </div>
    </div>
  );

  const getAboutData = () => {
    if (property.slug === "gokul-resort-sasan-gir") {
      return {
        image: thumbImageSrc,
        eyebrow: "ABOUT THE RESORT",
        heading: "Comfort, nature and experiences in one Gir stay",
        paragraphs: [
          "Gokul Resort by Wanderama is located in Chitrod near Sasan Gir, Gujarat. The property combines accommodation with meals, recreation and outdoor experiences.",
          "The current property information lists 16 premium rooms with private seating areas, an infinity pool and baby pool, pure vegetarian cuisine, a party lawn, indoor and outdoor games, morning treks and cultural entertainment.",
        ],
        highlights: [
          {
            number: "01",
            title: "Nature-led location",
            desc: "Stay in the Gir region with access to local wildlife and attractions.",
          },
          {
            number: "02",
            title: "Family-friendly facilities",
            desc: "Pool, baby pool, games and open spaces.",
          },
          {
            number: "03",
            title: "Stay + experience",
            desc: "Meals, activities, trek and entertainment around the stay.",
          },
        ],
      };
    }

    if (property.slug === "hotel-shridhar-dwarka") {
      return {
        image: thumbImageSrc,
        eyebrow: "ABOUT THE HOTEL",
        heading: property.tagline || "Comfortable pilgrim stay, minutes from Dwarkadhish Temple",
        paragraphs: [
          "Hotel Shridhar offers clean, quiet and well-connected rooms for pilgrims and travellers visiting Dwarkadhish Temple, Rukmini Devi Temple and the Dwarka coastline.",
          "Simple, hygienic and staffed round the clock — featuring air-conditioned rooms, elevator access, front-desk pilgrimage support, and peaceful surroundings tailored for spiritual travel.",
        ],
        highlights: [
          {
            number: "01",
            title: "Sacred temple proximity",
            desc: "Walking distance from holy Dwarkadhish Temple and Dwarka beach.",
          },
          {
            number: "02",
            title: "Hygienic family stays",
            desc: "Clean, air-conditioned rooms with 24x7 security and room amenities.",
          },
          {
            number: "03",
            title: "Pilgrim desk & travel help",
            desc: "Round-the-clock front desk assistance for Bet Dwarka and local darshan.",
          },
        ],
      };
    }

    if (property.slug === "dhinga-masti-resort-patdi") {
      return {
        image: thumbImageSrc,
        eyebrow: "ABOUT THE RESORT",
        heading: property.tagline || "Family fun & adventure resort near Little Rann of Kutch",
        paragraphs: [
          "Dhinga Masti Resort is a lively family resort near Patdi, built for groups who want water games, open lawns and a full day of masti and relaxation.",
          "Spacious cottages, a large water park, and dedicated activity zones make it a favourite weekend getaway for families, weddings and corporate retreats across Gujarat.",
        ],
        highlights: [
          {
            number: "01",
            title: "Adventure & wildlife proximity",
            desc: "Easy access to Little Rann of Kutch wildlife sanctuary and desert safaris.",
          },
          {
            number: "02",
            title: "Water park & recreation",
            desc: "On-site wave pool, water park, adventure games and party lawns.",
          },
          {
            number: "03",
            title: "Stay + group dining",
            desc: "Authentic Gujarati dining, bonfire nights, and spacious cottages.",
          },
        ],
      };
    }

    if (property.slug === "van-vagdo-resort-statue-of-unity") {
      return {
        image: thumbImageSrc,
        eyebrow: "ABOUT THE RESORT",
        heading: property.tagline || "Riverside stay overlooking the world's tallest statue",
        paragraphs: [
          "Van Vagdo Resort sits peacefully along the Narmada river, a short scenic ride from the Statue of Unity, Sardar Sarovar Dam and the Jungle Safari Park.",
          "Designed for families, nature lovers and tour groups who want seamless access to Kevadia's biggest landmarks with premium cottages, lawns, and wholesome dining.",
        ],
        highlights: [
          {
            number: "01",
            title: "Statue of Unity proximity",
            desc: "Minutes from the monument, Sardar Sarovar Dam and Kevadia Safari.",
          },
          {
            number: "02",
            title: "Riverside tranquility",
            desc: "Serene Narmada riverfront surroundings and lush green lawns.",
          },
          {
            number: "03",
            title: "Family stays & events",
            desc: "Group cottages, swimming pool, open dining and recreation spaces.",
          },
        ],
      };
    }

    const p1 = property.description
      ? property.description.split("\n\n")[0]
      : `${property.name} by Wanderama is located in ${property.location}, ${property.state}. The property blends quality accommodation with attentive hospitality and convenient location access.`;

    const p2 = property.description && property.description.includes("\n\n")
      ? property.description.split("\n\n")[1]
      : (property.tagline ? `${property.tagline}. Designed for guests looking for comfortable stays, personalized service, and memorable experiences.` : "");

    const highlights = (property.attractions && property.attractions.length > 0)
      ? property.attractions.slice(0, 3).map((att, idx) => ({
          number: `0${idx + 1}`,
          title: idx === 0 ? "Prime destination location" : (idx === 1 ? "Family-friendly facilities" : "Stay + experience"),
          desc: att,
        }))
      : [
          {
            number: "01",
            title: `${property.location} location`,
            desc: `Convenient access to local attractions in ${property.location}.`,
          },
          {
            number: "02",
            title: "Quality guest facilities",
            desc: "Comfortable air-conditioned rooms, hygienic dining and guest care.",
          },
          {
            number: "03",
            title: "Wanderama hospitality",
            desc: "Attentive management, personalized service and round-the-clock support.",
          },
        ];

    return {
      image: thumbImageSrc,
      eyebrow: `ABOUT THE ${property.type?.toUpperCase() || "PROPERTY"}`,
      heading: property.tagline || `Comfort, nature and experiences at ${property.name}`,
      paragraphs: p2 ? [p1, p2] : [p1],
      highlights,
    };
  };

  const aboutData = getAboutData();

  const getQuickFacts = () => {
    // 0. New: fully admin-managed facts list (unlimited count, add/edit/delete
    // supported in Admin Panel). Once a property has been saved through the
    // new Key Highlights list editor, this array is the sole source of truth
    // — an admin deleting a fact here actually removes it from the strip
    // instead of falling back to placeholder text.
    if (Array.isArray(property.quickFacts) && property.quickFacts.length > 0) {
      return property.quickFacts
        .filter((f) => f && f.title && f.value)
        .map((f) => ({ title: f.title, value: f.value }));
    }

    // 1. Dynamic Priority: If values are set via Admin Panel / Database, use them directly!
    const dynLocation = property.quickLocation || property.quick_location;
    const dynRooms = property.quickRooms || property.quick_rooms;
    const dynPrice = property.quickPrice || property.quick_price;
    const dynDining = property.quickDining || property.quick_dining;
    const dynBestFor = property.quickBestFor || property.quick_best_for;

    if (dynLocation || dynRooms || dynPrice || dynDining || dynBestFor) {
      return [
        { title: "Location", value: dynLocation || property.address || `${property.location}, ${property.state || "Gujarat"}` },
        { title: "Rooms", value: dynRooms || "Premium rooms & suites" },
        { title: "Starting price", value: dynPrice || (property.price ? `From ₹${property.price} per night*` : "From ₹1,499 per person*") },
        { title: "Dining", value: dynDining || "Breakfast, lunch, hi-tea & dinner*" },
        { title: "Best for", value: dynBestFor || "Families, couples & groups" },
      ];
    }

    if (property.slug === "gokul-resort-sasan-gir") {
      return [
        { title: "Location", value: "Chitrod, near Sasan Gir" },
        { title: "Rooms", value: "16 premium rooms" },
        { title: "Starting price", value: "From ₹1,699 per person*" },
        { title: "Dining", value: "Breakfast, lunch, hi-tea & dinner*" },
        { title: "Best for", value: "Families, couples & groups" },
      ];
    }

    if (property.slug === "hotel-shridhar-dwarka") {
      return [
        { title: "Location", value: "Dwarka, near Dwarkadhish Temple" },
        { title: "Rooms", value: "AC deluxe & family rooms" },
        { title: "Starting price", value: "From ₹1,299 per night*" },
        { title: "Dining", value: "Pure veg dining & room service*" },
        { title: "Best for", value: "Pilgrims, families & couples" },
      ];
    }

    if (property.slug === "dhinga-masti-resort-patdi") {
      return [
        { title: "Location", value: "Patdi, near Little Rann of Kutch" },
        { title: "Rooms", value: "Spacious family cottages" },
        { title: "Starting price", value: "From ₹1,499 per person*" },
        { title: "Dining", value: "Breakfast, lunch, hi-tea & dinner*" },
        { title: "Best for", value: "Families, couples & groups" },
      ];
    }

    if (property.slug === "van-vagdo-resort-statue-of-unity") {
      return [
        { title: "Location", value: "Kevadia, near Statue of Unity" },
        { title: "Rooms", value: "Riverside premium cottages" },
        { title: "Starting price", value: "From ₹1,899 per person*" },
        { title: "Dining", value: "Multi-cuisine buffet & dining*" },
        { title: "Best for", value: "Tour groups, families & nature lovers" },
      ];
    }

    if (property.slug === "hotel-maruti-ahmedabad") {
      return [
        { title: "Location", value: property.address || "City Center, Ahmedabad" },
        { title: "Rooms", value: "Executive AC & family rooms" },
        { title: "Starting price", value: "From ₹1,199 per night*" },
        { title: "Dining", value: "Pure veg dining & breakfast*" },
        { title: "Best for", value: "Business travellers & families" },
      ];
    }

    if (property.slug === "rhythm-villa-mahabaleshwar") {
      return [
        { title: "Location", value: "Panchgani Road, Mahabaleshwar" },
        { title: "Rooms", value: "Private luxury pool villas" },
        { title: "Starting price", value: "From ₹2,499 per person*" },
        { title: "Dining", value: "Multi-cuisine & BBQ dining*" },
        { title: "Best for", value: "Families, couples & celebrations" },
      ];
    }

    if (property.slug === "swarnim-villa-mahabaleshwar") {
      return [
        { title: "Location", value: "Valley View, Mahabaleshwar" },
        { title: "Rooms", value: "Exclusive valley-view villas" },
        { title: "Starting price", value: "From ₹2,699 per person*" },
        { title: "Dining", value: "Chef-curated dining & breakfast*" },
        { title: "Best for", value: "Private retreats & families" },
      ];
    }

    // Dynamic fallback for any other property
    const locVal =
      property.quickLocation ||
      property.address ||
      (property.location ? `${property.location}, ${property.state || "Gujarat"}` : "Gujarat, India");

    const roomsVal =
      property.quickRooms ||
      (property.badges && property.badges.includes("Rooms")
        ? "Deluxe & premium rooms"
        : "Comfortable guest rooms");

    const priceVal =
      property.quickPrice ||
      (property.price ? `From ₹${property.price} per night*` : "From ₹1,499 per person*");

    const diningVal =
      property.quickDining ||
      (property.badges && property.badges.includes("Dining")
        ? "Breakfast, lunch, hi-tea & dinner*"
        : "Pure veg dining & meals*");

    const bestForVal = property.quickBestFor || "Families, couples & groups";

    return [
      { title: "Location", value: locVal },
      { title: "Rooms", value: roomsVal },
      { title: "Starting price", value: priceVal },
      { title: "Dining", value: diningVal },
      { title: "Best for", value: bestForVal },
    ];
  };

  const quickFacts = getQuickFacts();

  const findMasterAmenity = (title) => {
    if (!title) return null;
    const normalized = title.trim().toLowerCase();
    return (
      masterAmenities.find((m) => (m.title || "").trim().toLowerCase() === normalized) || null
    );
  };

  const getAmenitiesData = () => {
    // 1. Property-specific amenities set via the Admin Panel / database take full priority.
    if (property.amenities && property.amenities.length > 0) {
      return property.amenities.map((item) => {
        const title = typeof item === "string" ? item : (item.title || item.name || "");
        const explicitDesc = typeof item === "object" ? (item.desc || item.description) : "";
        const match = findMasterAmenity(title);
        return {
          title,
          desc: explicitDesc || match?.description || "Guest amenity & service",
          icon: match?.icon || "bed",
        };
      });
    }

    // 2. No amenities set for this property yet — fall back to the site-wide amenities
    //    managed in the Admin Panel so the section is never empty and stays dynamic.
    if (masterAmenities.length > 0) {
      return masterAmenities.map((m) => ({
        title: m.title,
        desc: m.description || "Guest amenity & service",
        icon: m.icon || "bed",
      }));
    }

    return [];
  };

  const amenitiesList = getAmenitiesData();

  let customSchema = null;
  if (property.schemaMarkup) {
    try {
      customSchema = JSON.parse(property.schemaMarkup);
    } catch (e) {
      customSchema = null;
    }
  }

  return (
    <>
      <SEO
        title={property.metaTitle || `${property.name} — ${property.location}, ${property.state}`}
        description={property.metaDescription || property.tagline || property.description || `${property.name} is a ${property.type?.toLowerCase()} in ${property.location}, ${property.state}, part of the Wanderama Hospitality collection.`}
        image={property.heroImage}
        customSchema={customSchema}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: property.name,
          description: property.tagline || property.description,
          image: property.heroImage ? [resolveMediaUrl(property.heroImage)] : undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: property.address || undefined,
            addressLocality: property.location,
            addressRegion: property.state,
            addressCountry: "IN",
          },
          telephone: property.phone || undefined,
          url: `${SITE_URL}/properties/${property.slug}`,
        }}
      />

      {/* IMMERSIVE LUXURY HERO SHOWCASE BANNER */}
      <div
        className="property-details-hero-banner"
        style={{
          position: "relative",
          minHeight: "560px",
          display: "flex",
          alignItems: "center",
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.90) 0%, rgba(15, 23, 42, 0.74) 52%, rgba(15, 23, 42, 0.45) 100%), url(${resolveMediaUrl(property.heroImage || galleryList[0])})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "135px 0 90px 0",
          color: "#FFFFFF",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "860px" }}>
            {/* Top Subheading */}
            <div
              className="property-hero-subheading"
              data-aos="fade-up"
              style={{
                fontSize: "13.5px",
                fontWeight: "700",
                letterSpacing: "1.6px",
                color: "#D9A752",
                textTransform: "uppercase",
                marginBottom: "14px",
                textShadow: "0 1px 8px rgba(0,0,0,0.7)",
              }}
            >
              {heroSubheadingText}
            </div>

            {/* Main Heading */}
            <h1
              className="property-hero-main-title"
              data-aos="fade-up"
              data-aos-delay="40"
              style={{
                fontSize: "clamp(32px, 5.2vw, 56px)",
                fontWeight: "800",
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                lineHeight: "1.15",
                letterSpacing: "-0.5px",
                marginBottom: "18px",
                textShadow: "0 2px 14px rgba(0,0,0,0.75)",
              }}
            >
              {heroTitleText}
            </h1>

            {/* Description Paragraph */}
            {heroDescriptionText && (
              <p
                className="property-hero-desc"
                data-aos="fade-up"
                data-aos-delay="80"
                style={{
                  fontSize: "clamp(15px, 2vw, 17px)",
                  color: "var(--wd-gold)",
                  WebkitTextFillColor: "var(--wd-gold)",
                  lineHeight: "1.7",
                  marginBottom: "24px",
                  maxWidth: "800px",
                  textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                }}
              >
                {heroDescriptionText}
              </p>
            )}

            {/* Action Buttons Row */}
            <div
              className="d-flex align-items-center flex-wrap gap-3"
              data-aos="fade-up"
              data-aos-delay="160"
            >
              <Link
                to="/contact"
                className="btn-hero-action-gold"
              >
                <span>Check Availability / Enquire</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <a
                href="#property-overview"
                className="btn-hero-action-outline"
              >
                <span>View Rooms & Packages</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-details pd-main" style={{ paddingTop: "50px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="row">
            <div className="col-12" id="property-overview">
              <div className="pd-content">
                {/* Key Attractions & Property Quick Highlights Bar (Matching User Reference Image) */}
                <div className="property-quick-facts-wrap mb-50" data-aos="fade-up">
                  <div
                    className="property-quick-facts-bar"
                    style={quickFacts.length !== 5 ? { "--quick-facts-cols": `repeat(${Math.max(quickFacts.length, 1)}, 1fr)` } : undefined}
                  >
                    {quickFacts.map((fact, idx) => (
                      <div key={idx} className="quick-fact-col">
                        <div className="quick-fact-title">{fact.title}</div>
                        <div className="quick-fact-desc">{fact.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <h1
                  className="heading section-main-title"
                  data-aos="fade-up"
                  style={{
                    fontSize: "clamp(28px, 3.4vw, 36px)",
                    fontWeight: "800",
                    color: "#0F172A",
                    lineHeight: "1.2",
                    marginBottom: property.address ? "12px" : "32px",
                  }}
                >
                  {property.name}
                </h1>

                {property.address && (
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{ fontSize: "14.5px", color: "#475569", marginBottom: "32px" }}
                    data-aos="fade-up"
                  >
                    <span style={{ color: "#D9A752", display: "inline-flex" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <span><strong>Address:</strong> {property.address}</span>
                  </div>
                )}

                {/* 2-Column Luxury About Showcase Section (Matching User Image) */}
                <div className="property-about-showcase mb-50" style={{ background: "transparent" }} data-aos="fade-up">
                  <div className="row align-items-center g-4 g-lg-5">
                    {/* Left Column: Featured Rounded Room/Property Image */}
                    <div className="col-lg-6 col-12">
                      <div className="property-about-img-frame">
                        <img
                          src={aboutData.image}
                          alt={`About ${property.name}`}
                          loading="lazy" decoding="async"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/img/slider/hero-bg.jpg";
                          }}
                        />
                      </div>
                    </div>

                    {/* Right Column: About Info & Numbered Highlights */}
                    <div className="col-lg-6 col-12">
                      <div className="property-about-text-content ps-lg-2">
                        {/* Subheading / Eyebrow */}
                        <div className="property-about-eyebrow mb-2">
                          {aboutData.eyebrow}
                        </div>

                        {/* Main Title */}
                        <h2 className="property-about-title mb-3">
                          {aboutData.heading}
                        </h2>

                        {/* Description Paragraphs */}
                        <div className="property-about-paragraphs mb-4">
                          {aboutData.paragraphs.map((para, pIdx) => (
                            <p key={pIdx}>
                              {para}
                            </p>
                          ))}
                        </div>

                        {/* 3 Numbered Highlights */}
                        {aboutData.highlights && aboutData.highlights.length > 0 && (
                          <div className="property-about-highlights-list d-flex flex-column gap-3 mt-3">
                            {aboutData.highlights.map((item, hIdx) => (
                              <div
                                key={hIdx}
                                className="property-about-highlight-item"
                              >
                                <span className="property-about-highlight-num">
                                  {item.number}
                                </span>
                                <div>
                                  <h4 className="property-about-highlight-title">
                                    {item.title}
                                  </h4>
                                  <p className="property-about-highlight-desc">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rooms & Accommodation Section (admin-managed) */}
                {Array.isArray(property.rooms) && property.rooms.length > 0 && (
                  <div className="property-rooms-section mb-50 pb-20" data-aos="fade-up">
                    <div className="property-rooms-header d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
                      <div>
                        <div className="property-amenities-eyebrow mb-2">
                          {property.roomsEyebrow || property.rooms_eyebrow || "ROOMS & ACCOMMODATION"}
                        </div>
                        <h2 className="property-amenities-heading property-rooms-heading mb-0">
                          {property.roomsTitle || property.rooms_title || "Choose the stay that fits your group"}
                        </h2>
                      </div>
                      {(property.roomsDescription || property.rooms_description) && (
                        <div className="property-amenities-subtext" dangerouslySetInnerHTML={{ __html: property.roomsDescription || property.rooms_description }} />
                      )}
                    </div>

                    <div className="row g-3 g-lg-4">
                      {property.rooms.map((room, i) => (
                        <div className="col-lg-4 col-md-6 col-12" key={i}>
                          <div className="property-room-card">
                            <div
                              className="property-room-image"
                              style={{ backgroundImage: `url(${resolveMediaUrl(room.image)})` }}
                              role="img"
                              aria-label={room.imageAlt || room.name}
                            />
                            <div className="property-room-body">
                              {room.category && (
                                <div className="property-room-category">{room.category}</div>
                              )}
                              <h4 className="property-room-name">{room.name}</h4>
                              {room.description && (
                                <p className="property-room-description" dangerouslySetInnerHTML={{ __html: room.description }} />
                              )}
                              <div className="property-room-price">
                                ₹{room.price}
                                <span className="property-room-price-unit"> {room.priceUnit || "per person"}</span>
                              </div>
                              <Link to="/contact" className="property-room-enquire-btn">
                                Enquire
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resort Amenities Showcase (Matching User Reference Image) */}
                <div className="property-amenities-section mb-50 pb-20" data-aos="fade-up">
                  {/* Top Header Row */}
                  <div className="property-amenities-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                    <div>
                      <div className="property-amenities-eyebrow">
                        {property.amenitiesEyebrow || property.amenities_eyebrow || (property.type ? `${property.type.toUpperCase()} AMENITIES` : "RESORT AMENITIES")}
                      </div>
                      {(property.amenitiesTitle || property.amenities_title) && (
                        <h2 className="property-amenities-heading">
                          {property.amenitiesTitle || property.amenities_title}
                        </h2>
                      )}
                    </div>
                    {(property.amenitiesDescription || property.amenities_description) && (
                      <div className="property-amenities-subtext" dangerouslySetInnerHTML={{ __html: property.amenitiesDescription || property.amenities_description }} />
                    )}
                  </div>

                  {/* 4-Column Luxury Amenities Grid */}
                  {amenitiesList.length > 0 && (
                    <div className="row g-3">
                      {amenitiesList.map((item, i) => (
                        <div className="col-lg-3 col-md-6 col-12" key={i}>
                          <div className="property-amenity-card">
                            <AmenityIcon name="common" className="icon-24" />
                            <div>
                              <h4 className="property-amenity-title">{item.title}</h4>
                              <p className="property-amenity-subtitle" dangerouslySetInnerHTML={{ __html: item.desc }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Things To Do / Experiences Section (admin-managed, shown below Amenities) */}
                {Array.isArray(property.experiences) && property.experiences.length > 0 && (
                  <div className="property-experiences-section mb-50 pb-20" data-aos="fade-up">
                    <div className="property-experiences-header d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
                      <div>
                        {Boolean(property.experiencesEyebrow || property.experiences_eyebrow) && (
                          <div className="property-amenities-eyebrow mb-2">
                            {property.experiencesEyebrow || property.experiences_eyebrow}
                          </div>
                        )}
                        <h2 className="property-amenities-heading property-experiences-heading mb-0">
                          {property.experiencesTitle || property.experiences_title || `Things to do at ${property.name || "this property"}`}
                        </h2>
                      </div>
                      {(property.experiencesDescription || property.experiences_description) && (
                        <div className="property-amenities-subtext" dangerouslySetInnerHTML={{ __html: property.experiencesDescription || property.experiences_description }} />
                      )}
                    </div>

                    <div className="row g-3 g-lg-4">
                      {property.experiences.map((exp, i) => (
                        <div className="col-lg-3 col-md-6 col-12" key={i}>
                          <div className="property-experience-card">
                            <div
                              className="property-experience-bg"
                              style={{ backgroundImage: `url(${resolveMediaUrl(exp.image)})` }}
                              role="img"
                              aria-label={exp.imageAlt || exp.title}
                            />
                            <div className="property-experience-gradient" />
                            <div className="property-experience-badge">
                              ✦ Experience 0{i + 1}
                            </div>
                            <div className="property-experience-arrow">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="property-experience-content">
                              <h4 className="property-experience-title">{exp.title}</h4>
                              {exp.subtitle && <p className="property-experience-subtitle" dangerouslySetInnerHTML={{ __html: exp.subtitle }} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full-Width Centered Photo & Video Media Showcase */}
                <div className="property-media-showcase-section">
                  {/* Photo Showcase Gallery */}
                  <div className="property-gallery-wrapper">
                    <div className="property-gallery-header text-center" data-aos="fade-up">
                      <span className="badge-luxury-tag">✦ EXPLORE GALLERY</span>
                      <h3 className="heading section-main-title">
                        🖼️ Photo Showcase ({galleryList.length} Photos)
                      </h3>
                      <p className="gallery-subtext text-muted small">
                        Click any photo for fullscreen HD lightbox view
                      </p>
                    </div>

                    {galleryList.length > 1 && galleryList.length <= 15 && (
                      <div className="gallery-nav-dots-wrapper gallery-nav-dots-top mb-3" data-aos="fade-up">
                        {galleryList.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`gallery-nav-dot${idx === galleryOffset ? " active" : ""}`}
                            onClick={() => slideGalleryTo(idx)}
                            aria-label={`Go to photo ${idx + 1}`}
                            title={`Photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {(() => {
                      const shiftedList = galleryList.map((_, i) => {
                        const originalIdx = (i + galleryOffset) % galleryList.length;
                        return {
                          img: galleryList[originalIdx],
                          originalIdx,
                        };
                      });

                      const mainItem = shiftedList[0];
                      const remainingItems = shiftedList.slice(1);

                      if (remainingItems.length === 0) {
                        return (
                          <div className={`property-gallery-bento property-gallery-bento-single${isGallerySliding ? " is-changing" : ""}`}>
                            {renderGalleryTile(mainItem.img, mainItem.originalIdx, 0)}
                          </div>
                        );
                      }

                      const visibleSide = remainingItems.slice(0, 4);
                      const extraCount = remainingItems.length > 4 ? remainingItems.length - 4 : 0;
                      const tile = (item, isLast) =>
                        renderGalleryTile(item.img, item.originalIdx, isLast ? extraCount : 0);

                      let sideContent;
                      if (visibleSide.length === 1) {
                        sideContent = tile(visibleSide[0], true);
                      } else if (visibleSide.length === 2) {
                        sideContent = visibleSide.map((item, sIdx) =>
                          tile(item, sIdx === visibleSide.length - 1)
                        );
                      } else if (visibleSide.length === 3) {
                        sideContent = (
                          <>
                            <div className="property-gallery-side-row">
                              {tile(visibleSide[0], false)}
                            </div>
                            <div className="property-gallery-side-row">
                              {tile(visibleSide[1], false)}
                              {tile(visibleSide[2], true)}
                            </div>
                          </>
                        );
                      } else {
                        sideContent = (
                          <>
                            <div className="property-gallery-side-row">
                              {tile(visibleSide[0], false)}
                              {tile(visibleSide[1], false)}
                            </div>
                            <div className="property-gallery-side-row">
                              {tile(visibleSide[2], false)}
                              {tile(visibleSide[3], true)}
                            </div>
                          </>
                        );
                      }

                      return (
                        <div className={`property-gallery-bento${isGallerySliding ? " is-changing" : ""}`}>
                          <div className="property-gallery-main-col">
                            {renderGalleryTile(mainItem.img, mainItem.originalIdx, 0)}
                          </div>
                          <div className="property-gallery-side-col">{sideContent}</div>
                        </div>
                      );
                    })()}

                    {/* Slide Navigation Buttons under Gallery */}
                    {galleryList.length > 1 && (
                      <div className="home-gallery-nav-wrapper text-center mt-4" data-aos="fade-up">
                        <div className="home-gallery-nav-bar">
                          <button
                            type="button"
                            className="gallery-nav-arrow-btn gallery-nav-prev"
                            onClick={handlePrevGallerySlide}
                            aria-label="Previous photos"
                            title="Previous photos"
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            className="gallery-nav-arrow-btn gallery-nav-next"
                            onClick={handleNextGallerySlide}
                            aria-label="Next photos"
                            title="Next photos"
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Video Tour Section */}
                  {videoList.length > 0 && (
                    <div className="property-video-wrapper text-center">
                      <div className="property-video-header text-center mb-4" data-aos="fade-up">
                        <span className="badge-luxury-tag">✦ IMMERSIVE VIDEO</span>
                        <h3 className="heading section-main-title text-center mb-0">
                          🎥 Video Tour Showcase {videoList.length > 1 ? `(${videoList.length} Videos)` : ""}
                        </h3>
                      </div>
                      <div className="row g-4 justify-content-center">
                        {videoList.map((vUrl, vIdx) => {
                          const resolvedVideo = resolveMediaUrl(vUrl);
                          const ytEmbed = getYouTubeEmbedUrl(vUrl);
                          return (
                            <div className={videoList.length === 1 ? "col-12" : "col-md-6 col-12"} key={vIdx} data-aos="fade-up">
                              <div
                                style={{
                                  width: "100%",
                                  aspectRatio: "16 / 9",
                                  maxHeight: "360px",
                                  borderRadius: "16px",
                                  overflow: "hidden",
                                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
                                  background: "#0F172A",
                                  position: "relative"
                                }}
                              >
                                {ytEmbed ? (
                                  <iframe
                                    loading="lazy"
                                    src={ytEmbed}
                                    title={`${property.name} Video Tour ${vIdx + 1}`}
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      border: "none",
                                      display: "block"
                                    }}
                                  ></iframe>
                                ) : (
                                  <video
                                    controls
                                    playsInline
                                    preload="metadata"
                                    poster={resolveMediaUrl(property.heroImage || galleryList[0])}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                      display: "block",
                                      background: "#000"
                                    }}
                                  >
                                    <source src={resolvedVideo} type="video/mp4" />
                                    <source src={resolvedVideo} type="video/webm" />
                                    Your browser does not support video playback.
                                  </video>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest Reviews Section (admin-managed) */}
                {Array.isArray(property.reviews) && property.reviews.length > 0 && (
                  <div className="property-reviews-section mb-50 pb-20" data-aos="fade-up">
                    <div className="property-reviews-header d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3">
                      <div>
                        <div className="property-amenities-eyebrow mb-2">
                          {property.reviewsEyebrow || property.reviews_eyebrow || "GUEST REVIEWS"}
                        </div>
                        <h2 className="property-reviews-heading mb-0">
                          {property.reviewsTitle || property.reviews_title || "Build trust with real guest experiences"}
                        </h2>
                      </div>
                      {(property.reviewsDescription || property.reviews_description) && (
                        <div className="property-amenities-subtext" dangerouslySetInnerHTML={{ __html: property.reviewsDescription || property.reviews_description }} />
                      )}
                    </div>

                    <div className="property-reviews-grid">
                      <div className="property-reviews-feedback-card">
                        <div className="property-reviews-stars">★★★★★</div>
                        <h3 className="property-reviews-feedback-title">
                          {property.reviewsCardTitle || property.reviews_card_title || "Guest feedback"}
                        </h3>
                        <p
                          className="property-reviews-feedback-desc"
                          dangerouslySetInnerHTML={{
                            __html:
                              property.reviewsCardDescription ||
                              property.reviews_card_description ||
                              "Real experiences shared by guests who've stayed with us.",
                          }}
                        />
                        <Link
                          to={property.reviewsCardButtonLink || property.reviews_card_button_link || "/contact"}
                          className="property-reviews-feedback-btn"
                        >
                          {property.reviewsCardButtonText || property.reviews_card_button_text || "Read Reviews"}
                        </Link>
                      </div>

                      <div className="property-reviews-cards">
                        {property.reviews.slice(0, 4).map((rev, i) => (
                          <div className="property-review-card" key={i}>
                            <div className="property-review-stars">
                              {"★".repeat(rev.rating)}
                              {"☆".repeat(5 - rev.rating)}
                            </div>
                            <p className="property-review-quote">"<span className="property-review-quote-inner" dangerouslySetInnerHTML={{ __html: rev.quote }} />"</p>
                            <div className="property-review-guest">{rev.guestName}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* FAQs Section (admin-managed) */}
                {Array.isArray(property.faqs) && property.faqs.length > 0 && (
                  <div className="property-faqs-section mb-50 pb-20" data-aos="fade-up">
                    <div className="property-faqs-header">
                      <div className="property-amenities-eyebrow mb-2">
                        {property.faqsEyebrow || property.faqs_eyebrow || "FAQs"}
                      </div>
                      <h2 className="property-faqs-heading mb-0">
                        {property.faqsTitle || property.faqs_title || "Frequently asked questions"}
                      </h2>
                      {(property.faqsDescription || property.faqs_description) && (
                        <p className="property-faqs-subtext mt-2 mb-0" dangerouslySetInnerHTML={{ __html: property.faqsDescription || property.faqs_description }} />
                      )}
                    </div>

                    <div className="property-faqs-list">
                      {property.faqs.map((faq, i) => {
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

                </div>
              </div>

              {/* INSTANT RESERVATION Sidebar Section (Commented out as requested by user) */}
              {/*
              <div className="col-lg-4 col-12">
              <div className="sidebar" id="reservation-desk" data-aos="fade-up">
                <div className="luxury-booking-sidebar">
                  <span className="booking-sidebar-tag">INSTANT RESERVATION</span>
                  <h3 className="booking-sidebar-title">Reserve Your Stay</h3>
                  <p className="booking-sidebar-desc">
                    Get in touch with our reservations desk for direct availability, group offers, and custom stay packages.
                  </p>

                  <div className="d-flex flex-column gap-3">
                    <Link to="/contact" className="btn-hero-primary text-center justify-content-center" aria-label="Enquire Now">
                      <span>Enquire Now</span>
                      <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Hi, I'd like to know more about ${property.name} (${property.location}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp-luxury justify-content-center text-center"
                      aria-label="Chat on WhatsApp"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  <div className="sidebar-perks-list">
                    <div className="sidebar-perk-item">
                      <span style={{ color: "#D9A752" }}>⚡</span> Instant Availability Confirmation
                    </div>
                    <div className="sidebar-perk-item">
                      <span style={{ color: "#D9A752" }}>🛡️</span> Wanderama Hospitality Guarantee
                    </div>
                    <div className="sidebar-perk-item">
                      <span style={{ color: "#D9A752" }}>☕</span> Complimentary Hospitality Perks
                    </div>
                  </div>

                  {(property.phone || property.address) && (
                    <div className="mt-20 pt-20 border-top text-start" style={{ fontSize: "13.5px" }}>
                      {property.phone && (
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span style={{ fontSize: "15px" }}>📞</span>
                          <a href={`tel:${property.phone}`} className="fw-600 text-decoration-none" style={{ color: "#0F172A" }}>
                            {property.phone}
                          </a>
                        </div>
                      )}
                      {property.address && (
                        <div className="d-flex align-items-start gap-2 text-muted" style={{ lineHeight: "1.5" }}>
                          <span style={{ fontSize: "15px", marginTop: "1px" }}>📍</span>
                          <span>{property.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            */}
          </div>

          {/* Property Location Map */}
          <div className="section-headings headings-width text-center mb-40" data-aos="fade-up">
            <div className="section-sub-tag text-center">FIND US</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              Location on the Map
            </h2>
            <p className="text-muted small mt-2 mb-0 text-center">
              Explore the route and reach {property.name || "this resort"} with ease
            </p>
          </div>
          <div className="row align-items-stretch property-map-with-text">
            <div className="col-lg-7 col-12 mb-4 mb-lg-0" data-aos="fade-up">
              <div className="luxury-map-wrapper m-0">
                <iframe
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    property.address || `${property.name}, ${property.location}, ${property.state}`
                  )}&output=embed`}
                  title={`${property.name} Location Map`}
                  width="100%"
                  height="340"
                  style={{ border: "0", display: "block" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="col-lg-5 col-12" data-aos="fade-up" data-aos-delay="60">
              <div className="property-map-info-card">
                <div>
                  <div className="property-map-info-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>EXACT DESTINATION</span>
                  </div>
                  <h3 className="property-map-info-title">{property.name}</h3>
                  <div className="property-map-info-address">
                    <span style={{ marginTop: "1px", display: "inline-flex" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <span>{property.address || `${property.location}, ${property.state}, India`}</span>
                  </div>

                  {aboutData.paragraphs && aboutData.paragraphs.length > 0 && (
                    <p className="property-map-info-desc">
                      {aboutData.paragraphs[0]}
                    </p>
                  )}
                </div>

                <div className="property-map-actions">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      property.address || `${property.name}, ${property.location}, ${property.state}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-map-directions"
                  >
                    <span>Get Directions</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  {property.phone && (
                    <a href={`tel:${property.phone}`} className="btn-map-call">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>Call Desk</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* You May Also Like Section */}
          <div className="related-properties-section mt-100">
            <div className="section-headings headings-width text-center mb-40">
              <div className="section-sub-tag text-center" data-aos="fade-up">MORE DESTINATIONS</div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                You May Also Like
              </h2>
            </div>
            <div className="row grid-gap">
              {related.map((p, i) => (
                <div className="col-lg-6 col-12 mb-4" key={p.slug}>
                  <PropertyCard property={p} delay={i * 50} />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="property-contact-section mt-100" data-aos="fade-up">
            <div className="section-headings headings-width text-center mb-40">
              <div className="section-sub-tag text-center">GET IN TOUCH</div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-12">
                <EnquiryForm
                  propertiesList={allProperties}
                  defaultPropertySlug={property.slug}
                  title="Contact Us"
                  subtitle={`Have a question about ${property.name}? Send us a message and our reservations team will get back to you shortly.`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LUXURY FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.94)",
            backdropFilter: "blur(14px)",
            zIndex: 100000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 15px",
            userSelect: "none",
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Header Controls */}
          <div
            className="w-100 d-flex align-items-center justify-content-between"
            style={{ maxWidth: "1200px", padding: "10px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  padding: "6px 18px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                📸 Photo {lightboxIndex + 1} of {galleryList.length}
              </span>
              <span className="text-white-50 small d-none d-md-inline">• {property.name}</span>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              aria-label="Close Lightbox"
            >
              ✕
            </button>
          </div>

          {/* Main Stage Display Area */}
          <div
            className="d-flex align-items-center justify-content-center w-100 position-relative"
            style={{ flex: 1, maxWidth: "1200px", margin: "10px 0" }}
            onClick={(e) => e.stopPropagation()}
          >
            {galleryList.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length)}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.25)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  width: "52px",
                  height: "52px",
                  fontSize: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
                }}
                aria-label="Previous Photo"
              >
                ‹
              </button>
            )}

            <div
              style={{
                maxHeight: "72vh",
                maxWidth: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 30px 70px rgba(0, 0, 0, 0.6)",
                background: "#000"
              }}
            >
              <img
                src={resolveMediaUrl(galleryList[lightboxIndex])}
                alt={`${property.name} ${lightboxIndex + 1}`}
                referrerPolicy="no-referrer"
                style={{
                  maxHeight: "72vh",
                  maxWidth: "100%",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto"
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/img/slider/hero-bg.jpg";
                }}
              />
            </div>

            {galleryList.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev + 1) % galleryList.length)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.25)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "50%",
                  width: "52px",
                  height: "52px",
                  fontSize: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
                }}
                aria-label="Next Photo"
              >
                ›
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Selector */}
          {galleryList.length > 1 && (
            <div
              className="d-flex align-items-center gap-2 p-2 rounded-4"
              style={{
                maxWidth: "92vw",
                overflowX: "auto",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {galleryList.map((thumb, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: lightboxIndex === idx ? "2.5px solid #D9A752" : "2px solid transparent",
                    opacity: lightboxIndex === idx ? 1 : 0.5,
                    transform: lightboxIndex === idx ? "scale(1.08)" : "scale(1)",
                    transition: "all 0.25s ease",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={resolveMediaUrl(thumb)}
                    alt="Thumbnail"
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/img/slider/hero-bg.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
