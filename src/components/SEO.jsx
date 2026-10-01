import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "../config/api";

const DEFAULT_TITLE = "Wanderama Hospitality LLP | Hotels, Resorts & Villas";
const DEFAULT_DESCRIPTION =
  "Wanderama Hospitality LLP operates handpicked hotels, resorts and villas across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh — book a stay built around comfort, safety and personal service.";
const DEFAULT_IMAGE = "/assets/img/logo/favicon-512.png";

function setMetaByName(name, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaByProperty(property, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonicalLink(href) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function setRobotsMeta(content) {
  let tag = document.querySelector('meta[name="robots"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "robots");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

// Sets the document title, meta description, Open Graph / Twitter tags,
// canonical URL and (optionally) JSON-LD structured data for the current
// page. Mount once per page component; updates run on every render so tag
// content always matches the page currently on screen.
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd = null,
  // Admin-entered custom Schema.org JSON-LD (SEO tab / Page / Blog post /
  // Property "Schema Markup" field). Rendered as its own <script> tag so it
  // never overwrites the auto-generated `jsonLd` above (e.g. Property/Article).
  customSchema = null,
}) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | Wanderama Hospitality LLP` : DEFAULT_TITLE;
    const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    const canonicalUrl = `${SITE_URL}${location.pathname}`;

    document.title = fullTitle;

    setMetaByName("description", description);
    setRobotsMeta(noindex ? "noindex, nofollow" : "index, follow");
    setCanonicalLink(canonicalUrl);

    setMetaByProperty("og:title", fullTitle);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:image", absoluteImage);
    setMetaByProperty("og:url", canonicalUrl);
    setMetaByProperty("og:type", "website");
    setMetaByProperty("og:site_name", "Wanderama Hospitality LLP");

    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", fullTitle);
    setMetaByName("twitter:description", description);
    setMetaByName("twitter:image", absoluteImage);

    setJsonLd("seo-jsonld", jsonLd);
    setJsonLd("seo-jsonld-custom", customSchema);

    return () => setJsonLd("seo-jsonld", null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, noindex, jsonLd, customSchema, location.pathname]);

  return null;
}
