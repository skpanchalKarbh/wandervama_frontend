// Single source of truth for the backend API base URL.
//
// Reads from the Vite env var VITE_API_BASE_URL so dev and production can
// point at different backends without touching code:
//   - `npm run dev`   -> uses .env.development (http://localhost:5000)
//   - `npm run build` -> uses .env.production  (https://api-wanderama.karbh.com)
// Falls back to localhost:5000 (the local dev backend) if the env var is
// missing entirely, so nothing breaks even if env files aren't picked up.
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

// Single source of truth for the public site URL (used for SEO — canonical
// links, Open Graph/Twitter tags, sitemap.xml). Update this when the site
// goes live on its real domain.
export const SITE_URL = "https://www.wanderamahospitality.com";
