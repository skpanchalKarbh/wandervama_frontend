// Regenerates public/sitemap.xml from the current live property list.
// Run this after adding/removing properties so search engines pick up new pages.
// Usage:
//   node scripts/generate-sitemap.js                    (defaults to the production API)
//   API_BASE_URL=http://localhost:5000 node scripts/generate-sitemap.js   (point at local backend instead)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_BASE_URL = process.env.API_BASE_URL || "https://api-wanderama.karbh.com";
const SITE_URL = "https://www.wanderamahospitality.com";

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/properties", priority: "0.9", changefreq: "weekly" },
  { path: "/amenities", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.6", changefreq: "monthly" },
  { path: "/testimonials", priority: "0.6", changefreq: "monthly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms-condition", priority: "0.3", changefreq: "yearly" },
];

async function main() {
  let propertySlugs = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      propertySlugs = data.data.map((p) => p.slug).filter(Boolean);
    }
  } catch (err) {
    console.warn("Could not fetch properties from backend — sitemap will only include static pages.", err.message);
  }

  let blogSlugs = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      blogSlugs = data.data.map((p) => p.slug).filter(Boolean);
    }
  } catch (err) {
    console.warn("Could not fetch blog posts from backend — sitemap will not include blog pages.", err.message);
  }

  const today = new Date().toISOString().split("T")[0];

  const urlEntries = [
    ...staticRoutes.map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    ),
    ...propertySlugs.map(
      (slug) => `  <url>
    <loc>${SITE_URL}/properties/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
    ...blogSlugs.map(
      (slug) => `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>
`;

  const outPath = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`Sitemap written to ${outPath} with ${staticRoutes.length} static + ${propertySlugs.length} property + ${blogSlugs.length} blog pages.`);
}

main();
