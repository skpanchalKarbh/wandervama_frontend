import { useEffect } from "react";

// Same wrapper classes used for the cream/white section bands across every
// public page (Home, About, Amenities, Properties, Testimonials, Contact,
// Gallery, Blog, Wedding & Events) plus the page banner and Home's own
// non-banded sections, so "every major section" resolves consistently no
// matter which page is mounted.
const SECTION_SELECTOR =
  ".page-banner, .hero-slider-outer, .home-band-cream, .home-band-white, .luxury-cta-section, .image-text-about, .why-wanderama-section, .group-travel-section, .event-showcase-wrapper";

// Elements where a wheel gesture must scroll natively (typing/selecting)
// instead of jumping the whole page to the next section.
const IGNORE_SELECTOR =
  "textarea, select, .drawer-menu, .header-submenu, .custom-video-modal-container, .featured-properties-scroll";

const HEADER_OFFSET = 100;
const MIN_DELTA = 12;
const SETTLE_MS = 700;

export default function useSectionScrollSnap(dependencyKey) {
  useEffect(() => {
    if (window.innerWidth < 768) return; // touch scroll on mobile is untouched — wheel doesn't fire there anyway

    let animating = false;
    let settleTimer = null;

    // Registered section tops, PLUS extra in-between stops for any section
    // taller than the viewport. Without this, a single wheel tick would
    // jump straight from one section's top to the next one's top and skip
    // over everything in between (e.g. a tall testimonials grid, or a long
    // admin-managed content block) — the exact "sections getting bypassed"
    // bug this hook must not have.
    const snapPoints = () => {
      const registered = Array.from(document.querySelectorAll(SECTION_SELECTOR))
        .filter((el) => el.offsetParent !== null)
        .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET))
        .sort((a, b) => a - b);

      const vh = window.innerHeight;
      const step = vh * 0.9;
      const points = [];
      for (let i = 0; i < registered.length; i++) {
        points.push(registered[i]);
        const next = registered[i + 1];
        if (next === undefined) continue;
        let cursor = registered[i] + step;
        while (cursor < next - vh * 0.3) {
          points.push(Math.round(cursor));
          cursor += step;
        }
      }
      return points;
    };

    const handleWheel = (e) => {
      if (animating) {
        e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < MIN_DELTA) return;
      if (e.target.closest && e.target.closest(IGNORE_SELECTOR)) return;

      const points = snapPoints();
      if (!points.length) return;

      const currentY = window.scrollY;
      let targetY;

      if (e.deltaY > 0) {
        targetY = points.find((y) => y > currentY + 5);
        if (targetY === undefined) return; // already past the last stop — let native scroll continue into the footer
      } else {
        const reversed = [...points].reverse();
        targetY = reversed.find((y) => y < currentY - 5);
        if (targetY === undefined) targetY = 0;
      }

      e.preventDefault();
      animating = true;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        animating = false;
      }, SETTLE_MS);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(settleTimer);
    };
  }, [dependencyKey]);
}
