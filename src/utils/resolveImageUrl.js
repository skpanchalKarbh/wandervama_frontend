import { API_BASE_URL } from "../config/api";

// Shared by admin property forms/lists: turns a stored image path (relative
// upload path, absolute URL, or blob preview) into something an <img> can load.
export default function resolveImageUrl(pathStr) {
  if (!pathStr) return "/assets/img/slider/hero-bg.jpg";
  if (typeof pathStr !== "string") {
    if (Array.isArray(pathStr) && pathStr.length > 0 && typeof pathStr[0] === "string") {
      pathStr = pathStr[0];
    } else {
      return "/assets/img/slider/hero-bg.jpg";
    }
  }
  const trimmed = pathStr.trim();
  if (!trimmed) return "/assets/img/slider/hero-bg.jpg";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("blob:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  return trimmed;
}
