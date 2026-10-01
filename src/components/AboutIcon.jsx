// Icon set for the About page "Vision & Hospitality Philosophy" cards.
const paths = {
  building: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|9 22 9 12 15 12 15 22",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z|12 6 12 12 16 14",
};

export const iconNames = Object.keys(paths);

export default function AboutIcon({ name, className = "icon-24" }) {
  const raw = paths[name] || paths.building;
  const segments = raw.split("|");

  return (
    <div className={`svg-wrapper ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {segments.map((seg, i) =>
          /^[Mm]/.test(seg.trim()) ? (
            <path key={i} d={seg} />
          ) : (
            <polyline key={i} points={seg} />
          )
        )}
      </svg>
    </div>
  );
}
