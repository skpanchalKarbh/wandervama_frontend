import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import PartnerForm from "../components/PartnerForm";
import AmenityIcon from "../components/AmenityIcon";
import PropertyCard from "../components/PropertyCard";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import useDragAutoScroll from "../hooks/useDragAutoScroll";
import { API_BASE_URL } from "../config/api";

const resolveImageUrl = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return url;
};

const defaultSettings = {
  eyebrow: "PARTNER WITH US",
  title: "Grow Your Property With Wanderama",
  description:
    "Own a resort, villa or hotel? Partner with Wanderama to reach more travellers, fill more rooms and run your property with hands-on hospitality support.",
  benefits: [
    { title: "Wider Guest Reach", desc: "Get discovered by travellers already booking Wanderama's other resorts and villas across India." },
    { title: "Hands-On Management Support", desc: "From listing photography to guest coordination, our team works alongside your on-ground staff." },
    { title: "Group & Corporate Bookings", desc: "Access weddings, corporate offsites and group travel demand that individual properties rarely see alone." },
    { title: "Transparent Partnership", desc: "Clear terms, regular payouts and a dedicated point of contact for every partner property." },
  ],
  services_eyebrow: "OUR EXPERTISE",
  services_title: "What We Do",
  services_description:
    "Hands-on hospitality support built for property owners who want occupancy, reputation and guest service that stands out.",
  services: [],
  why_eyebrow: "PARTNERSHIP BENEFITS",
  why_title: "Why Partner With Us",
  why_description: "What property owners ask first: track record and revenue. Everything else follows.",
  why_items: [],
  form_title: "Tell Us About Your Property",
  form_description: "Share a few details and our partnerships team will get back to you within 2 business days.",
};

export default function PartnerWithUs() {
  const [settings, setSettings] = useState(defaultSettings);
  const [propertiesList, setPropertiesList] = useState([]);

  const seo = usePageSeo("partner-with-us", {
    title: "Partner With Us",
    description: "List your resort, villa or hotel with Wanderama Hospitality and reach more travellers across India.",
  });

  const propertiesScroll = useDragAutoScroll(propertiesList.length);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/partner-settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings({
            ...defaultSettings,
            ...data.data,
            benefits: data.data.benefits?.length ? data.data.benefits : defaultSettings.benefits,
            services: data.data.services?.length ? data.data.services : defaultSettings.services,
            why_items: data.data.why_items?.length ? data.data.why_items : defaultSettings.why_items,
          });
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPropertiesList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />

      <PageBanner title="Partner With Us" current="Partner With Us" image={resolveImageUrl(settings.image)} imageAlt={settings.image_alt} />

      {settings.services && settings.services.length > 0 && (
        <div className="partner-services-section">
          <div className="container">
            <div className="section-headings headings-width text-center">
              <div className="section-sub-tag text-center" data-aos="fade-up">
                {settings.services_eyebrow}
              </div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                {settings.services_title}
              </h2>
              {settings.services_description && (
                <p className="section-body-text text-center mx-auto" style={{ maxWidth: "640px" }} data-aos="fade-up" data-aos-delay="60" dangerouslySetInnerHTML={{ __html: settings.services_description }} />
              )}
            </div>

            <div className="partner-services-grid">
              {settings.services.map((s, i) => (
                <div className={`partner-service-card${s.featured ? " is-featured" : ""}`} data-aos="fade-up" data-aos-delay={i * 50} key={i}>
                  <div className="partner-service-icon">
                    <AmenityIcon name={s.icon || "common"} className="icon-24" />
                  </div>
                  <h3 className="partner-service-title">{s.title}</h3>
                  {s.desc && <p className="partner-service-desc" dangerouslySetInnerHTML={{ __html: s.desc }} />}
                  {Array.isArray(s.items) && s.items.length > 0 && (
                    <>
                      <div className="partner-service-divider" />
                      <ul className="partner-service-items">
                        {s.items.map((item, idx) => (
                          <li key={idx}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {propertiesList.length > 0 && (
        <div className="partner-properties-section home-band-white" data-aos="fade-up">
          <div className="container">
            <div className="section-headings headings-width text-center">
              <div className="section-sub-tag text-center" data-aos="fade-up">OUR PROPERTIES</div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                Properties You Could Be Managing With Us
              </h2>
              <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
                A look at the resorts, villas and hotels already part of the Wanderama collection
              </p>
            </div>
            <div className="section-content">
              <div className="featured-properties-scroll" {...propertiesScroll}>
                {propertiesList.map((p, i) => (
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
      )}

      {settings.why_items && settings.why_items.length > 0 && (
        <div className="partner-why-section">
          <div className="container">
            <div className="section-headings headings-width text-center">
              <div className="section-sub-tag text-center" data-aos="fade-up">
                {settings.why_eyebrow}
              </div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                {settings.why_title}
              </h2>
              {settings.why_description && (
                <p className="section-body-text text-center mx-auto" style={{ maxWidth: "640px" }} data-aos="fade-up" data-aos-delay="60" dangerouslySetInnerHTML={{ __html: settings.why_description }} />
              )}
            </div>

            <div className="partner-why-grid">
              {settings.why_items.map((w, i) => (
                <div className="partner-why-card" data-aos="fade-up" data-aos-delay={i * 50} key={i}>
                  <div className="partner-why-icon">
                    <AmenityIcon name={w.icon || "common"} className="icon-24" />
                  </div>
                  <h3 className="partner-why-title">{w.title}</h3>
                  {w.desc && <p className="partner-why-desc" dangerouslySetInnerHTML={{ __html: w.desc }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="home-band-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <PartnerForm title={settings.form_title} subtitle={settings.form_description} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
