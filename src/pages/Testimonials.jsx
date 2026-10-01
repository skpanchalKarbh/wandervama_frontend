import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";
import PageBanner from "../components/PageBanner";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import { API_BASE_URL } from "../config/api";

const resolveAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return url;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const seo = usePageSeo("testimonials", {
    title: "Guest Testimonials",
    description: "Real feedback from families, couples and travellers who have stayed at Wanderama's hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh.",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTestimonials(data.data);
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

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />
      <PageBanner title="Guest Experiences" current="Testimonials" />

      {/* Testimonials Showcase Grid */}
      <div className="luxury-testimonials-section home-band-cream home-band-after-banner mb-100">
        <div className="container">
          <div className="section-headings headings-width text-center mb-50">
            <div className="section-sub-tag text-center" data-aos="fade-up">VERIFIED REVIEWS</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              What Our Guests Say
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "660px" }} data-aos="fade-up" data-aos-delay="60">
              Real feedback from families, couples, and travellers across our resorts and villas in Gujarat, Maharashtra, Rajasthan and Madhya Pradesh.
            </p>
          </div>
          <div className="section-content">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-5">
                <p className="text text-18">No guest reviews yet.</p>
              </div>
            ) : (
              <div className="row grid-gap">
                {testimonials.map((t, i) => (
                  <div
                    className="col-lg-4 col-md-6 col-12 mb-4"
                    data-aos="fade-up"
                    data-aos-delay={(i % 3) * 50}
                    key={t.id}
                  >
                    <div className="luxury-testimonial-card">
                      <div className="testimonial-card-top">
                        <div className="testimonial-quote-icon">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="#D9A752" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                          </svg>
                        </div>
                        <StarRating count={t.rating || 5} />
                      </div>
                      <div className="testimonial-stay-property">{t.stay_property}</div>
                      <p className="testimonial-quote-text">&ldquo;<span className="testimonial-quote-inner" dangerouslySetInnerHTML={{ __html: t.quote_text }} />&rdquo;</p>
                      <div className="testimonial-user-footer">
                        <img
                          src={resolveAvatarUrl(t.avatar_url)}
                          alt={t.avatar_alt || t.author_name}
                          loading="lazy" decoding="async"
                          className="testimonial-user-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.author_name)}&background=0564F2&color=FFFFFF`;
                          }}
                        />
                        <div className="testimonial-user-info">
                          <h4 className="testimonial-user-name">{t.author_name}</h4>
                          <span className="testimonial-user-place">{t.author_location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Luxury CTA */}
      <div className="luxury-cta-section mt-100 mb-100">
        <div className="container">
          <div className="luxury-cta-banner radius24 text-center">
            <div className="section-sub-tag text-center" style={{ color: "#D9A752" }} data-aos="fade-up">
              CREATE YOUR MEMORIES
            </div>
            <h2 className="heading section-main-title text-center" style={{ color: "#10372B" }} data-aos="fade-up" data-aos-delay="30">
              Ready to Create Your Own Wanderama Story?
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "660px", color: "#4A5568" }} data-aos="fade-up" data-aos-delay="60">
              Explore our resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh, or talk to our team for personalised recommendations.
            </p>
            <div className="cta-buttons-wrapper justify-content-center mt-35" data-aos="fade-up" data-aos-delay="100">
              <Link to="/properties" className="btn-hero-primary" aria-label="Explore Properties">
                <span>Explore Properties</span>
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
