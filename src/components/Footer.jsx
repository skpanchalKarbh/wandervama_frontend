import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { properties } from "../data/properties";
import Logo from "./Logo";
import { API_BASE_URL } from "../config/api";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
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
  const emails = settings?.emails || [];
  const phoneNumbers = settings?.phone_numbers || [];

  return (
    <footer className="luxury-footer">
      <div className="footer-main">
        <div className="footer-top">
          <div className="container">
            <div className="footer-header-bar" data-aos="fade-up">
              <Link className="footer-brand-logo" to="/" aria-label="Wanderama Hospitality">
                <Logo height={68} variant="white" />
              </Link>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="footer-call-box" aria-label="Concierge Support">
                <div className="call-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D9A752" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="call-info">
                  <span className="call-subtext">Need assistance?</span>
                  <span className="call-number">Talk To Concierge Desk</span>
                </div>
              </a>
            </div>

            <div className="footer-divider-gold"></div>

            <div className="row grid-gap pt-15">
              {/* Col 1: Contact & Social */}
              <div className="col-12 col-md-6 col-lg-4">
                <div className="footer-widget">
                  <h4 className="luxury-footer-title" data-aos="fade-up">Contact Us</h4>
                  <ul className="footer-contact-list list-unstyled">
                    {settings?.address && (
                      <li className="footer-contact-item" data-aos="fade-up">
                        <span className="contact-icon contact-icon-svg">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                        </span>
                        <span className="contact-text">{settings.address}</span>
                      </li>
                    )}
                    {(settings?.working_hours || settings?.working_days) && (
                      <li className="footer-contact-item" data-aos="fade-up" data-aos-delay="50">
                        <span className="contact-icon">🕒</span>
                        <span className="contact-text">
                          {settings.working_hours && `Hours: ${settings.working_hours}`}
                          {settings.working_hours && settings.working_days && ", "}
                          {settings.working_days}
                        </span>
                      </li>
                    )}
                    {phoneNumbers.map((num, i) => (
                      <li className="footer-contact-item" data-aos="fade-up" data-aos-delay={100 + i * 50} key={`phone-${i}`}>
                        <a href={`tel:${num.replace(/\s+/g, "")}`} className="contact-link">
                          <span className="contact-icon contact-icon-svg">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </span>
                          <span className="contact-text">{num}</span>
                        </a>
                      </li>
                    ))}
                    {emails.map((email, i) => (
                      <li className="footer-contact-item" data-aos="fade-up" data-aos-delay={150 + i * 50} key={`email-${i}`}>
                        <a href={`mailto:${email}`} className="contact-link">
                          <span className="contact-icon contact-icon-svg">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="contact-text">{email}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="footer-social-wrap mt-20" data-aos="fade-up" data-aos-delay="150">
                    <span className="social-tag">Follow Our Story</span>
                    <div className="social-icons-row">
                      {settings?.instagram_url && (
                        <a className="social-circle-btn" href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </a>
                      )}
                      {settings?.facebook_url && (
                        <a className="social-circle-btn" href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                        </a>
                      )}
                      {settings?.linkedin_url && (
                        <a className="social-circle-btn" href={settings.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2: Quick Links */}
              <div className="col-12 col-md-6 col-lg-3">
                <div className="footer-widget">
                  <h4 className="luxury-footer-title" data-aos="fade-up">Quick Links</h4>
                  <ul className="luxury-footer-links list-unstyled">
                    <li data-aos="fade-up" data-aos-delay="50">
                      <Link to="/about"><span className="link-arrow">›</span> About Us</Link>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="100">
                      <Link to="/amenities"><span className="link-arrow">›</span> Amenities & Facilities</Link>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="150">
                      <Link to="/gallery"><span className="link-arrow">›</span> Photo Gallery</Link>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="200">
                      <Link to="/testimonials"><span className="link-arrow">›</span> Guest Testimonials</Link>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="225">
                      <Link to="/blog"><span className="link-arrow">›</span> Blog</Link>
                    </li>
                    <li data-aos="fade-up" data-aos-delay="250">
                      <Link to="/contact"><span className="link-arrow">›</span> Contact & Location</Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Col 3: Resorts & Stays */}
              <div className="col-12 col-md-12 col-lg-5">
                <div className="footer-widget">
                  <h4 className="luxury-footer-title" data-aos="fade-up">Our Resorts & Stays</h4>
                  <div className="properties-grid-links">
                    {properties.slice(0, 6).map((p, i) => (
                      <Link to={`/properties/${p.slug}`} key={p.slug} className="property-footer-pill" data-aos="fade-up" data-aos-delay={i * 40}>
                        <span className="pill-dot"></span>
                        <span className="pill-name">{p.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="all-properties-link-wrapper mt-15" data-aos="fade-up" data-aos-delay="250">
                    <Link to="/properties" className="all-properties-gold-link">
                      <span>View All Resorts & Getaways</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-bar">
          <div className="container">
            <div className="bottom-bar-flex">
              <div className="footer-copyright">
                © {new Date().getFullYear()} <span className="gold-accent-text">Wanderama Hospitality LLP</span>. All rights reserved.
              </div>
              <div className="footer-legal-links">
                <Link to="/contact">Privacy Policy</Link>
                <span className="sep">•</span>
                <Link to="/contact">Terms of Service</Link>
                <span className="sep">•</span>
                <Link to="/contact">Cancellation Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
