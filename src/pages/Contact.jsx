import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import PropertyCard from "../components/PropertyCard";
import EnquiryForm from "../components/EnquiryForm";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import useDragAutoScroll from "../hooks/useDragAutoScroll";
import { API_BASE_URL } from "../config/api";

export default function Contact() {
  const [propertiesList, setPropertiesList] = useState([]);
  const [settings, setSettings] = useState(null);
  const seo = usePageSeo("contact", {
    title: "Contact Us",
    description: "Get in touch with Wanderama Hospitality's reservations desk for room availability, custom stay packages and instant reservations across our properties.",
  });
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setPropertiesList(data.data);
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setSettings(data.data);
      })
      .catch(() => {});
  }, []);

  const whatsappNumber = (settings?.whatsapp_number || "910000000000").replace(/[^0-9]/g, "");
  const phoneNumbers = settings?.phone_numbers || [];
  const emails = settings?.emails || [];
  const propertiesScroll = useDragAutoScroll(propertiesList.length);

  const mapAddress = settings?.address || "Ahmedabad, Gujarat, India";
  const mapEmbedUrl = settings?.map_embed_url || `https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />
      <PageBanner title="Contact Us" current="Contact" />

      <div className="contact-page">
        {/* Section 1: Hero Contact Info & Form */}
        <div className="contact-hero-section home-band-white home-band-after-banner" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
          <div className="container">
            <div className="row grid-gap contact-row-stretch">
              {/* Left Info Column */}
              <div className="col-lg-5 col-12 mb-4 mb-lg-0 contact-col-left">
                <div className="contact-content-left pe-lg-4">
                  <div className="contact-intro-block">
                    <div className="d-flex align-items-center gap-2 mb-15" data-aos="fade-up">
                      <span className="contact-concierge-pill">
                        <span className="pulse-dot"></span>
                        24x7 Concierge Desk
                      </span>
                    </div>

                    <h2
                      className="heading section-main-title mb-20"
                      data-aos="fade-up"
                      data-aos-delay="30"
                      style={{ fontSize: "38px", fontWeight: "800", textAlign: "left", color: "#0F172A", letterSpacing: "-0.5px", lineHeight: "1.2" }}
                    >
                      Let's Plan Your <span className="text-gold-gradient">Luxury Stay</span>
                    </h2>

                    <p
                      className="section-body-text mb-30"
                      data-aos="fade-up"
                      data-aos-delay="60"
                      style={{ textAlign: "left", fontSize: "16px", color: "#475569", lineHeight: "1.7" }}
                    >
                      Planning a trip to Gujarat, Maharashtra, Rajasthan, or Madhya Pradesh? Our hospitality desk is ready to assist you with room availability, custom stay packages, and instant reservations.
                    </p>
                  </div>

                  {/* Contact Info Card */}
                  <div className="luxury-contact-info-card" data-aos="fade-up" data-aos-delay="80">
                    <div className="contact-cards-stack">
                      {phoneNumbers.length > 0 && (
                        <div className="luxury-contact-card" data-aos="fade-up" data-aos-delay="100">
                          <div className="contact-icon-box">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="contact-card-title">Reservations Helpline</div>
                            {phoneNumbers.map((num, i) => (
                              <a href={`tel:${num.replace(/\s+/g, "")}`} className="contact-card-value contact-card-link" key={`phone-${i}`}>
                                <span>{num}</span>
                                <span className="contact-action-hint">Call ↗</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {emails.length > 0 && (
                        <div className="luxury-contact-card" data-aos="fade-up" data-aos-delay="150">
                          <div className="contact-icon-box">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="contact-card-title">Email Enquiries</div>
                            {emails.map((email, i) => (
                              <a href={`mailto:${email}`} className="contact-card-value contact-card-link" key={`email-${i}`}>
                                <span>{email}</span>
                                <span className="contact-action-hint">Write ↗</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {settings?.address && (
                        <div className="luxury-contact-card" data-aos="fade-up" data-aos-delay="200">
                          <div className="contact-icon-box">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="contact-card-title">Headquarters</div>
                            <a href="#wanderama-map" className="contact-card-value contact-card-link" style={{ display: "block" }}>
                              <span>{settings.address}</span>
                              <span className="contact-action-hint" style={{ opacity: 1, color: "#D9A752", fontWeight: 700, marginTop: "4px" }}>
                                View on Map ↓
                              </span>
                            </a>
                          </div>
                        </div>
                      )}

                      {(settings?.working_hours || settings?.working_days) && (
                        <div className="luxury-contact-card" data-aos="fade-up" data-aos-delay="250">
                          <div className="contact-icon-box">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="contact-card-title">Desk Hours</div>
                            <div className="contact-card-value">
                              {settings.working_hours}
                              {settings.working_hours && settings.working_days && ", "}
                              {settings.working_days}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form Column */}
              <div className="col-lg-7 col-12 contact-col-right">
                <div className="contact-form-sticky-wrap">
                  <EnquiryForm propertiesList={propertiesList} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Our Properties */}
        {propertiesList.length > 0 && (
          <div className="contact-properties-section home-band-cream" data-aos="fade-up">
            <div className="container">
              <div className="section-headings headings-width text-center">
                <div className="section-sub-tag text-center" data-aos="fade-up">OUR PROPERTIES</div>
                <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                  Explore Where You Could Stay
                </h2>
                <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
                  Browse our resorts, villas and hotels while you wait to hear back from us
                </p>
              </div>
              <div className="section-content">
                <div className="featured-properties-scroll" {...propertiesScroll}>
                  {propertiesList.map((p, i) => (
                    <div className="featured-property-item contact-property-item" key={p.slug}>
                      <PropertyCard
                        property={p}
                        delay={i * 50}
                        variant="contact"
                        fallbackPhone={phoneNumbers[0] || "+91 81417 20522"}
                      />
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

        {/* Section 3: Interactive Google Map Band */}
        <div className="contact-map-section home-band-white" id="wanderama-map" style={{ paddingTop: "80px", paddingBottom: "90px" }}>
          <div className="container">
            <div className="section-headings text-center mb-40" data-aos="fade-up">
              <div className="section-sub-tag text-center">OUR LOCATION</div>
              <h2 className="heading section-main-title text-center" style={{ fontSize: "32px", fontWeight: "800" }}>
                Find Us in Ahmedabad
              </h2>
              <p className="section-body-text text-center mx-auto" style={{ maxWidth: "580px", fontSize: "15px", color: "#64748B" }}>
                Visit Wanderama Hospitality headquarters or reach out directly to our reservations team.
              </p>
            </div>
            <div className="luxury-map-wrapper" data-aos="fade-up" data-aos-delay="40">
              <iframe
                src={mapEmbedUrl}
                title="Wanderama Headquarters Location Map"
                width="100%"
                height="450"
                style={{ border: "0", display: "block" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="text-center mt-3" data-aos="fade-up" data-aos-delay="60">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-link"
                style={{ fontSize: "14.5px", fontWeight: "700", color: "#D9A752", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Open Pin Location & Get Directions on Google Maps ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
