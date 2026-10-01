import { useState } from "react";
import { API_BASE_URL } from "../config/api";

// The "Send an Enquiry" reservation form — shared by the Contact page and the
// Home page's pre-footer enquiry section so both submit through the same
// validated flow instead of drifting apart.
export default function EnquiryForm({
  propertiesList = [],
  title = "Send an Enquiry",
  subtitle = "Fill in your travel details below and our reservations manager will get back to you within 30 minutes.",
  defaultPropertySlug = "",
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    property: defaultPropertySlug,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: "", phone: "", email: "", property: "", message: "" });
      } else {
        setSubmitError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="luxury-contact-form-card" data-aos="fade-up" data-aos-delay="100">
      <h3 className="heading section-main-title mb-2" style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", textAlign: "left" }}>
        {title}
      </h3>
      <p className="text-muted" style={{ fontSize: "14.5px", textAlign: "left", lineHeight: "1.6", marginBottom: "22px" }}>
        {subtitle}
      </p>

      {/* Luxury Reassurance Trust Bar */}
      <div className="form-trust-bar">
        <div className="form-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Best Rate Guaranteed</span>
        </div>
        <div className="form-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Direct Resort Booking</span>
        </div>
        <div className="form-trust-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Custom Itineraries</span>
        </div>
      </div>

      {submitted ? (
        <div className="p-4 text-center rounded-4" style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#22C55E", color: "#FFFFFF" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h4 style={{ fontSize: "22px", fontWeight: "800", color: "#14532D", marginBottom: "8px" }}>Enquiry Received!</h4>
          <p style={{ fontSize: "15px", color: "#166534", margin: 0 }}>
            Thank you for reaching out to Wanderama. Our reservations team will contact you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="luxury-enquiry-form">
          {submitError && (
            <div
              className="mb-3 p-3 rounded-3"
              style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#991B1B", fontSize: "14px" }}
            >
              {submitError}
            </div>
          )}
          <div className="row g-3">
            <div className="col-md-6 col-12">
              <div className="field">
                <label className="luxury-form-label">
                  Full Name <span style={{ color: "#D9A752" }}>*</span>
                </label>
                <div className="luxury-input-wrapper">
                  <div className="luxury-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="luxury-form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="field">
                <label className="luxury-form-label">
                  Phone Number <span style={{ color: "#D9A752" }}>*</span>
                </label>
                <div className="luxury-input-wrapper">
                  <div className="luxury-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className="luxury-form-input"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="field">
                <label className="luxury-form-label">
                  Email Address <span style={{ color: "#D9A752" }}>*</span>
                </label>
                <div className="luxury-input-wrapper">
                  <div className="luxury-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="luxury-form-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="field">
                <label className="luxury-form-label">
                  Property of Interest <span style={{ color: "#D9A752" }}>*</span>
                </label>
                <div className="luxury-input-wrapper">
                  <div className="luxury-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <select
                    name="property"
                    className="luxury-form-select"
                    value={formData.property}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a Wanderama property
                    </option>
                    {propertiesList.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} ({p.location}, {p.state})
                      </option>
                    ))}
                    <option value="general">General Stay Enquiry</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="field">
                <label className="luxury-form-label">
                  Your Message or Travel Dates <span style={{ color: "#D9A752" }}>*</span>
                </label>
                <div className="luxury-input-wrapper">
                  <div className="luxury-input-icon-textarea">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <textarea
                    name="message"
                    rows="4"
                    className="luxury-form-textarea"
                    placeholder="Tell us about check-in dates, number of guests, or special requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn-enquiry-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>Sending Your Reservation Enquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit Reservation Enquiry</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
            <div className="form-privacy-guarantee">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Your information is 100% confidential &amp; never shared.</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
