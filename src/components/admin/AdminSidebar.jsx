import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Every content-tab item lives inside AdminDashboard's activeTab state. When
// this sidebar is rendered from a page OTHER than /admin (e.g. Pages), a
// click navigates to /admin and asks it to pre-select that tab (AdminDashboard
// reads this from location.state on mount — see its useEffect for "seo tab
// fix"). "pages" is the one item that is its own routed page, not a tab.
const NAV_ITEMS = [
  { key: "overview", label: "Dashboard", icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" /> },
  { key: "hero", label: "Hero Banner", icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></> },
  { key: "about", label: "About Page", icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></> },
  { key: "properties", label: "Properties", icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>, countKey: "properties" },
  { key: "amenities", label: "Amenities", icon: <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />, countKey: "amenities" },
  { key: "gallery", label: "Gallery", icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>, countKey: "gallery" },
  { key: "eventTypes", label: "Weddings & Events", icon: <path d="M17 3H7a2 2 0 0 0-2 2v16l7-4 7 4V5a2 2 0 0 0-2-2z" />, countKey: "eventTypes" },
  { key: "testimonials", label: "Guest Reviews", icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
  { key: "partner", label: "Partner With Us", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
  { key: "team", label: "Team", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, countKey: "team" },
  { key: "blog", label: "Blog", icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>, countKey: "blog" },
  { key: "pages", label: "Pages", icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>, route: "/admin/pages" },
  { key: "destinations", label: "Destinations", icon: <><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" /><circle cx="12" cy="10" r="3" /></>, countKey: "destinations" },
  { key: "enquiries", label: "Stay Enquiries", icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, badgeKey: "enquiries" },
  { key: "seo", label: "SEO", icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></> },
  { key: "other", label: "Other (Footer Info)", icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></> },
  { key: "account", label: "Account Settings", icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
];

export default function AdminSidebar({ activeTab, onSelectTab, counts = {}, enquiriesCount = 0, mobileMenuOpen = false, onCloseMobileMenu = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (item) => {
    onCloseMobileMenu();
    if (item.route) {
      navigate(item.route);
      return;
    }
    if (onSelectTab) {
      onSelectTab(item.key);
      return;
    }
    navigate(item.key === "overview" ? "/admin" : `/admin/${item.key}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      {mobileMenuOpen && <div className="admin-sidebar-overlay" onClick={onCloseMobileMenu} />}

      <aside
        className={`admin-sidebar${mobileMenuOpen ? " admin-sidebar--open" : ""}`}
        style={{
          width: "260px",
          background: "#0F172A",
          borderRight: "1px solid #1E293B",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
          zIndex: 100,
        }}
        onClick={(e) => {
          if (e.target.closest("button, a")) onCloseMobileMenu();
        }}
      >
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1E293B" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div>
                <h3 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "700", margin: 0, letterSpacing: "-0.3px" }}>
                  Wanderama
                </h3>
              </div>
            </div>
          </Link>
        </div>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E293B", background: "rgba(255,255,255,0.02)" }}>
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#0564F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "14px",
                color: "#FFFFFF",
              }}
            >
              {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#F8FAFC", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {user?.username || "Admin"}
              </div>
              <div style={{ fontSize: "11.5px", color: "#64748B" }}>Hospitality Manager</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flexGrow: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 12px 10px 12px" }}>
            Overview & Management
          </div>

          <ul className="list-unstyled d-flex flex-column gap-1" style={{ margin: 0, padding: 0 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              const badgeCount = item.countKey ? counts[item.countKey] : null;
              const enquiriesBadge = item.badgeKey === "enquiries" ? enquiriesCount : null;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => handleSelect(item)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: isActive ? "#1E293B" : "transparent",
                      color: isActive ? "#FFFFFF" : "#94A3B8",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: "14px",
                      cursor: "pointer",
                      borderLeft: isActive ? "3px solid #0564F2" : "3px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
                      <span>{item.label}</span>
                    </div>
                    {badgeCount != null && (
                      <span style={{ fontSize: "11px", fontWeight: "700", background: "#334155", color: "#F8FAFC", padding: "2px 8px", borderRadius: "12px" }}>
                        {badgeCount}
                      </span>
                    )}
                    {enquiriesBadge > 0 && (
                      <span style={{ fontSize: "11px", fontWeight: "700", background: "#EF4444", color: "#FFFFFF", padding: "2px 8px", borderRadius: "12px" }}>
                        {enquiriesBadge} New
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: "16px 16px 24px 16px", borderTop: "1px solid #1E293B", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "9px 14px",
              borderRadius: "8px",
              background: "#1E293B",
              color: "#CBD5E1",
              fontSize: "13px",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            <span>🌐</span> View Public Website
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "9px 14px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#FCA5A5",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <span>🚪</span> Logout Account
          </button>
        </div>
      </aside>
    </>
  );
}
