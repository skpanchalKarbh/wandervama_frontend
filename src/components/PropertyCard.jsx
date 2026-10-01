import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const resolveImageUrl = (url) => {
  if (!url) return "/assets/img/slider/hero-bg.jpg";
  if (typeof url !== "string") {
    if (Array.isArray(url) && url.length > 0 && typeof url[0] === "string") {
      url = url[0];
    } else {
      return "/assets/img/slider/hero-bg.jpg";
    }
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

export default function PropertyCard({
  property,
  delay = 0,
  variant = "default",
  fallbackPhone = "+91 81417 20522",
}) {
  if (!property) return null;

  // The card/listing image is the dedicated "main image" (thumbImage), kept
  // independent from the hero banner image shown on the property's own page
  // (PropertyDetails.jsx uses heroImage exclusively). Falls back to heroImage
  // only for older properties that were never given a separate main image.
  const imgSrc = resolveImageUrl(property.thumbImage || property.heroImage || property.thumb);

  // Variant for Contact Us page: shows only Image, Name, Address, Mobile No, and Explore properties button
  if (variant === "contact") {
    const displayAddress =
      property.address && property.address.trim()
        ? property.address
        : `${property.location || "Gujarat"}, ${property.state || "India"}`;

    const displayPhone =
      property.phone && property.phone.trim()
        ? property.phone
        : property.mobile_no && property.mobile_no.trim()
        ? property.mobile_no
        : fallbackPhone;

    return (
      <div className="luxury-property-card contact-property-card">
        <div className="property-card-image-wrap">
          <img
            src={imgSrc}
            width="734"
            height="534"
            loading="lazy" decoding="async"
            alt={property.thumbImageAlt || property.heroImageAlt || property.name || "Property"}
            className="property-card-img"
            onError={(e) => {
              e.target.src = "/assets/img/slider/hero-bg.jpg";
            }}
          />
        </div>
        <div className="property-card-content">
          <Link
            to={`/properties/${property.slug || property.id}`}
            className="property-card-title-link"
            aria-label={property.name}
          >
            <h3 className="property-card-title">{property.name}</h3>
          </Link>

          {/* Property Address */}
          <div className="property-card-contact-address">
            <span style={{ color: "#D9A752", lineHeight: "1", flexShrink: 0, marginTop: "2px", display: "inline-flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span>{displayAddress}</span>
          </div>

          {/* Mobile / Phone Number */}
          <div className="property-card-contact-phone">
            <span style={{ color: "#D9A752", flexShrink: 0, display: "inline-flex" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <a
              href={`tel:${displayPhone.replace(/[^0-9+]/g, "")}`}
            >
              {displayPhone}
            </a>
          </div>

          {/* Explore Properties Button */}
          <div className="property-card-footer">
            <Link
              to={`/properties/${property.slug || property.id}`}
              className="property-card-btn"
              aria-label={`Explore ${property.name}`}
            >
              <span>Explore Properties</span>
              <svg className="card-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rawBadges = property.badges;
  const badgesList = Array.isArray(rawBadges)
    ? rawBadges
    : (typeof rawBadges === "string" && rawBadges.trim()
        ? (rawBadges.startsWith("[")
            ? (() => { try { return JSON.parse(rawBadges); } catch (e) { return rawBadges.split(",").map(s => s.trim()).filter(Boolean); } })()
            : rawBadges.split(",").map(s => s.trim()).filter(Boolean))
        : []);

  return (
    <div
      className="luxury-property-card"
    >
      <div className="property-card-image-wrap">
        <img
          src={imgSrc}
          width="734"
          height="534"
          loading="lazy" decoding="async"
          alt={property.thumbImageAlt || property.heroImageAlt || property.name || "Property"}
          className="property-card-img"
          onError={(e) => {
            e.target.src = "/assets/img/slider/hero-bg.jpg";
          }}
        />
        <span className="property-card-type-badge">{property.type || "Resort"}</span>
      </div>
      <div className="property-card-content">
        <div className="property-card-location">
          <svg className="location-pin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span>{property.location || "Gujarat"}, {property.state || "India"}</span>
        </div>
        <Link
          to={`/properties/${property.slug || property.id}`}
          className="property-card-title-link"
          aria-label={property.name}
        >
          <h3 className="property-card-title">{property.name}</h3>
        </Link>
        <p className="property-card-tagline">{property.tagline || property.description}</p>

        {badgesList.length > 0 && (
          <div className="property-card-badges-row">
            {badgesList.slice(0, 4).map((badge, idx) => (
              <span key={idx} className="property-card-pill-tag">
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="property-card-footer">
          <Link
            to={`/properties/${property.slug || property.id}`}
            className="property-card-btn"
            aria-label={`Explore ${property.name}`}
          >
            <span>Explore Property</span>
            <svg className="card-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
