import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import EnquiryForm from "../components/EnquiryForm";
import usePageSeo from "../hooks/usePageSeo";
import { API_BASE_URL } from "../config/api";

const defaultWeddingHero = {
  image: "/assets/img/banner/bg-11.jpg",
  eyebrow: "WEDDINGS & EVENTS",
  title: "Celebrate Your Big Moments, The Wanderama Way",
  description:
    "Bring your people together for a destination celebration, private gathering or memorable event. Wanderama helps you plan the stay, venue experience, food, activities and guest journey around the occasion.",
  btn1_text: "Plan Your Event",
  btn1_link: "/contact",
  btn2_text: "Explore Event Venues",
  btn2_link: "/properties",
  disclaimer: "Venue capacity, menus, decor, availability and pricing are confirmed individually for each event.",
  about_image: "/assets/img/testimonial/1.jpg",
  about_eyebrow: "MORE THAN A VENUE",
  about_title: "Your Event Is Also A Guest Experience",
  about_description:
    "A successful destination event is not only about the main function. It is about what guests see, where they stay, what they eat, what they do between events and how easy the entire trip feels.",
  about_features: [
    "Guest accommodation planning",
    "Event and celebration space discussions",
    "Meal and dining coordination",
    "Activities and entertainment options",
    "Group movement and itinerary planning",
    "Pre-event and post-event stay experiences",
  ],
  about_button_text: "Discuss Your Requirements",
  about_button_link: "/contact",
  plan_options_title: "Event Planning Options",
  plan_options_description: "Use these as starting points. Every event can be tailored after we understand your guest profile and requirements.",
  faqs_title: "Frequently Asked Questions",
  faqs_description: "",
};

const defaultWeddingFaqs = [
  {
    id: "default-1",
    question: "How far in advance should we book an event?",
    answer: "We recommend booking at least 2-3 months ahead for weddings and larger group events, and 2-3 weeks for smaller celebrations, so we can confirm the venue, catering and decor you want.",
  },
  {
    id: "default-2",
    question: "Can you accommodate our guests overnight?",
    answer: "Yes, most of our properties combine an event space with on-site rooms or cottages, so your guests can stay, eat and celebrate all in one place.",
  },
  {
    id: "default-3",
    question: "Do you handle catering and decor in-house?",
    answer: "Yes, our on-site team manages catering, decor and event logistics directly, so you don't have to coordinate multiple outside vendors.",
  },
  {
    id: "default-4",
    question: "Is the venue and pricing customised per event?",
    answer: "Yes, venue capacity, menus, decor, availability and pricing are confirmed individually once we understand your guest count, dates and requirements.",
  },
];

const defaultPlanOptions = [
  {
    id: "default-1",
    eyebrow: "FOR COUPLES",
    title: "Wedding Getaway",
    description: "A destination celebration concept combining guest stays, event moments and local experiences.",
    bullets: ["Guest stay planning", "Event requirement discussion", "Dining coordination", "Activity options"],
    button_text: "Enquire",
    button_link: "/contact",
    featured: false,
  },
  {
    id: "default-2",
    eyebrow: "FOR FAMILIES",
    title: "Celebration Weekend",
    description: "A relaxed weekend built around a birthday, anniversary, reunion or milestone.",
    bullets: ["Accommodation", "Celebration space discussion", "Meals and refreshments", "Group activities"],
    button_text: "Plan Your Weekend",
    button_link: "/contact",
    featured: true,
  },
  {
    id: "default-3",
    eyebrow: "FOR GROUPS",
    title: "Private Group Event",
    description: "Build a private event experience around your group's purpose, schedule and destination.",
    bullets: ["Group accommodation", "Event planning discussion", "Activities and entertainment", "Itinerary coordination"],
    button_text: "Discuss Your Group",
    button_link: "/contact",
    featured: false,
  },
];

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return url;
};

