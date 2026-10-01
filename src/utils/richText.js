// Shared helpers for admin-entered HTML content (rich text fields).

// Strips HTML tags down to plain text — use this wherever a rich-text field's
// value ends up somewhere that can't hold markup: a <meta> tag, an alt/title
// attribute, or a plain-text card excerpt.
export function stripHtml(html) {
  if (!html) return "";
  if (typeof document === "undefined") {
    return String(html).replace(/<[^>]*>/g, "");
  }
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent || el.innerText || "";
}
