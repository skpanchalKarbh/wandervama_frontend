// Official Wanderama Hospitality logo (without HOTELS & RESORTS subtext).
// variant="full" (default) is the dark wordmark for light backgrounds (Header).
// variant="white" is the white wordmark for dark backgrounds (Footer).
export default function Logo({ height = 40, variant = "full" }) {
  const src =
    variant === "white"
      ? "/assets/img/logo/wanderama-wordmark-white.png"
      : "/assets/img/logo/wanderama-wordmark.png";

  return (
    <img
      src={src}
      alt="Wanderama Hospitality"
      loading={variant === "white" ? "lazy" : "eager"}
      height={height}
      style={{ display: "block", height, width: "auto", objectFit: "contain" }}
    />
  );
}