const offerings = [
  {
    title: "Banquet Lawns & Halls",
    desc: "Open-air lawns and indoor banquet spaces sized for intimate ceremonies or large baraats.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" />
      </svg>
    ),
  },
  {
    title: "Custom Catering",
    desc: "Multi-cuisine menus, live counters and regional thalis tailored to your guest list.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    title: "Decor & Styling",
    desc: "Themed mandap, stage and lighting setups designed around your colour palette.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" /><path d="m6.4 6.4 2.8 2.8" /><path d="M2 13h4" /><path d="m6.4 19.6 2.8-2.8" /><circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    title: "Dedicated Event Manager",
    desc: "One point of contact who plans the day with you and runs it on-site, start to finish.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" />
      </svg>
    ),
  },
];

export default function WeddingEvents() {
  const [eventPhotos, setEventPhotos] = useState([]);
  const [galleryOffset, setGalleryOffset] = useState(0);
  const [isGallerySliding, setIsGallerySliding] = useState(false);
  const [weddingHero, setWeddingHero] = useState(defaultWeddingHero);
  const [planOptions, setPlanOptions] = useState(defaultPlanOptions);
  const [weddingFaqs, setWeddingFaqs] = useState(defaultWeddingFaqs);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [propertiesList, setPropertiesList] = useState([]);
  const seo = usePageSeo("weddings-events", {
    title: "Weddings & Events",
    description: "Host weddings, get-togethers and celebrations at Wanderama's resorts and villas — banquet lawns, custom catering, decor and a dedicated event manager.",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/wedding-hero`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const merged = { ...defaultWeddingHero };
          Object.keys(defaultWeddingHero).forEach((key) => {
            const value = data.data[key];
            const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);
            if (hasValue) merged[key] = value;
          });
          setWeddingHero(merged);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/event-plan-options`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPlanOptions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/wedding-faqs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setWeddingFaqs(data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPropertiesList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setEventPhotos(data.data.filter((item) => item.category === "events" && item.type === "image"));
        }
      })
      .catch(() => {});
  }, []);

  const slideGalleryTo = (newOffset) => {
    if (isGallerySliding) return;
    setIsGallerySliding(true);
    setTimeout(() => {
      setGalleryOffset(newOffset);
      setIsGallerySliding(false);
    }, 150);
  };

  const handlePrevGallerySlide = () => {
    if (!eventPhotos.length) return;
    slideGalleryTo((galleryOffset - 1 + eventPhotos.length) % eventPhotos.length);
  };

  const handleNextGallerySlide = () => {
    if (!eventPhotos.length) return;
    slideGalleryTo((galleryOffset + 1) % eventPhotos.length);
  };

  const renderEventGalleryTile = (img) => (
    <a
      href={resolveImageUrl(img.url)}
      data-fancybox="wedding-events-gallery"
      className="wedding-gallery-tile"
      aria-label="View event photo"
      key={img.id}
    >
      <img
        src={resolveImageUrl(img.url)}
        loading="lazy" decoding="async"
        alt={img.title || "Wanderama event"}
        className="gallery-card-img"
      />
      <div className="gallery-card-overlay"></div>
      <div className="gallery-card-zoom-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </a>
  );

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />

      {/* Weddings & Events Hero (admin-managed) */}
      <div
        className="wedding-hero-section"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(9, 14, 12, 0.85) 0%, rgba(9, 14, 12, 0.35) 55%, rgba(9, 14, 12, 0.15) 100%), url(${resolveImageUrl(weddingHero.image)})`,
        }}
      >
        <div className="container">
          <div className="wedding-hero-content" data-aos="fade-up">
            <div className="wedding-hero-eyebrow">{weddingHero.eyebrow}</div>
            <h1 className="wedding-hero-title">{weddingHero.title}</h1>
            <p className="wedding-hero-desc" dangerouslySetInnerHTML={{ __html: weddingHero.description }} />
            <div className="wedding-hero-buttons">
              <Link to={weddingHero.btn1_link || "/contact"} className="btn-hero-action-gold">
                <span>{weddingHero.btn1_text}</span>
              </Link>
              <Link to={weddingHero.btn2_link || "/properties"} className="btn-hero-action-outline">
                <span>{weddingHero.btn2_text}</span>
              </Link>
            </div>
            {weddingHero.disclaimer && (
              <p className="wedding-hero-disclaimer">{weddingHero.disclaimer}</p>
            )}
          </div>
        </div>
      </div>

      {/* Introduction / Guest Experience (admin-managed) */}
      <div className="image-text text-first image-text-about mt-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6 col-12 mb-4 mb-lg-0">
              <div className="image-wrap luxury-about-image-wrap">
                <div className="image" data-aos="fade-right">
                  <img
                    src={resolveImageUrl(weddingHero.about_image)}
                    width="992"
                    height="1208"
                    loading="lazy" decoding="async"
                    alt={weddingHero.about_image_alt || "Wanderama guest experience"}
                    className="luxury-about-main-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultWeddingHero.about_image;
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 col-12">
              <div className="content about-content-wrapper pl-lg-30">
                <div className="section-sub-tag" data-aos="fade-up">{weddingHero.about_eyebrow}</div>
                <h2 className="heading section-main-title" data-aos="fade-up" data-aos-delay="30">
                  {weddingHero.about_title}
                </h2>
                <div
                  className="section-body-text"
                  data-aos="fade-up"
                  data-aos-delay="60"
                  dangerouslySetInnerHTML={{ __html: weddingHero.about_description }}
                />
                {Array.isArray(weddingHero.about_features) && weddingHero.about_features.length > 0 && (
                  <div className="wedding-about-checklist" data-aos="fade-up" data-aos-delay="90">
                    {weddingHero.about_features.map((f, i) => (
                      <div className="wedding-about-checklist-item" key={i}>
                        <div className="wedding-about-check-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <span className="wedding-about-check-text">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="about-cta-wrapper mt-30" data-aos="fade-up" data-aos-delay="150">
                  <Link to={weddingHero.about_button_link || "/contact"} className="btn-map-directions" style={{ flex: "0 0 auto" }} aria-label={weddingHero.about_button_text}>
                    <span>{weddingHero.about_button_text}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Planning Options (admin-managed) */}
      {planOptions.length > 0 && (
        <div className="container mt-100">
          <div className="mb-40">
            <h2 className="heading section-main-title mb-0" data-aos="fade-up">
              {weddingHero.plan_options_title}
            </h2>
          </div>
          <div className="row g-4">
            {planOptions.map((option, i) => (
              <div className="col-lg-4 col-md-6 col-12" data-aos="fade-up" data-aos-delay={i * 50} key={option.id}>
                <div className={`plan-option-card ${option.featured ? "plan-option-card-featured" : ""}`}>
                  <div className="plan-option-eyebrow">{option.eyebrow}</div>
                  <h3 className="plan-option-title">{option.title}</h3>
                  <p className="plan-option-desc" dangerouslySetInnerHTML={{ __html: option.description }} />
                  {Array.isArray(option.bullets) && option.bullets.length > 0 && (
                    <ul className="plan-option-bullets">
                      {option.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {option.button_text && (
                    <Link
                      to={option.button_link || "/contact"}
                      className={option.featured ? "plan-option-btn plan-option-btn-solid" : "plan-option-btn plan-option-btn-outline"}
                    >
                      <span>{option.button_text}</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What We Offer */}
      <div className="luxury-amenities-section home-band-cream mt-100 mb-100">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <div className="section-sub-tag text-center" data-aos="fade-up">WHAT WE OFFER</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              Everything An Event Needs, On-Site
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "660px" }} data-aos="fade-up" data-aos-delay="60">
              A single team handles the space, the food and the styling, so you only have one number to call
            </p>
          </div>
          <div className="section-content mt-50">
            <div className="row grid-gap">
              {offerings.map((o, i) => (
                <div className="col-lg-3 col-md-6 col-12 mb-4" data-aos="fade-up" data-aos-delay={i * 50} key={o.title}>
                  <div className="amenity-card-luxury">
                    <div className="amenity-icon-badge">{o.icon}</div>
                    <div className="amenity-card-body">
                      <h3 className="amenity-card-title">{o.title}</h3>
                      <p className="amenity-card-desc">{o.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Gallery Preview */}
      {eventPhotos.length > 0 && (
        <div className="luxury-gallery-section home-band-white mt-100 mb-100">
          <div className="container">
            <div className="section-headings headings-width text-center">
              <div className="section-sub-tag text-center" data-aos="fade-up">FROM PAST CELEBRATIONS</div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                A Glimpse Of Events We've Hosted
              </h2>
            </div>
            {eventPhotos.length > 1 && eventPhotos.length <= 15 && (
              <div className="gallery-nav-dots-wrapper gallery-nav-dots-top mb-30" data-aos="fade-up">
                {eventPhotos.map((_, idx) => (
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
              const shifted = eventPhotos.map((_, i) => eventPhotos[(i + galleryOffset) % eventPhotos.length]);
              const remaining = shifted.slice(1);
              if (remaining.length === 0) {
                return (
                  <div className={`wedding-gallery-bento wedding-gallery-bento-single${isGallerySliding ? " is-changing" : ""}`}>
                    {renderEventGalleryTile(shifted[0])}
                  </div>
                );
              }
              const visibleSide = remaining.slice(0, 4);

              let sideContent;
              if (visibleSide.length === 1) {
                sideContent = renderEventGalleryTile(visibleSide[0]);
              } else if (visibleSide.length === 2) {
                sideContent = visibleSide.map((img) => renderEventGalleryTile(img));
              } else if (visibleSide.length === 3) {
                sideContent = (
                  <>
                    <div className="wedding-gallery-side-row">
                      {renderEventGalleryTile(visibleSide[0])}
                    </div>
                    <div className="wedding-gallery-side-row">
                      {renderEventGalleryTile(visibleSide[1])}
                      {renderEventGalleryTile(visibleSide[2])}
                    </div>
                  </>
                );
              } else {
                sideContent = (
                  <>
                    <div className="wedding-gallery-side-row">
                      {renderEventGalleryTile(visibleSide[0])}
                      {renderEventGalleryTile(visibleSide[1])}
                    </div>
                    <div className="wedding-gallery-side-row">
                      {renderEventGalleryTile(visibleSide[2])}
                      {renderEventGalleryTile(visibleSide[3])}
                    </div>
                  </>
                );
              }

              return (
                <div className={`wedding-gallery-bento${isGallerySliding ? " is-changing" : ""}`} data-aos="fade-up">
                  <div className="wedding-gallery-main-col">
                    {renderEventGalleryTile(shifted[0])}
                  </div>
                  <div className="wedding-gallery-side-col">{sideContent}</div>
                </div>
              );
            })()}
            {eventPhotos.length > 1 && (
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
        </div>
      )}

      {/* FAQs (admin-managed) */}
      {weddingFaqs.length > 0 && (
        <div className="container mt-100 mb-100">
          <div className="property-faqs-header text-center">
            <div className="property-amenities-eyebrow mb-2">FAQs</div>
            <h2 className="property-faqs-heading text-center">
              {weddingHero.faqs_title}
            </h2>
            {weddingHero.faqs_description && (
              <p className="property-faqs-subtext mx-auto text-center mt-2 mb-0" dangerouslySetInnerHTML={{ __html: weddingHero.faqs_description }} />
            )}
          </div>

          <div className="property-faqs-list" style={{ maxWidth: "820px", margin: "0 auto" }}>
            {weddingFaqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div className={`property-faq-item ${isOpen ? "is-open" : ""}`} key={faq.id}>
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

      {/* Contact Us */}
      <div className="container mt-100 mb-100">
        <div className="section-headings headings-width text-center mb-40">
          <div className="section-sub-tag text-center" data-aos="fade-up">GET IN TOUCH</div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-12">
            <EnquiryForm
              propertiesList={propertiesList}
              title="Contact Us"
              subtitle="Tell us about your wedding or event and our team will get back to you with availability and a custom quote."
            />
          </div>
        </div>
      </div>

    </>
  );
}
