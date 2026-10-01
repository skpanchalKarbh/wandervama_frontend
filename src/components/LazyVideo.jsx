import { useEffect, useRef, useState } from "react";

// Looping muted preview video that only downloads/plays once it is near the viewport.
export default function LazyVideo({ src, poster, className }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      setActive(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (active && ref.current) ref.current.play().catch(() => {});
  }, [active]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      className={className}
    />
  );
}
