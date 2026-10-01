const ICONS = {
  facebook_url: {
    label: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  instagram_url: {
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  linkedin_url: {
    label: "LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  twitter_url: {
    label: "Twitter / X",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
};

// Renders whichever social links are set on `member` (facebook_url, instagram_url,
// linkedin_url, twitter_url). Returns null if none are set. `className` lets callers
// theme the circle button for their background (e.g. light card vs dark footer).
export default function SocialLinks({ member, className = "team-social-btn" }) {
  const active = Object.keys(ICONS).filter((key) => member?.[key]);
  if (active.length === 0) return null;

  return (
    <div className="team-social-row">
      {active.map((key) => (
        <a
          key={key}
          className={className}
          href={member[key]}
          target="_blank"
          rel="noreferrer"
          aria-label={ICONS[key].label}
        >
          {ICONS[key].icon}
        </a>
      ))}
    </div>
  );
}
