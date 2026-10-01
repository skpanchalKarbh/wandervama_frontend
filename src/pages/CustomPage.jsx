import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import SEO from "../components/SEO";
import PageBanner from "../components/PageBanner";
import { API_BASE_URL } from "../config/api";

const resolveImageUrl = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return url;
};

// Renders an admin-created custom page (Admin Panel → Pages) at /<slug>.
// Explicit routes in App.jsx (e.g. /about, /properties) always win over this
// dynamic route, so a custom page can never shadow a built-in site page.
export default function CustomPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "notfound"

  useEffect(() => {
    setStatus("loading");
    fetch(`${API_BASE_URL}/api/pages/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPage(data.data);
          setStatus("ok");
        } else {
          setStatus("notfound");
        }
      })
      .catch(() => setStatus("notfound"));
  }, [slug]);

  if (status === "loading") {
    return <div style={{ minHeight: "60vh" }} />;
  }

  if (status === "notfound") {
    return <Navigate to="/404" replace />;
  }

  let customSchema = null;
  if (page.schema_markup) {
    try {
      customSchema = JSON.parse(page.schema_markup);
    } catch (e) {
      customSchema = null;
    }
  }

  return (
    <>
      <SEO title={page.meta_title || page.title} description={page.meta_description} image={resolveImageUrl(page.featured_image)} customSchema={customSchema} />

      <PageBanner title={page.title} current={page.title} image={resolveImageUrl(page.featured_image)} imageAlt={page.featured_image_alt} />

      <div className="blog-details-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-12">
              <div className="blog-rich-content" dangerouslySetInnerHTML={{ __html: page.content || "" }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
