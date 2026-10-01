import { useEffect, useRef } from "react";

// Drag-to-scroll + slow auto-scroll behaviour shared by every horizontally
// scrolling carousel on the site (Featured Properties, Latest Blogs, etc).
// Spread the returned object onto the scroll container:
//   <div className="featured-properties-scroll" {...useDragAutoScroll(items.length)}>
export default function useDragAutoScroll(itemCount, speed = 0.6) {
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const autoScrollPausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || itemCount === 0) return;

    let rafId;

    const step = () => {
      if (!autoScrollPausedRef.current && !isDraggingRef.current) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll > 0) {
          track.scrollLeft += speed;
          if (track.scrollLeft >= maxScroll - 1) {
            track.scrollLeft = 0;
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [itemCount, speed]);

  const handleMouseDown = (e) => {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    autoScrollPausedRef.current = true;
    dragStartXRef.current = e.pageX;
    dragStartScrollRef.current = track.scrollLeft;
    dragDistanceRef.current = 0;
    track.classList.add("is-dragging");
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const dx = e.pageX - dragStartXRef.current;
    dragDistanceRef.current = Math.abs(dx);
    track.scrollLeft = dragStartScrollRef.current - dx;
  };

  const handleClickCapture = (e) => {
    if (dragDistanceRef.current > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    trackRef.current?.classList.remove("is-dragging");
    setTimeout(() => {
      autoScrollPausedRef.current = false;
    }, 1500);
  };

  const handleMouseEnter = () => {
    autoScrollPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    endDrag();
    autoScrollPausedRef.current = false;
  };

  return {
    ref: trackRef,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: endDrag,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClickCapture: handleClickCapture,
  };
}
