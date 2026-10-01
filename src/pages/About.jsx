import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import AboutIcon from "../components/AboutIcon";
import SocialLinks from "../components/SocialLinks";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import { API_BASE_URL } from "../config/api";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return url;
};

// Matches the Home page's about-section behaviour: the image is resized to
// equal the height of its text column, tracked live via ResizeObserver.
function useMatchImageHeight(dep) {
  const colRef = useRef(null);
  const [colHeight, setColHeight] = useState(null);

  useEffect(() => {
    if (!colRef.current) return;

    const syncHeight = () => {
      const h = colRef.current?.offsetHeight;
      if (h) setColHeight(h);
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(colRef.current);
    return () => resizeObserver.disconnect();
  }, [dep]);

  return {
    colRef,
    imgStyle: colHeight ? { "--about-img-height": `${colHeight}px` } : undefined,
  };
}

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState(null);
  const seo = usePageSeo("about", {
    title: "About Us",
    description: "Wanderama Hospitality LLP has been building a network of hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh since 2018 — learn our story, philosophy and the team behind it.",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/about`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAbout(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${API_BASE_URL}/api/team`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTeam(data.data);
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
  }, []);

  const whatsappNumber = (settings?.whatsapp_number || "910000000000").replace(/[^0-9]/g, "");
  const introMatch = useMatchImageHeight(about);
  const journeyMatch = useMatchImageHeight(about);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="container text-center py-5">
        <h2>About page content unavailable</h2>
        <p>Please check back shortly.</p>
      </div>
    );
  }

  const features = Array.isArray(about.features) ? about.features : [];
  const philosophy = Array.isArray(about.philosophy) ? about.philosophy : [];
  const stats = Array.isArray(about.stats) ? about.stats : [];

  // Founder & Co-Founder(s) are shown with a full bio; "team" is shown as a
  // simple grid further down. Both come from the same admin-managed Team tab.
  const leadership = team.filter((m) => m.category === "founder" || m.category === "cofounder");
  const teamMembers = team.filter((m) => m.category === "team");

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />
      <PageBanner title="About Us" current="About Us" />

      {/* Company Introduction - Who We Are */}
      <div className="image-text text-first image-text-about mt-100">
        <div className="container">
          <div className="row flex-lg-row-reverse align-items-center">
            <div className="col-xl-5 col-lg-6 col-12 mb-4 mb-lg-0">
              <div className="image-wrap luxury-about-image-wrap">
                <div className="image" data-aos="fade-left">
                  <img
                    src={resolveImageUrl(about.intro_image)}
                    width="992"
                    height="1208"
                    loading="lazy" decoding="async"
                    alt={about.intro_image_alt || "Wanderama Hospitality property"}
                    className="luxury-about-main-img"
                    style={introMatch.imgStyle}
                  />
                  <div className="image-absolute" data-aos="zoom-in-up">
                    <div className="image-shape image-pill luxury-about-sm-img-box">
                      <img src={resolveImageUrl(about.intro_image_sm)} width="196" height="279" loading="lazy" decoding="async" alt={about.intro_image_alt || "Wanderama Hospitality guest room"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 col-12">
              <div className="content about-content-wrapper pr-lg-30" ref={introMatch.colRef}>
                <div className="section-sub-tag" data-aos="fade-up">OUR STORY & PHILOSOPHY</div>
                <h2 className="heading section-main-title" data-aos="fade-up" data-aos-delay="30">
                  {about.intro_title}
                </h2>
                <div
                  className="section-body-text"
                  data-aos="fade-up"
                  data-aos-delay="60"
                  dangerouslySetInnerHTML={{ __html: about.intro_text }}
                />

                <div className="about-features-grid" data-aos="fade-up" data-aos-delay="90">
                  {features.map((f, i) => (
                    <div className="about-feature-item" key={i}>
                      <div className="feature-check-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span className="feature-text">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="about-cta-wrapper mt-30" data-aos="fade-up" data-aos-delay="150">
                  <Link to="/properties" className="btn-hero-primary" aria-label="Explore Properties">
                    <span>Explore Our Properties</span>
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

      {/* Our Journey Since 2018 */}
      <div className="image-text image-text-about mt-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6 col-12 mb-4 mb-lg-0">
              <div className="image-wrap luxury-about-image-wrap">
                <div className="image" data-aos="fade-right">
                  <img
                    src={resolveImageUrl(about.journey_image)}
                    width="992"
                    height="1208"
                    loading="lazy" decoding="async"
                    alt={about.journey_image_alt || "Wanderama Hospitality property"}
                    className="luxury-about-main-img"
                    style={journeyMatch.imgStyle}
                  />
                  <div className="image-absolute" data-aos="zoom-in-up">
                    <div className="image-shape image-pill luxury-about-sm-img-box">
                      <img src={resolveImageUrl(about.journey_image_sm)} width="196" height="279" loading="lazy" decoding="async" alt={about.journey_image_alt || "Wanderama Hospitality poolside"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6 col-12">
              <div className="content about-content-wrapper pl-lg-30" ref={journeyMatch.colRef}>
                <div className="section-sub-tag" data-aos="fade-up">EVOLUTION & GROWTH</div>
                <h2 className="heading section-main-title" data-aos="fade-up" data-aos-delay="30">
                  {about.journey_title}
                </h2>
                <div
                  className="section-body-text mb-15"
                  data-aos="fade-up"
                  data-aos-delay="50"
                  dangerouslySetInnerHTML={{ __html: about.journey_text_1 }}
                />
                <div
                  className="section-body-text mb-30"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  dangerouslySetInnerHTML={{ __html: about.journey_text_2 }}
                />
                <div data-aos="fade-up" data-aos-delay="150">
                  <Link to="/gallery" className="btn-hero-primary" aria-label="View Gallery">
                    <span>See Our Properties Through The Years</span>
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

      {/* Vision & Hospitality Philosophy */}
      <div className="luxury-philosophy-section home-band-cream mt-100 mb-100">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <div className="section-sub-tag text-center" data-aos="fade-up">OUR CORE VALUES</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              Our Vision &amp; Hospitality Philosophy
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
              Four simple commitments that hold across every Wanderama address
            </p>
          </div>
          <div className="section-content mt-50">
            <div className="row grid-gap">
              {philosophy.map((item, i) => (
                <div className="col-lg-3 col-md-6 col-12" data-aos="fade-up" data-aos-delay={i * 50} key={i}>
                  <div className="luxury-philosophy-card">
                    <div className="philosophy-icon-badge">
                      <AboutIcon name={item.icon} className="icon-26" />
                    </div>
                    <h3 className="philosophy-card-title">{item.title}</h3>
                    <p className="philosophy-card-desc" dangerouslySetInnerHTML={{ __html: item.desc }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Founder & Co-Founder(s) — managed from the admin Team tab */}
      {leadership.map((member, idx) => {
        const isFounder = member.category === "founder";
        const imageFirst = idx % 2 === 0;
        return (
          <div
            className={`image-text image-text-about mt-100 ${imageFirst ? "text-first" : ""}`}
            key={member.id}
          >
            <div className="container">
              <div className={`row align-items-center ${imageFirst ? "flex-lg-row-reverse" : ""}`}>
                <div className="col-xl-5 col-lg-6 col-12 mb-4 mb-lg-0">
                  <div className="image-wrap luxury-about-image-wrap">
                    <div className="image" data-aos={imageFirst ? "fade-left" : "fade-right"}>
                      <img
                        src={resolveImageUrl(member.photo_url)}
                        width="600"
                        height="600"
                        loading="lazy" decoding="async"
                        alt={member.photo_alt || member.name}
                        className="luxury-about-main-img"
                        style={{ borderRadius: "24px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/img/people/1.jpg";
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-7 col-lg-6 col-12">
                  <div className={`content about-content-wrapper ${imageFirst ? "pr-lg-30" : "pl-lg-30"}`}>
                    <div className="section-sub-tag" data-aos="fade-up">LEADERSHIP</div>
                    <h2 className="heading section-main-title" data-aos="fade-up" data-aos-delay="30">
                      {isFounder ? "Meet Our Founder" : "Meet Our Co-Founder"}
                    </h2>
                    <div className="founder-title-badge mb-20" data-aos="fade-up" data-aos-delay="40">
                      {member.name} — {member.role}
                    </div>
                    {member.bio && (
                      <div
                        className="section-body-text mb-30"
                        data-aos="fade-up"
                        data-aos-delay="60"
                        dangerouslySetInnerHTML={{ __html: member.bio }}
                      />
                    )}
                    <div className="d-flex align-items-center flex-wrap gap-3" data-aos="fade-up" data-aos-delay="90">
                      {isFounder && (
                        <Link to="/contact" className="btn-hero-primary" aria-label="Get In Touch">
                          <span>Get In Touch</span>
                          <svg className="btn-arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      )}
                      <SocialLinks member={member} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Meet The Team */}
      {teamMembers.length > 0 && (
        <div className="luxury-team-section home-band-white mt-100 mb-100">
          <div className="container">
            <div className="section-headings headings-width text-center">
              <div className="section-sub-tag text-center" data-aos="fade-up">MEET THE TEAM</div>
              <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
                The People Behind Wanderama
              </h2>
              <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
                The team working every day to make each Wanderama stay run smoothly
              </p>
            </div>
            <div className="section-content mt-50">
              <div className="row grid-gap justify-content-center">
                {teamMembers.map((member, i) => (
                  <div className="col-lg-3 col-md-4 col-6" data-aos="fade-up" data-aos-delay={i * 50} key={member.id}>
                    <div className="luxury-team-card">
                      <div className="team-card-img-wrap">
                        <img
                          src={resolveImageUrl(member.photo_url)}
                          width="320"
                          height="320"
                          loading="lazy" decoding="async"
                          alt={member.photo_alt || member.name}
                          className="team-card-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/img/people/1.jpg";
                          }}
                        />
                      </div>
                      <div className="team-card-body">
                        <h3 className="team-card-name">{member.name}</h3>
                        <p className="team-card-role">{member.role}</p>
                        <SocialLinks member={member} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements & Experience */}
      <div className="promotion promotion-white-bg home-band-cream mt-100">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <div className="section-sub-tag text-center" data-aos="fade-up">BY THE NUMBERS</div>
            <h2 className="heading section-main-title text-center" data-aos="fade-up" data-aos-delay="30">
              Our Achievements &amp; Experience
            </h2>
            <p className="section-body-text text-center mx-auto" style={{ maxWidth: "620px" }} data-aos="fade-up" data-aos-delay="60">
              Seven years of building a hospitality group guests keep coming back to
            </p>
          </div>
          <div className="section-content">
            <div className="row grid-gap justify-content-center">
              {stats.map((s, i) => (
                <div className="col-lg-3 col-md-6 col-6" data-aos="fade-up" data-aos-delay={i * 50} key={i}>
                  <div className="luxury-stat-card text-center">
                    <h3 className="stat-number">{s.number}</h3>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
