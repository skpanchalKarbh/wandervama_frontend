import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

// Fetches the admin-editable SEO title/description for a page (see the
// "SEO" tab in the Admin Dashboard). Starts from `fallback` so the page
// always has sane title/description even before the fetch resolves or if
// it fails — nothing regresses if the backend is unreachable.
export default function usePageSeo(pageKey, fallback) {
  const [seo, setSeo] = useState({ ...fallback, schema: null });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/seo/${pageKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          let schema = null;
          if (data.data.schema_markup) {
            try {
              schema = JSON.parse(data.data.schema_markup);
            } catch (e) {
              schema = null;
            }
          }
          setSeo({
            title: data.data.meta_title || fallback.title,
            description: data.data.meta_description || fallback.description,
            schema,
          });
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return seo;
}
