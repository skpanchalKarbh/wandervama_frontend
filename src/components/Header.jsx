import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { API_BASE_URL } from "../config/api";

const ChevronDown = () => (
  <div className="svg-wrapper">
    <svg viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 1L6 6L1 1"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default function Header() {
  const location = useLocation();
  const [propertiesList, setPropertiesList] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPropertiesList(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/pages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPagesList(data.data.filter((p) => p.status === "published"));
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

  const isActive = (path) => location.pathname === path;

  // Close the mobile drawer menu whenever navigation actually happens (i.e.
  // a nav link was clicked) — otherwise it stays open and only the explicit
  // close (X) button can dismiss it. Clicking "Properties" alone doesn't
  // change the route (it just expands the accordion), so this correctly
  // leaves the drawer open for that case.
  useEffect(() => {
    document.querySelector(".drawer-menu")?.classList.remove("show");
    document.body.classList.remove("scroll-lock");
    const overlay = document.querySelector("#drawer-overlay");
    overlay?.classList.remove("show");
    overlay?.removeAttribute("data-drawer");
  }, [location.pathname]);

  const topEmail = (settings?.emails || [])[0];
  const topPhones = settings?.phone_numbers || [];

  // Show just the city/state/pin tail of the full address (last 2 comma
  // segments), so the topbar stays short instead of printing the full
  // street address.
  const topAddress = settings?.address
    ? settings.address.split(",").map((s) => s.trim()).filter(Boolean).slice(-2).join(", ")
    : "";

  return (
    <sticky-header data-sticky-type="always">
      {(topEmail || topPhones.length > 0 || topAddress) && (
        <div className="header-topbar">
          <div className="container">
            <div className="header-topbar-inner">
              <div className="header-topbar-info">
                {topPhones.map((phone, i) => (
                  <a className="header-topbar-item" href={`tel:${phone.replace(/[^0-9+]/g, "")}`} key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{phone}</span>
                  </a>
                ))}
                {topEmail && (
                  <a className="header-topbar-item" href={`mailto:${topEmail}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16v16H4z" opacity="0" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                    <span>{topEmail}</span>
                  </a>
                )}
                {topAddress && (
                  <span className="header-topbar-item header-topbar-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{topAddress}</span>
                  </span>
                )}
              </div>
              <SocialLinks member={settings} className="header-topbar-social-btn" />
            </div>
          </div>
        </div>
      )}
      <header className="header-1">
        <div className="container">
          <div className="header-grid">
            <Link className="header-logo" to="/" aria-label="Wanderama Hospitality" style={{ maxWidth: "none" }}>
              <Logo height={54} />
            </Link>
            <drawer-menu>
              <nav className="header-nav drawer-menu">
                <div className="drawer-menu-top">
                  <div className="d-lg-none header-nav-headings">
                    <Link className="header-logo" to="/" aria-label="Wanderama Hospitality" style={{ maxWidth: "none" }}>
                      <Logo height={46} />
                    </Link>
                    <drawer-opener
                      className="svg-wrapper menu-close"
                      data-drawer=".drawer-menu"
                    >
                      <svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00386 9.41816C7.61333 9.02763 7.61334 8.39447 8.00386 8.00395C8.39438 7.61342 9.02755 7.61342 9.41807 8.00395L12.0057 10.5916L14.5907 8.00657C14.9813 7.61605 15.6144 7.61605 16.0049 8.00657C16.3955 8.3971 16.3955 9.03026 16.0049 9.42079L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.0039C15.6133 16.3945 14.9802 16.3945 14.5896 16.0039L12.0057 13.42L9.42097 16.0048C9.03045 16.3953 8.39728 16.3953 8.00676 16.0048C7.61624 15.6142 7.61624 14.9811 8.00676 14.5905L10.5915 12.0058L8.00386 9.41816Z"
                          fill="currentColor"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                          fill="currentColor"
                        />
                      </svg>
                    </drawer-opener>
                  </div>
                  <ul className="header-menu list-unstyled">
                    <li className="nav-item">
                      <Link className={`menu-link menu-link-main ${isActive("/") ? "active" : ""}`} to="/">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`menu-link menu-link-main ${isActive("/about") ? "active" : ""}`} to="/about">
                        About Us
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`menu-link menu-link-main menu-accrodion ${location.pathname.startsWith("/properties") ? "active" : ""}`}
                        to="/properties"
                      >
                        Properties
                        <ChevronDown />
                      </Link>
                      <div className="header-submenu menu-absolute submenu-color radius4 properties-dropdown">
                        <ul className="list-unstyled">
                          {propertiesList.map((p) => (
                            <li className="nav-item" key={p.slug || p.id}>
                              <Link className="menu-link" to={`/properties/${p.slug || p.id}`}>
                                <span className="heading">{p.name}</span>
                              </Link>
                            </li>
                          ))}
                          <li className="nav-item">
                            <Link className="menu-link properties-dropdown-all" to="/properties">
                              <span className="heading">View All Properties →</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="nav-item">
                      <Link className={`menu-link menu-link-main ${isActive("/weddings-events") ? "active" : ""}`} to="/weddings-events">
                        Wedding &amp; Events
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`menu-link menu-link-main ${isActive("/testimonials") ? "active" : ""}`} to="/testimonials">
                        Testimonials
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`menu-link menu-link-main ${isActive("/partner-with-us") ? "active" : ""}`} to="/partner-with-us">
                        Partner With Us
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className={`menu-link menu-link-main ${isActive("/blog") ? "active" : ""}`} to="/blog">
                        Blog
                      </Link>
                    </li>
                    {pagesList.length > 0 && (
                      <li className="nav-item">
                        <Link
                          className={`menu-link menu-link-main menu-accrodion ${pagesList.some((p) => isActive(`/${p.slug}`)) ? "active" : ""}`}
                          to={`/${pagesList[0].slug}`}
                        >
                          Pages
                          <ChevronDown />
                        </Link>
                        <div className="header-submenu menu-absolute submenu-color radius4 properties-dropdown">
                          <ul className="list-unstyled">
                            {pagesList.map((p) => (
                              <li className="nav-item" key={p.id}>
                                <Link className="menu-link" to={`/${p.slug}`}>
                                  <span className="heading">{p.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="mobile-menu-bottom d-lg-none d-block">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="btn-login text text-14"
                  >
                    <svg
                      className="icon-20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 10.875a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0m3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0m3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </nav>
            </drawer-menu>
            <div className="header-actions d-flex align-items-center gap-2">
              <Link
                to="/contact"
                className="btn-header-contact d-none d-lg-inline-flex"
              >
                <span>Contact Us</span>
              </Link>
              <drawer-opener
                className="svg-wrapper menu-open d-lg-none"
                data-drawer=".drawer-menu"
              >
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="26" cy="26" r="25.5" fill="white" stroke="currentColor" />
                  <path
                    d="M32.5 18.2857C32.5 17.5757 31.9179 17 31.2 17H14.3C13.5821 17 13 17.5757 13 18.2857C13 18.9958 13.5821 19.5714 14.3 19.5714H31.2C31.9179 19.5714 32.5 18.9957 32.5 18.2857ZM14.3 24.7143H37.7C38.4179 24.7143 39 25.29 39 26C39 26.7101 38.4179 27.2857 37.7 27.2857H14.3C13.5821 27.2857 13 26.7101 13 26C13 25.29 13.5821 24.7143 14.3 24.7143ZM14.3 32.4286H26C26.7179 32.4286 27.3 33.0042 27.3 33.7143C27.3 34.4243 26.7179 35 26 35H14.3C13.5821 35 13 34.4243 13 33.7143C13 33.0042 13.5821 32.4286 14.3 32.4286Z"
                    fill="currentColor"
                  />
                </svg>
              </drawer-opener>
            </div>
          </div>
        </div>
      </header>
    </sticky-header>
  );
}
