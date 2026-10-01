import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import PropertyCard from "../components/PropertyCard";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import { API_BASE_URL } from "../config/api";

export default function Properties() {
  const [activeState, setActiveState] = useState("All");
  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const seo = usePageSeo("properties", {
    title: "Our Properties",
    description: "Browse handpicked hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh — filter by state and find your ideal Wanderama stay.",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPropertiesList(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const availableStates = ["All", ...new Set(propertiesList.map((p) => p.state).filter(Boolean))];

  const filtered =
    activeState === "All" ? propertiesList : propertiesList.filter((p) => p.state === activeState);

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />
      <PageBanner title="Our Properties" current="Properties" />

      <div className="blog blog-list home-band-cream home-band-after-banner">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <h2 className="heading text-50" data-aos="fade-up">Luxury Stays Across Destination States</h2>
            <div className="text text-18" data-aos="fade-up" data-aos-delay="50">
              Handpicked luxury hotels, resorts and villas across India
            </div>
          </div>

          <div className="tab-buttons d-flex flex-wrap justify-content-center gap-2 mb-40" data-aos="fade-up" data-aos-delay="100">
            {availableStates.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() => setActiveState(state)}
                className={`button button--slim ${
                  activeState === state ? "button--primary" : "button--secondary"
                }`}
              >
                {state}
              </button>
            ))}
          </div>

          <div className="section-content">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <p className="text text-18">No properties found.</p>
              </div>
            ) : (
              <div className="row grid-gap">
                {filtered.map((p, i) => (
                  <div className="col-lg-6 col-12" key={p.slug || p.id || i}>
                    <PropertyCard property={p} delay={i * 50} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="subscribe-2" style={{ marginTop: "80px", marginBottom: "90px", paddingTop: "20px", paddingBottom: "20px" }}>
        <div className="container">
          <div className="luxury-cta-card text-center">
            <div className="cta-sub-tag">PERSONALIZED HOSPITALITY</div>
            <h2 className="heading cta-title">Can't Decide Which Property Fits You?</h2>
            <p className="text cta-text">
              Tell us your travel dates and group size — we'll recommend the right stay.
            </p>
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
              <Link
                to="/contact"
                className="btn-cta-blue"
                aria-label="Contact Us"
              >
                <span>Enquire Now</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="btn-cta-whatsapp"
                aria-label="Chat on WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.149 4.201 4.292-1.127z"/>
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
