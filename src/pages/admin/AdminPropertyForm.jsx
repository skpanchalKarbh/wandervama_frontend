import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { indianStates } from "../../data/properties";
import RichTextEditor from "../../components/admin/RichTextEditor";
import { API_BASE_URL } from "../../config/api";
import resolveImageUrl from "../../utils/resolveImageUrl";
import { stripHtml } from "../../utils/richText";

const defaultPropState = {
  name: "",
  location: "",
  state: "Gujarat",
  type: "Resort",
  tagline: "",
  address: "",
  phone: "",
  heroTitle: "",
  heroSubheading: "",
  heroImage: "/assets/img/slider/hero-bg.jpg",
  heroImageAlt: "",
  thumbImage: "/assets/img/slider/2.jpg",
  thumbImageAlt: "",
  description: "",
  videoUrl: "",
  gallery: [],
  videos: [],
  galleryInputUrl: "",
  videoInputUrl: "",
  attractions: "Infinity Pool, Private Dining, Beachfront View",
  amenities: [
    { title: "Free WiFi", desc: "" },
    { title: "Spa & Wellness", desc: "" },
    { title: "AC Deluxe Rooms", desc: "" },
    { title: "Parking", desc: "" },
  ],
  amenityTitleInput: "",
  amenityBodyInput: "",
  badges: "Rooms, Pool, Family",
  quickLocation: "",
  quickRooms: "",
  quickPrice: "",
  quickDining: "",
  quickBestFor: "",
  quickFacts: [],
  quickFactTitleInput: "",
  quickFactValueInput: "",
  amenitiesEyebrow: "",
  amenitiesTitle: "",
  amenitiesDescription: "",
  experiences: [],
  experienceTitleInput: "",
  experienceSubtitleInput: "",
  experienceImageInput: "",
  experienceImageAltInput: "",
  experiencesEyebrow: "",
  experiencesTitle: "",
  experiencesDescription: "",
  rooms: [],
  roomCategoryInput: "",
  roomNameInput: "",
  roomDescriptionInput: "",
  roomPriceInput: "",
  roomImageInput: "",
  roomImageAltInput: "",
  roomsEyebrow: "",
  roomsTitle: "",
  roomsDescription: "",
  reviews: [],
  reviewRatingInput: "5",
  reviewQuoteInput: "",
  reviewGuestNameInput: "",
  reviewsEyebrow: "",
  reviewsTitle: "",
  reviewsDescription: "",
  reviewsCardTitle: "",
  reviewsCardDescription: "",
  reviewsCardButtonText: "",
  reviewsCardButtonLink: "",
  faqs: [],
  faqQuestionInput: "",
  faqAnswerInput: "",
  faqsEyebrow: "",
  faqsTitle: "",
  faqsDescription: "",
  metaTitle: "",
  metaDescription: "",
  schemaMarkup: "",
};

// Section card wrapper used to give the page a clearer visual hierarchy than
// the old cramped modal — a labelled panel with breathing room instead of a
// dense list of bare inputs.
function SectionCard({ icon, title, tag, tone = "light", children }) {
  const tones = {
    light: { background: "#F8FAFC", borderColor: "#E2E8F0" },
    green: { background: "#F0FDF4", borderColor: "#BBF7D0" },
    gold: { background: "#FDFBF7", borderColor: "#E2D9C8" },
  };
  return (
    <div className="p-4 rounded-4 border" style={{ ...tones[tone], marginBottom: "20px" }}>
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <label className="form-label fw-700 text-dark mb-0" style={{ fontSize: "14.5px" }}>
          {icon} {title}
        </label>
        {tag && (
          <span className="badge bg-success-subtle text-success" style={{ fontSize: "11px" }}>
            {tag}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// Small labelled wrapper so every field in the repeater sections (Amenities,
// Experiences, Rooms, Reviews, FAQs) shows its purpose above the input instead
// of relying on placeholder text alone once something is typed in.
function Field({ label, children }) {
  return (
    <div>
      <label className="form-label micro fw-700 text-secondary mb-1 text-uppercase" style={{ fontSize: "10.5px", letterSpacing: "0.03em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// White "add / edit an item" card that sits inside a SectionCard, visually
// separating the entry form from the section-heading fields above it and the
// saved-items list below it.
function SubPanel({ title, isEditing, onCancel, children }) {
  return (
    <div className="bg-white rounded-3 border p-3 mb-3" style={{ borderColor: isEditing ? "#F59E0B" : "#E2E8F0" }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="fw-700 text-dark" style={{ fontSize: "12.5px" }}>
          {isEditing ? "✏️ Editing item" : title}
        </div>
        {isEditing && (
          <button type="button" onClick={onCancel} className="btn btn-link btn-sm p-0 text-danger" style={{ fontSize: "12px", fontWeight: "600" }}>
            ✕ Cancel edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// Section-heading mini-fields (eyebrow / title / subtext) shown above every
// repeater's item list, with a small caption so admins know what they affect.
function HeadingFieldsCaption({ text }) {
  return <div className="text-muted micro mb-2">{text}</div>;
}

export default function AdminPropertyForm() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [existingSlug, setExistingSlug] = useState("");

  const [newProp, setNewProp] = useState(defaultPropState);
  const [uploadingPropField, setUploadingPropField] = useState(null);
  const [editingAmenityIndex, setEditingAmenityIndex] = useState(null);
  const [editingQuickFactIndex, setEditingQuickFactIndex] = useState(null);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);
  const [editingReviewIndex, setEditingReviewIndex] = useState(null);
  const [editingFaqIndex, setEditingFaqIndex] = useState(null);

  const goBackToList = () => navigate("/admin/properties");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }
    if (!isEditMode) return;

    fetch(`${API_BASE_URL}/api/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.data) {
          setNotFound(true);
          return;
        }
        const prop = data.data;
        setExistingSlug(prop.slug || "");
        setNewProp({
          name: prop.name || "",
          location: prop.location || "",
          state: prop.state || "Gujarat",
          type: prop.type || "Resort",
          tagline: prop.tagline || "",
          address: prop.address || "",
          phone: prop.phone || prop.mobile_no || "",
          heroTitle: prop.heroTitle || prop.hero_title || "",
          heroSubheading: prop.heroSubheading || prop.hero_subheading || "",
          heroImage: prop.heroImage || "/assets/img/slider/hero-bg.jpg",
          heroImageAlt: prop.heroImageAlt || "",
          thumbImage: prop.thumbImage || "/assets/img/slider/2.jpg",
          thumbImageAlt: prop.thumbImageAlt || "",
          description: prop.description || "",
          videoUrl: prop.video || prop.videoUrl || "",
          gallery: Array.isArray(prop.gallery) ? prop.gallery : (prop.gallery ? [prop.gallery] : []),
          videos: Array.isArray(prop.videos) ? prop.videos : (prop.video ? [prop.video] : []),
          galleryInputUrl: "",
          videoInputUrl: "",
          attractions: Array.isArray(prop.attractions) ? prop.attractions.join(", ") : (prop.attractions || ""),
          amenities: Array.isArray(prop.amenities)
            ? prop.amenities
                .map((a) =>
                  typeof a === "object" && a !== null
                    ? { title: a.title || a.name || "", desc: a.desc || a.description || "" }
                    : { title: String(a || ""), desc: "" }
                )
                .filter((a) => a.title)
            : [],
          amenityTitleInput: "",
          amenityBodyInput: "",
          badges: Array.isArray(prop.badges) ? prop.badges.join(", ") : (prop.badges || ""),
          quickLocation: prop.quickLocation || prop.quick_location || "",
          quickRooms: prop.quickRooms || prop.quick_rooms || "",
          quickPrice: prop.quickPrice || prop.quick_price || "",
          quickDining: prop.quickDining || prop.quick_dining || "",
          quickBestFor: prop.quickBestFor || prop.quick_best_for || "",
          // Prefer the new admin-managed facts list. For a property that has
          // never been saved through this list editor, seed it from the old
          // fixed 5 fields so nothing looks "lost" the first time it's opened.
          quickFacts: Array.isArray(prop.quickFacts) && prop.quickFacts.length > 0
            ? prop.quickFacts
            : [
                (prop.quickLocation || prop.quick_location) && { title: "Location", value: prop.quickLocation || prop.quick_location },
                (prop.quickRooms || prop.quick_rooms) && { title: "Rooms", value: prop.quickRooms || prop.quick_rooms },
                (prop.quickPrice || prop.quick_price) && { title: "Starting price", value: prop.quickPrice || prop.quick_price },
                (prop.quickDining || prop.quick_dining) && { title: "Dining", value: prop.quickDining || prop.quick_dining },
                (prop.quickBestFor || prop.quick_best_for) && { title: "Best for", value: prop.quickBestFor || prop.quick_best_for },
              ].filter(Boolean),
          quickFactTitleInput: "",
          quickFactValueInput: "",
          amenitiesEyebrow: prop.amenitiesEyebrow || prop.amenities_eyebrow || "",
          amenitiesTitle: prop.amenitiesTitle || prop.amenities_title || "",
          amenitiesDescription: prop.amenitiesDescription || prop.amenities_description || "",
          experiences: Array.isArray(prop.experiences)
            ? prop.experiences
                .map((e) => ({
                  title: (e && e.title) || "",
                  subtitle: (e && e.subtitle) || "",
                  image: (e && e.image) || "",
                  imageAlt: (e && e.imageAlt) || "",
                }))
                .filter((e) => e.title && e.image)
            : [],
          experienceTitleInput: "",
          experienceSubtitleInput: "",
          experienceImageInput: "",
          experienceImageAltInput: "",
          experiencesEyebrow: prop.experiencesEyebrow || prop.experiences_eyebrow || "",
          experiencesTitle: prop.experiencesTitle || prop.experiences_title || "",
          experiencesDescription: prop.experiencesDescription || prop.experiences_description || "",
          rooms: Array.isArray(prop.rooms)
            ? prop.rooms
                .map((r) => ({
                  category: (r && r.category) || "",
                  name: (r && r.name) || "",
                  description: (r && r.description) || "",
                  price: (r && r.price) || "",
                  priceUnit: (r && r.priceUnit) || "per person",
                  image: (r && r.image) || "",
                  imageAlt: (r && r.imageAlt) || "",
                }))
                .filter((r) => r.name && r.price)
            : [],
          roomCategoryInput: "",
          roomNameInput: "",
          roomDescriptionInput: "",
          roomPriceInput: "",
          roomImageInput: "",
          roomImageAltInput: "",
          roomsEyebrow: prop.roomsEyebrow || prop.rooms_eyebrow || "",
          roomsTitle: prop.roomsTitle || prop.rooms_title || "",
          roomsDescription: prop.roomsDescription || prop.rooms_description || "",
          reviews: Array.isArray(prop.reviews)
            ? prop.reviews
                .map((r) => ({
                  rating: Number((r && r.rating) || 5) || 5,
                  quote: (r && r.quote) || "",
                  guestName: (r && r.guestName) || "",
                }))
                .filter((r) => r.quote && r.guestName)
            : [],
          reviewRatingInput: "5",
          reviewQuoteInput: "",
          reviewGuestNameInput: "",
          reviewsEyebrow: prop.reviewsEyebrow || prop.reviews_eyebrow || "",
          reviewsTitle: prop.reviewsTitle || prop.reviews_title || "",
          reviewsDescription: prop.reviewsDescription || prop.reviews_description || "",
          reviewsCardTitle: prop.reviewsCardTitle || prop.reviews_card_title || "",
          reviewsCardDescription: prop.reviewsCardDescription || prop.reviews_card_description || "",
          reviewsCardButtonText: prop.reviewsCardButtonText || prop.reviews_card_button_text || "",
          reviewsCardButtonLink: prop.reviewsCardButtonLink || prop.reviews_card_button_link || "",
          faqs: Array.isArray(prop.faqs)
            ? prop.faqs
                .map((f) => ({
                  question: (f && f.question) || "",
                  answer: (f && f.answer) || "",
                }))
                .filter((f) => f.question && f.answer)
            : [],
          faqQuestionInput: "",
          faqAnswerInput: "",
          faqsEyebrow: prop.faqsEyebrow || prop.faqs_eyebrow || "",
          faqsTitle: prop.faqsTitle || prop.faqs_title || "",
          faqsDescription: prop.faqsDescription || prop.faqs_description || "",
          metaTitle: prop.metaTitle || "",
          metaDescription: prop.metaDescription || "",
          schemaMarkup: prop.schemaMarkup || "",
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const handlePropFileUpload = async (field, file) => {
    if (!file) return;
    setUploadingPropField(field);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewProp((prev) => ({ ...prev, [field]: data.url }));
      } else {
        const localUrl = URL.createObjectURL(file);
        setNewProp((prev) => ({ ...prev, [field]: localUrl }));
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setNewProp((prev) => ({ ...prev, [field]: localUrl }));
    } finally {
      setUploadingPropField(null);
    }
  };

  const handleMultipleFilesUpload = async (files, type) => {
    if (!files || files.length === 0) return;
    setUploadingPropField(type);
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.success) {
          uploadedUrls.push(data.url);
        } else {
          uploadedUrls.push(URL.createObjectURL(file));
        }
      } catch (err) {
        uploadedUrls.push(URL.createObjectURL(file));
      }
    }

    if (type === "gallery") {
      setNewProp((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedUrls],
      }));
    } else if (type === "videos") {
      setNewProp((prev) => ({
        ...prev,
        videos: [...(prev.videos || []), ...uploadedUrls],
      }));
    }
    setUploadingPropField(null);
  };

  const handleAddGalleryImageFromUrl = () => {
    if (!newProp.galleryInputUrl || !newProp.galleryInputUrl.trim()) return;
    setNewProp((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), prev.galleryInputUrl.trim()],
      galleryInputUrl: "",
    }));
  };

  const handleRemoveGalleryImage = (index) => {
    setNewProp((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddVideoFromUrl = () => {
    if (!newProp.videoInputUrl || !newProp.videoInputUrl.trim()) return;
    setNewProp((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), prev.videoInputUrl.trim()],
      videoInputUrl: "",
    }));
  };

  const handleRemoveVideo = (index) => {
    setNewProp((prev) => ({
      ...prev,
      videos: (prev.videos || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddAmenityItem = () => {
    if (!newProp.amenityTitleInput || !newProp.amenityTitleInput.trim()) return;
    setNewProp((prev) => {
      const list = Array.isArray(prev.amenities) ? [...prev.amenities] : [];
      const item = { title: prev.amenityTitleInput.trim(), desc: (prev.amenityBodyInput || "").trim() };
      if (editingAmenityIndex !== null) {
        list[editingAmenityIndex] = item;
      } else {
        list.push(item);
      }
      return { ...prev, amenities: list, amenityTitleInput: "", amenityBodyInput: "" };
    });
    setEditingAmenityIndex(null);
  };

  const handleEditAmenityItem = (index) => {
    const item = (newProp.amenities || [])[index];
    if (!item) return;
    setEditingAmenityIndex(index);
    setNewProp((prev) => ({ ...prev, amenityTitleInput: item.title || "", amenityBodyInput: item.desc || "" }));
  };

  const handleCancelEditAmenityItem = () => {
    setEditingAmenityIndex(null);
    setNewProp((prev) => ({ ...prev, amenityTitleInput: "", amenityBodyInput: "" }));
  };

  const handleRemoveAmenityItem = (index) => {
    if (editingAmenityIndex === index) handleCancelEditAmenityItem();
    setNewProp((prev) => ({
      ...prev,
      amenities: (prev.amenities || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddQuickFactItem = () => {
    if (!newProp.quickFactTitleInput || !newProp.quickFactTitleInput.trim()) return;
    if (!newProp.quickFactValueInput || !newProp.quickFactValueInput.trim()) return;
    setNewProp((prev) => {
      const list = Array.isArray(prev.quickFacts) ? [...prev.quickFacts] : [];
      const item = { title: prev.quickFactTitleInput.trim(), value: prev.quickFactValueInput.trim() };
      if (editingQuickFactIndex !== null) {
        list[editingQuickFactIndex] = item;
      } else {
        list.push(item);
      }
      return { ...prev, quickFacts: list, quickFactTitleInput: "", quickFactValueInput: "" };
    });
    setEditingQuickFactIndex(null);
  };

  const handleEditQuickFactItem = (index) => {
    const item = (newProp.quickFacts || [])[index];
    if (!item) return;
    setEditingQuickFactIndex(index);
    setNewProp((prev) => ({ ...prev, quickFactTitleInput: item.title || "", quickFactValueInput: item.value || "" }));
  };

  const handleCancelEditQuickFactItem = () => {
    setEditingQuickFactIndex(null);
    setNewProp((prev) => ({ ...prev, quickFactTitleInput: "", quickFactValueInput: "" }));
  };

  const handleRemoveQuickFactItem = (index) => {
    if (editingQuickFactIndex === index) handleCancelEditQuickFactItem();
    setNewProp((prev) => ({
      ...prev,
      quickFacts: (prev.quickFacts || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddExperienceItem = () => {
    if (!newProp.experienceTitleInput || !newProp.experienceTitleInput.trim()) return;
    if (!newProp.experienceImageInput || !newProp.experienceImageInput.trim()) return;
    setNewProp((prev) => {
      const list = Array.isArray(prev.experiences) ? [...prev.experiences] : [];
      const item = {
        title: prev.experienceTitleInput.trim(),
        subtitle: (prev.experienceSubtitleInput || "").trim(),
        image: prev.experienceImageInput.trim(),
        imageAlt: (prev.experienceImageAltInput || "").trim(),
      };
      if (editingExperienceIndex !== null) {
        list[editingExperienceIndex] = item;
      } else {
        list.push(item);
      }
      return { ...prev, experiences: list, experienceTitleInput: "", experienceSubtitleInput: "", experienceImageInput: "", experienceImageAltInput: "" };
    });
    setEditingExperienceIndex(null);
  };

  const handleEditExperienceItem = (index) => {
    const item = (newProp.experiences || [])[index];
    if (!item) return;
    setEditingExperienceIndex(index);
    setNewProp((prev) => ({
      ...prev,
      experienceTitleInput: item.title || "",
      experienceSubtitleInput: item.subtitle || "",
      experienceImageInput: item.image || "",
      experienceImageAltInput: item.imageAlt || "",
    }));
  };

  const handleCancelEditExperienceItem = () => {
    setEditingExperienceIndex(null);
    setNewProp((prev) => ({ ...prev, experienceTitleInput: "", experienceSubtitleInput: "", experienceImageInput: "", experienceImageAltInput: "" }));
  };

  const handleRemoveExperienceItem = (index) => {
    if (editingExperienceIndex === index) handleCancelEditExperienceItem();
    setNewProp((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddRoomItem = () => {
    if (!newProp.roomNameInput || !newProp.roomNameInput.trim()) return;
    if (!newProp.roomPriceInput || !newProp.roomPriceInput.trim()) return;
    setNewProp((prev) => {
      const list = Array.isArray(prev.rooms) ? [...prev.rooms] : [];
      const item = {
        category: (prev.roomCategoryInput || "").trim(),
        name: prev.roomNameInput.trim(),
        description: (prev.roomDescriptionInput || "").trim(),
        price: prev.roomPriceInput.trim(),
        priceUnit: "per person",
        image: (prev.roomImageInput || "").trim(),
        imageAlt: (prev.roomImageAltInput || "").trim(),
      };
      if (editingRoomIndex !== null) {
        list[editingRoomIndex] = item;
      } else {
        list.push(item);
      }
      return { ...prev, rooms: list, roomCategoryInput: "", roomNameInput: "", roomDescriptionInput: "", roomPriceInput: "", roomImageInput: "", roomImageAltInput: "" };
    });
    setEditingRoomIndex(null);
  };

  const handleEditRoomItem = (index) => {
    const item = (newProp.rooms || [])[index];
    if (!item) return;
    setEditingRoomIndex(index);
    setNewProp((prev) => ({
      ...prev,
      roomCategoryInput: item.category || "",
      roomNameInput: item.name || "",
      roomDescriptionInput: item.description || "",
      roomPriceInput: item.price || "",
      roomImageInput: item.image || "",
      roomImageAltInput: item.imageAlt || "",
    }));
  };

  const handleCancelEditRoomItem = () => {
    setEditingRoomIndex(null);
    setNewProp((prev) => ({ ...prev, roomCategoryInput: "", roomNameInput: "", roomDescriptionInput: "", roomPriceInput: "", roomImageInput: "", roomImageAltInput: "" }));
  };

  const handleRemoveRoomItem = (index) => {
    if (editingRoomIndex === index) handleCancelEditRoomItem();
    setNewProp((prev) => ({
      ...prev,
      rooms: (prev.rooms || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddReviewItem = () => {
    if (!newProp.reviewQuoteInput || !newProp.reviewQuoteInput.trim()) return;
    if (!newProp.reviewGuestNameInput || !newProp.reviewGuestNameInput.trim()) return;
    setNewProp((prev) => {
      const list = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
      const item = {
        rating: Number(prev.reviewRatingInput) || 5,
        quote: prev.reviewQuoteInput.trim(),
        guestName: prev.reviewGuestNameInput.trim(),
      };
      if (editingReviewIndex !== null) {
        list[editingReviewIndex] = item;
      } else {
        list.push(item);
      }
      return { ...prev, reviews: list, reviewRatingInput: "5", reviewQuoteInput: "", reviewGuestNameInput: "" };
    });
    setEditingReviewIndex(null);
  };

  const handleEditReviewItem = (index) => {
    const item = (newProp.reviews || [])[index];
    if (!item) return;
    setEditingReviewIndex(index);
    setNewProp((prev) => ({
      ...prev,
      reviewRatingInput: String(item.rating || 5),
      reviewQuoteInput: item.quote || "",
      reviewGuestNameInput: item.guestName || "",
    }));
  };

  const handleCancelEditReviewItem = () => {
    setEditingReviewIndex(null);
    setNewProp((prev) => ({ ...prev, reviewRatingInput: "5", reviewQuoteInput: "", reviewGuestNameInput: "" }));
  };

  const handleRemoveReviewItem = (index) => {
    if (editingReviewIndex === index) handleCancelEditReviewItem();
    setNewProp((prev) => ({
      ...prev,
      reviews: (prev.reviews || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddFaqItem = () => {
    if (!newProp.faqQuestionInput || !newProp.faqQuestionInput.trim()) return;
    if (!newProp.faqAnswerInput || !newProp.faqAnswerInput.trim()) return;
    setNewProp((prev) => {
      const list = Array.isArray(prev.faqs) ? [...prev.faqs] : [];
      const item = {
        question: prev.faqQuestionInput.trim(),
        answer: prev.faqAnswerInput.trim(),
      };
      if (editingFaqIndex !== null) {
        list[editingFaqIndex] = item;
      } else {
        list.push(item);
      }
      return { ...prev, faqs: list, faqQuestionInput: "", faqAnswerInput: "" };
    });
    setEditingFaqIndex(null);
  };

  const handleEditFaqItem = (index) => {
    const item = (newProp.faqs || [])[index];
    if (!item) return;
    setEditingFaqIndex(index);
    setNewProp((prev) => ({ ...prev, faqQuestionInput: item.question || "", faqAnswerInput: item.answer || "" }));
  };

  const handleCancelEditFaqItem = () => {
    setEditingFaqIndex(null);
    setNewProp((prev) => ({ ...prev, faqQuestionInput: "", faqAnswerInput: "" }));
  };

  const handleRemoveFaqItem = (index) => {
    if (editingFaqIndex === index) handleCancelEditFaqItem();
    setNewProp((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const finalGallery = (newProp.gallery && newProp.gallery.length > 0)
      ? newProp.gallery
      : [newProp.heroImage || "/assets/img/slider/hero-bg.jpg"];

    // newProp.videos is the source of truth for the multi-video list (it is
    // already seeded from the legacy single `video` field on load — see the
    // fetch effect above). Do NOT fall back to newProp.videoUrl here: that
    // field is never edited by the user, so falling back to it would
    // resurrect a video the admin just deleted from the list.
    const finalVideos = Array.isArray(newProp.videos) ? newProp.videos : [];

    const generatedSlug = newProp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload = {
      slug: isEditMode ? (existingSlug || generatedSlug) : generatedSlug,
      name: newProp.name,
      location: newProp.location,
      state: newProp.state,
      type: newProp.type,
      tagline: newProp.tagline,
      address: newProp.address || "",
      phone: newProp.phone || newProp.mobile_no || "",
      heroTitle: newProp.heroTitle || "",
      heroSubheading: newProp.heroSubheading || "",
      heroImage: newProp.heroImage || "/assets/img/slider/hero-bg.jpg",
      heroImageAlt: newProp.heroImageAlt || "",
      thumbImage: newProp.thumbImage || "/assets/img/slider/2.jpg",
      thumbImageAlt: newProp.thumbImageAlt || "",
      description: newProp.description || newProp.tagline,
      video: finalVideos[0] || "",
      videos: finalVideos,
      attractions: typeof newProp.attractions === "string" ? newProp.attractions.split(",").map((s) => s.trim()).filter(Boolean) : newProp.attractions,
      amenities: Array.isArray(newProp.amenities)
        ? newProp.amenities
            .map((a) => (a && a.title ? (a.desc ? `${a.title}: ${a.desc}` : a.title) : ""))
            .filter(Boolean)
        : (typeof newProp.amenities === "string" ? newProp.amenities.split(",").map((s) => s.trim()).filter(Boolean) : []),
      badges: typeof newProp.badges === "string" ? newProp.badges.split(",").map((s) => s.trim()).filter(Boolean) : (Array.isArray(newProp.badges) ? newProp.badges : []),
      gallery: finalGallery,
      // The old fixed 5 fields are retired in favor of the quickFacts list
      // below — sent blank here so a save from this form always clears them
      // and the public page never falls back to stale values that were
      // "deleted" by removing them from the list.
      quickLocation: "",
      quickRooms: "",
      quickPrice: "",
      quickDining: "",
      quickBestFor: "",
      quickFacts: (newProp.quickFacts || []).filter((f) => f && f.title && f.title.trim() && f.value && f.value.trim()),
      amenitiesEyebrow: newProp.amenitiesEyebrow || "",
      amenitiesTitle: newProp.amenitiesTitle || "",
      amenitiesDescription: newProp.amenitiesDescription || "",
      experiences: Array.isArray(newProp.experiences)
        ? newProp.experiences.filter((exp) => exp && exp.title && exp.image)
        : [],
      experiencesEyebrow: newProp.experiencesEyebrow || "",
      experiencesTitle: newProp.experiencesTitle || "",
      experiencesDescription: newProp.experiencesDescription || "",
      rooms: Array.isArray(newProp.rooms)
        ? newProp.rooms.filter((room) => room && room.name && room.price)
        : [],
      roomsEyebrow: newProp.roomsEyebrow || "",
      roomsTitle: newProp.roomsTitle || "",
      roomsDescription: newProp.roomsDescription || "",
      reviews: Array.isArray(newProp.reviews)
        ? newProp.reviews.filter((r) => r && r.quote && r.guestName)
        : [],
      reviewsEyebrow: newProp.reviewsEyebrow || "",
      reviewsTitle: newProp.reviewsTitle || "",
      reviewsDescription: newProp.reviewsDescription || "",
      reviewsCardTitle: newProp.reviewsCardTitle || "",
      reviewsCardDescription: newProp.reviewsCardDescription || "",
      reviewsCardButtonText: newProp.reviewsCardButtonText || "",
      reviewsCardButtonLink: newProp.reviewsCardButtonLink || "",
      faqs: Array.isArray(newProp.faqs)
        ? newProp.faqs.filter((f) => f && f.question && f.answer)
        : [],
      faqsEyebrow: newProp.faqsEyebrow || "",
      faqsTitle: newProp.faqsTitle || "",
      faqsDescription: newProp.faqsDescription || "",
      metaTitle: newProp.metaTitle || "",
      metaDescription: newProp.metaDescription || "",
      schemaMarkup: newProp.schemaMarkup || "",
    };

    if (isEditMode) {
      payload.id = id;
      try {
        const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert("✅ Property updated successfully!");
          setSaving(false);
        } else {
          alert(data.message || "Error updating property");
          setSaving(false);
        }
      } catch (err) {
        alert("Network error while updating property");
        setSaving(false);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/properties`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert("✅ Property added successfully with images and video!");
          setSaving(false);
          // Stay on the property form (not the list) but switch this page
          // into edit mode for the property that was just created, so a
          // second Save updates it instead of creating a duplicate.
          const newId = data.data?.id || data.propertyId;
          if (newId) {
            navigate(`/admin/properties/${newId}/edit`, { replace: true });
          }
        } else {
          alert(data.message || "Error adding property");
          setSaving(false);
        }
      } catch (err) {
        alert("Network error while adding property");
        setSaving(false);
      }
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#F8FAFC" }}>
        <span className="spinner-border text-primary" role="status"></span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center gap-3" style={{ minHeight: "100vh", background: "#F8FAFC" }}>
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>Property not found.</div>
        <button onClick={goBackToList} className="btn btn-primary btn-sm" style={{ borderRadius: "8px" }}>
          ← Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9" }}>
      <form onSubmit={handleSubmit}>
        {/* Sticky page header — always-visible Save/Cancel instead of scrolling to a
            buried footer, and a clear "this is a page, not a popup" identity. */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between flex-wrap gap-3"
            style={{ maxWidth: "1040px", margin: "0 auto", padding: "16px 24px" }}
          >
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                onClick={goBackToList}
                className="btn btn-light btn-sm"
                style={{ borderRadius: "8px", fontWeight: "600" }}
              >
                ← Back
              </button>
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                  {isEditMode ? "✏️ Edit Property" : "🏨 Add New Property"}
                </h4>
                <div style={{ fontSize: "12.5px", color: "#64748B" }}>
                  {isEditMode ? (newProp.name || "Untitled property") : "Fill in the details below and save"}
                </div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="button" onClick={goBackToList} className="btn btn-light" style={{ borderRadius: "8px", fontWeight: "600" }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ borderRadius: "8px", fontWeight: "600", padding: "8px 24px" }}
              >
                {saving ? "Saving..." : isEditMode ? "💾 Update Property" : "💾 Save Property"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "28px 24px 60px" }}>
          <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-600">Property Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Wanderama Beach Resort"
                  value={newProp.name}
                  onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-600">Location (City)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Diu, Daman"
                  value={newProp.location}
                  onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-600">State (All India States Supported)</label>
                <select
                  className="form-select"
                  value={newProp.state}
                  onChange={(e) => setNewProp({ ...newProp, state: e.target.value })}
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-600">Property Type</label>
                <select
                  className="form-select"
                  value={newProp.type}
                  onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Villa">Villa</option>
                  <option value="Stay">Stay</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-600">Mobile / Contact Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. +91 98765 43210"
                  value={newProp.phone || ""}
                  onChange={(e) => setNewProp({ ...newProp, phone: e.target.value })}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-600">Property Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Near Nagoa Beach, Main Road, Diu, Gujarat 362520"
                  value={newProp.address || ""}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-600">Tagline Summary</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Oceanfront luxury resort with private infinity pool"
                  value={newProp.tagline}
                  onChange={(e) => setNewProp({ ...newProp, tagline: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-600">Full Description</label>
                <div className="small text-muted mb-1">Plain text only. To add paragraph breaks, leave one blank line between paragraphs.</div>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter detailed description about the property..."
                  value={newProp.description || ""}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>

          <SectionCard icon="✨" title="Property Details Hero Banner Configuration" tag="Hero Banner">
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label micro fw-600 mb-1">Hero Subheading (Top Small Text)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. GOKUL RESORT BY WANDERAMA • SASAN GIR, GUJARAT"
                  value={newProp.heroSubheading || ""}
                  onChange={(e) => setNewProp({ ...newProp, heroSubheading: e.target.value })}
                />
                <small className="text-muted micro d-block mt-1">Leave blank to auto-generate: [NAME] BY WANDERAMA • [CITY], [STATE]</small>
              </div>
              <div className="col-md-6">
                <label className="form-label micro fw-600 mb-1">Hero Main Heading (Big White Title)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. Gokul Resort in Sasan Gir"
                  value={newProp.heroTitle || ""}
                  onChange={(e) => setNewProp({ ...newProp, heroTitle: e.target.value })}
                />
                <small className="text-muted micro d-block mt-1">Leave blank to auto-generate: [Property Name] in [Location]</small>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon="🌄" title="1. Property Hero Section Image (Top Details Banner)" tag="Hero Banner Image">
            <HeadingFieldsCaption text="Upload, update, or remove the background image shown ONLY at the top full-width hero section of this property's details page." />
            <div className="row g-3">
              <div className="col-md-7">
                <div className="mb-2">
                  <label className="form-label micro text-muted fw-600 mb-1">Option A: Upload Hero File from PC</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePropFileUpload("heroImage", e.target.files[0]);
                        }
                      }}
                    />
                    {uploadingPropField === "heroImage" && (
                      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label micro text-muted fw-600 mb-1">Option B: Enter Web Image Link / Path</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="https://images.unsplash.com/... or /assets/img/slider/1.jpg"
                    value={newProp.heroImage || ""}
                    onChange={(e) => setNewProp({ ...newProp, heroImage: e.target.value })}
                  />
                  <small className="text-muted">This image appears as the main hero background banner.</small>
                </div>

                <div className="mb-2">
                  <label className="form-label micro text-muted fw-600 mb-1">Alt Text (for accessibility &amp; SEO)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Resort exterior view at sunset"
                    value={newProp.heroImageAlt || ""}
                    onChange={(e) => setNewProp({ ...newProp, heroImageAlt: e.target.value })}
                  />
                </div>

                {newProp.heroImage && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-1"
                    style={{ fontSize: "12px", borderRadius: "6px" }}
                    onClick={() => setNewProp({ ...newProp, heroImage: "", heroImageAlt: "" })}
                  >
                    🗑️ Delete / Clear Hero Image
                  </button>
                )}
              </div>

              <div className="col-md-5">
                <label className="form-label micro text-muted fw-600 mb-1">Hero Image Preview</label>
                <div style={{ height: "115px", borderRadius: "10px", overflow: "hidden", border: "1px solid #CBD5E1", position: "relative" }}>
                  {newProp.heroImage ? (
                    <img
                      src={resolveImageUrl(newProp.heroImage)}
                      alt="Hero Preview"
                      referrerPolicy="no-referrer"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.src = "/assets/img/slider/hero-bg.jpg"; }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light text-muted small p-2 text-center">
                      No Hero Image set (Fallback image will be used)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon="🖼️" title="2. Property Showcase / Thumbnail Image (Listing & About Section)" tag="Thumbnail Image">
            <HeadingFieldsCaption text="Upload, update, or remove the showcase image used on destination listing cards and in the 'About Property' section." />
            <div className="row g-3">
              <div className="col-md-7">
                <div className="mb-2">
                  <label className="form-label micro text-muted fw-600 mb-1">Option A: Upload Thumbnail File from PC</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePropFileUpload("thumbImage", e.target.files[0]);
                        }
                      }}
                    />
                    {uploadingPropField === "thumbImage" && (
                      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label micro text-muted fw-600 mb-1">Option B: Enter Thumbnail URL / Path</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="https://images.unsplash.com/... or /assets/img/slider/2.jpg"
                    value={newProp.thumbImage || ""}
                    onChange={(e) => setNewProp({ ...newProp, thumbImage: e.target.value })}
                  />
                  <small className="text-muted">This image appears in the 'About Property' section and listing cards.</small>
                </div>

                <div className="mb-2">
                  <label className="form-label micro text-muted fw-600 mb-1">Alt Text (for accessibility &amp; SEO)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Gokul Resort thumbnail"
                    value={newProp.thumbImageAlt || ""}
                    onChange={(e) => setNewProp({ ...newProp, thumbImageAlt: e.target.value })}
                  />
                </div>

                {newProp.thumbImage && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-1"
                    style={{ fontSize: "12px", borderRadius: "6px" }}
                    onClick={() => setNewProp({ ...newProp, thumbImage: "", thumbImageAlt: "" })}
                  >
                    🗑️ Delete / Clear Thumbnail Image
                  </button>
                )}
              </div>

              <div className="col-md-5">
                <label className="form-label micro text-muted fw-600 mb-1">Thumbnail Preview</label>
                <div style={{ height: "115px", borderRadius: "10px", overflow: "hidden", border: "1px solid #CBD5E1" }}>
                  {newProp.thumbImage ? (
                    <img
                      src={resolveImageUrl(newProp.thumbImage)}
                      alt="Thumb Preview"
                      referrerPolicy="no-referrer"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.src = "/assets/img/slider/2.jpg"; }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light text-muted small p-2 text-center">
                      No Thumbnail set (Fallback image will be used)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon="🌆" title={`3. Multiple Gallery Showcase Images (${newProp.gallery ? newProp.gallery.length : 0} Added)`} tag="Multi Image Upload & Links">
            <div className="row g-3 mb-2">
              <div className="col-md-6">
                <label className="form-label micro text-muted fw-600 mb-1">Option A: Upload Multiple PC Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-control form-control-sm"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleMultipleFilesUpload(e.target.files, "gallery");
                    }
                  }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label micro text-muted fw-600 mb-1">Option B: Enter Web Image Link</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="https://images.unsplash.com/..."
                    value={newProp.galleryInputUrl || ""}
                    onChange={(e) => setNewProp({ ...newProp, galleryInputUrl: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImageFromUrl}
                    className="btn btn-primary btn-sm flex-shrink-0"
                    style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {uploadingPropField === "gallery" && (
              <div className="alert alert-info py-1 px-2 small mb-2">
                ⏳ Uploading gallery images... Please wait.
              </div>
            )}

            {newProp.gallery && newProp.gallery.length > 0 && (
              <div className="d-flex flex-wrap gap-2 p-2 bg-white rounded-2 border" style={{ maxHeight: "150px", overflowY: "auto" }}>
                {newProp.gallery.map((gUrl, gIdx) => (
                  <div key={gIdx} style={{ position: "relative", width: "70px", height: "70px", borderRadius: "8px", overflow: "hidden", border: "1px solid #CBD5E1" }}>
                    <img
                      src={resolveImageUrl(gUrl)}
                      alt={`Gallery ${gIdx + 1}`}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/img/slider/hero-bg.jpg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(gIdx)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(220, 38, 38, 0.9)",
                        color: "#FFF",
                        border: "none",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard icon="🎥" title="4. Multiple Tour Videos (MP4 / WebM / YouTube)" tag="Multi Video Upload & YouTube">
            <div className="row g-3 mb-2">
              <div className="col-md-6">
                <label className="form-label micro text-muted fw-600 mb-1">Option A: Upload Video File(s) from PC (.mp4, .webm)</label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="form-control form-control-sm"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleMultipleFilesUpload(e.target.files, "videos");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label micro text-muted fw-600 mb-1">Option B: Enter Video Link (MP4 / YouTube)</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="https://example.com/tour.mp4 or https://youtube.com/..."
                    value={newProp.videoInputUrl || ""}
                    onChange={(e) => setNewProp({ ...newProp, videoInputUrl: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={handleAddVideoFromUrl}
                    className="btn btn-success btn-sm flex-shrink-0"
                    style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
                  >
                    + Add Video
                  </button>
                </div>
              </div>
            </div>

            {uploadingPropField === "videos" && (
              <div className="alert alert-info py-1 px-2 small mb-2">
                ⏳ Uploading video file(s)... Please wait.
              </div>
            )}

            {newProp.videos && newProp.videos.length > 0 && (
              <div className="d-flex flex-column gap-2 p-2 bg-white rounded-2 border" style={{ maxHeight: "160px", overflowY: "auto" }}>
                {newProp.videos.map((vUrl, vIdx) => (
                  <div key={vIdx} className="d-flex align-items-center justify-content-between p-2 bg-light rounded-2 border">
                    <div className="d-flex align-items-center gap-2 text-truncate" style={{ fontSize: "13px" }}>
                      <span style={{ fontWeight: "700", color: "#0F172A" }}>Video #{vIdx + 1}:</span>
                      <span className="text-muted text-truncate" style={{ maxWidth: "400px" }}>{vUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(vIdx)}
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                      style={{ fontSize: "11px", fontWeight: "600" }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
            <label className="form-label small fw-600">Key Attractions (Comma-separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Private Beach, Sunset Deck, Fine Dining"
              value={newProp.attractions}
              onChange={(e) => setNewProp({ ...newProp, attractions: e.target.value })}
            />
          </div>

          <SectionCard icon="🛎️" title="Amenities & Facilities" tag={`${newProp.amenities ? newProp.amenities.length : 0} added`}>
            <SubPanel title="Add an amenity" isEditing={editingAmenityIndex !== null} onCancel={handleCancelEditAmenityItem}>
              <div className="row g-2 mb-2">
                <div className="col-md-12">
                  <Field label="Title">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Free WiFi"
                      value={newProp.amenityTitleInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, amenityTitleInput: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <div className="row g-2 align-items-end">
                <div className="col-md-9">
                  <Field label="Body / description (optional)">
                    <RichTextEditor
                      rows={1}
                      placeholder="Short description of this amenity"
                      value={newProp.amenityBodyInput || ""}
                      onChange={(html) => setNewProp({ ...newProp, amenityBodyInput: html })}
                    />
                  </Field>
                </div>
                <div className="col-md-3">
                  <button
                    type="button"
                    onClick={handleAddAmenityItem}
                    className={`btn btn-sm w-100 ${editingAmenityIndex !== null ? "btn-success" : "btn-primary"}`}
                    style={{ borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", padding: "7px 0" }}
                  >
                    {editingAmenityIndex !== null ? "✔ Update Amenity" : "+ Add Amenity"}
                  </button>
                </div>
              </div>
            </SubPanel>

            {newProp.amenities && newProp.amenities.length > 0 ? (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "2px" }}>
                {newProp.amenities.map((am, aIdx) => (
                  <div key={aIdx} className={`d-flex align-items-center justify-content-between p-3 rounded-3 border ${editingAmenityIndex === aIdx ? "bg-warning-subtle border-warning" : "bg-white"}`}>
                    <div className="d-flex align-items-start gap-2 text-truncate">
                      <span
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#EEF2FF", color: "#4338CA", fontSize: "11px", fontWeight: "700" }}
                      >
                        {aIdx + 1}
                      </span>
                      <div className="text-truncate" style={{ fontSize: "13px" }}>
                        <span style={{ fontWeight: "700", color: "#0F172A" }}>{am.title}</span>
                        {am.desc && <span className="text-muted"> — {stripHtml(am.desc)}</span>}
                      </div>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditAmenityItem(aIdx)}
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenityItem(aIdx)}
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted micro py-3">No amenities added yet.</div>
            )}
          </SectionCard>

          <SectionCard icon="🎯" title="Things To Do / Experiences Section" tag="Shown below Amenities on the property page">
            <HeadingFieldsCaption text="Section heading shown above the experience cards on the property page" />
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <Field label="Eyebrow">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Default: EXPERIENCES"
                    value={newProp.experiencesEyebrow || ""}
                    onChange={(e) => setNewProp({ ...newProp, experiencesEyebrow: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Heading">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder={`Default: Things to do at ${newProp.name || "this property"}`}
                    value={newProp.experiencesTitle || ""}
                    onChange={(e) => setNewProp({ ...newProp, experiencesTitle: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Subtext (optional)">
                  <RichTextEditor
                    rows={1}
                    placeholder="Short description"
                    value={newProp.experiencesDescription || ""}
                    onChange={(html) => setNewProp({ ...newProp, experiencesDescription: html })}
                  />
                </Field>
              </div>
            </div>

            <SubPanel title={`Add an experience (${newProp.experiences ? newProp.experiences.length : 0} added)`} isEditing={editingExperienceIndex !== null} onCancel={handleCancelEditExperienceItem}>
              <div className="row g-2 mb-2">
                <div className="col-md-4">
                  <Field label="Card Image">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePropFileUpload("experienceImageInput", e.target.files[0]);
                        }
                      }}
                    />
                  </Field>
                  {uploadingPropField === "experienceImageInput" && (
                    <div className="text-info micro mt-1">⏳ Uploading...</div>
                  )}
                  {newProp.experienceImageInput && (
                    <div className="mt-2" style={{ width: "100%", height: "60px", borderRadius: "6px", overflow: "hidden", border: "1px solid #CBD5E1" }}>
                      <img
                        src={resolveImageUrl(newProp.experienceImageInput)}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <Field label="Title">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Morning Trek"
                      value={newProp.experienceTitleInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, experienceTitleInput: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="col-md-4">
                  <Field label="Image Alt Text">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Describe this image"
                      value={newProp.experienceImageAltInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, experienceImageAltInput: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <div className="row g-2 align-items-end">
                <div className="col-md-9">
                  <Field label="Subtitle">
                    <RichTextEditor
                      rows={1}
                      placeholder="Explore natural surroundings"
                      value={newProp.experienceSubtitleInput || ""}
                      onChange={(html) => setNewProp({ ...newProp, experienceSubtitleInput: html })}
                    />
                  </Field>
                </div>
                <div className="col-md-3">
                  <button
                    type="button"
                    onClick={handleAddExperienceItem}
                    className={`btn btn-sm w-100 ${editingExperienceIndex !== null ? "btn-success" : "btn-primary"}`}
                    style={{ borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", padding: "7px 0" }}
                  >
                    {editingExperienceIndex !== null ? "✔ Update Experience" : "+ Add Experience"}
                  </button>
                </div>
              </div>
            </SubPanel>

            {newProp.experiences && newProp.experiences.length > 0 ? (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "2px" }}>
                {newProp.experiences.map((exp, eIdx) => (
                  <div key={eIdx} className={`d-flex align-items-center justify-content-between p-3 rounded-3 border ${editingExperienceIndex === eIdx ? "bg-warning-subtle border-warning" : "bg-white"}`}>
                    <div className="d-flex align-items-center gap-3 text-truncate">
                      <div style={{ width: "44px", height: "44px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #CBD5E1" }}>
                        <img
                          src={resolveImageUrl(exp.image)}
                          alt={exp.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="text-truncate" style={{ fontSize: "13px" }}>
                        <span style={{ fontWeight: "700", color: "#0F172A" }} className="d-block">{exp.title}</span>
                        {exp.subtitle && <span className="text-muted">{stripHtml(exp.subtitle)}</span>}
                      </div>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditExperienceItem(eIdx)}
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperienceItem(eIdx)}
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted micro py-3">No experiences added yet.</div>
            )}
          </SectionCard>

          <SectionCard icon="🛏️" title="Rooms & Accommodation Section" tag="Shown as room/stay option cards on the property page">
            <HeadingFieldsCaption text="Section heading shown above the room cards on the property page" />
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <Field label="Eyebrow">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Default: ROOMS & ACCOMMODATION"
                    value={newProp.roomsEyebrow || ""}
                    onChange={(e) => setNewProp({ ...newProp, roomsEyebrow: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Heading">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Default: Choose the stay that fits your group"
                    value={newProp.roomsTitle || ""}
                    onChange={(e) => setNewProp({ ...newProp, roomsTitle: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Subtext (optional)">
                  <RichTextEditor
                    rows={1}
                    placeholder="Short description"
                    value={newProp.roomsDescription || ""}
                    onChange={(html) => setNewProp({ ...newProp, roomsDescription: html })}
                  />
                </Field>
              </div>
            </div>

            <SubPanel title={`Add a room / stay option (${newProp.rooms ? newProp.rooms.length : 0} added)`} isEditing={editingRoomIndex !== null} onCancel={handleCancelEditRoomItem}>
              <div className="row g-2 mb-2">
                <div className="col-md-3">
                  <Field label="Room Image">
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePropFileUpload("roomImageInput", e.target.files[0]);
                        }
                      }}
                    />
                  </Field>
                  {uploadingPropField === "roomImageInput" && (
                    <div className="text-info micro mt-1">⏳ Uploading...</div>
                  )}
                  {newProp.roomImageInput && (
                    <div className="mt-2" style={{ width: "100%", height: "50px", borderRadius: "6px", overflow: "hidden", border: "1px solid #CBD5E1" }}>
                      <img
                        src={resolveImageUrl(newProp.roomImageInput)}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-3">
                  <Field label="Category">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Premium AC Room"
                      value={newProp.roomCategoryInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, roomCategoryInput: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="col-md-3">
                  <Field label="Room Name">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Double Sharing"
                      value={newProp.roomNameInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, roomNameInput: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="col-md-3">
                  <Field label="Price (₹ per person)">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="2750"
                      value={newProp.roomPriceInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, roomPriceInput: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <Field label="Description">
                    <RichTextEditor
                      rows={1}
                      placeholder="King-size bed, attached washroom..."
                      value={newProp.roomDescriptionInput || ""}
                      onChange={(html) => setNewProp({ ...newProp, roomDescriptionInput: html })}
                    />
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field label="Image Alt Text">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Describe this room image"
                      value={newProp.roomImageAltInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, roomImageAltInput: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <div className="row g-2 align-items-end">
                <div className="col-md-3 offset-md-9">
                  <button
                    type="button"
                    onClick={handleAddRoomItem}
                    className={`btn btn-sm w-100 ${editingRoomIndex !== null ? "btn-success" : "btn-primary"}`}
                    style={{ borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", padding: "7px 0" }}
                  >
                    {editingRoomIndex !== null ? "✔ Update Room" : "+ Add Room"}
                  </button>
                </div>
              </div>
            </SubPanel>

            {newProp.rooms && newProp.rooms.length > 0 ? (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "2px" }}>
                {newProp.rooms.map((room, rIdx) => (
                  <div key={rIdx} className={`d-flex align-items-center justify-content-between p-3 rounded-3 border ${editingRoomIndex === rIdx ? "bg-warning-subtle border-warning" : "bg-white"}`}>
                    <div className="d-flex align-items-center gap-3 text-truncate">
                      <div style={{ width: "44px", height: "44px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #CBD5E1" }}>
                        <img
                          src={resolveImageUrl(room.image)}
                          alt={room.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="text-truncate" style={{ fontSize: "13px" }}>
                        {room.category && <span className="text-muted d-block micro">{room.category}</span>}
                        <span style={{ fontWeight: "700", color: "#0F172A" }}>{room.name}</span>
                        <span className="text-muted"> — ₹{room.price} {room.priceUnit}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditRoomItem(rIdx)}
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRoomItem(rIdx)}
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted micro py-3">No rooms added yet.</div>
            )}
          </SectionCard>

          <SectionCard icon="⭐" title="Guest Reviews Section" tag="Shown as guest review cards on the property page">
            <HeadingFieldsCaption text="Section heading shown above the review cards on the property page" />
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <Field label="Eyebrow">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Default: GUEST REVIEWS"
                    value={newProp.reviewsEyebrow || ""}
                    onChange={(e) => setNewProp({ ...newProp, reviewsEyebrow: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Heading">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Default: Build trust with real guest experiences"
                    value={newProp.reviewsTitle || ""}
                    onChange={(e) => setNewProp({ ...newProp, reviewsTitle: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Subtext (optional)">
                  <RichTextEditor
                    rows={1}
                    placeholder="Short description"
                    value={newProp.reviewsDescription || ""}
                    onChange={(html) => setNewProp({ ...newProp, reviewsDescription: html })}
                  />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-3 border p-3 mb-3">
              <div className="fw-700 text-dark mb-2" style={{ fontSize: "12.5px" }}>Feedback call-to-action card</div>
              <div className="row g-2">
                <div className="col-md-4">
                  <Field label="Card title">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Default: Guest feedback"
                      value={newProp.reviewsCardTitle || ""}
                      onChange={(e) => setNewProp({ ...newProp, reviewsCardTitle: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="col-md-4">
                  <Field label="Card description (optional)">
                    <RichTextEditor
                      rows={1}
                      placeholder="Short description"
                      value={newProp.reviewsCardDescription || ""}
                      onChange={(html) => setNewProp({ ...newProp, reviewsCardDescription: html })}
                    />
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field label="Button text">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Default: Read Reviews"
                      value={newProp.reviewsCardButtonText || ""}
                      onChange={(e) => setNewProp({ ...newProp, reviewsCardButtonText: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="col-md-2">
                  <Field label="Button link">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Default: /contact"
                      value={newProp.reviewsCardButtonLink || ""}
                      onChange={(e) => setNewProp({ ...newProp, reviewsCardButtonLink: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <SubPanel title={`Add a guest review (${newProp.reviews ? newProp.reviews.length : 0} added)`} isEditing={editingReviewIndex !== null} onCancel={handleCancelEditReviewItem}>
              <div className="row g-2 mb-2">
                <div className="col-md-3">
                  <Field label="Rating">
                    <select
                      className="form-select form-select-sm"
                      value={newProp.reviewRatingInput || "5"}
                      onChange={(e) => setNewProp({ ...newProp, reviewRatingInput: e.target.value })}
                    >
                      <option value="5">★★★★★ (5)</option>
                      <option value="4">★★★★☆ (4)</option>
                      <option value="3">★★★☆☆ (3)</option>
                      <option value="2">★★☆☆☆ (2)</option>
                      <option value="1">★☆☆☆☆ (1)</option>
                    </select>
                  </Field>
                </div>
                <div className="col-md-9">
                  <Field label="Guest Name">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Tejas Rathod"
                      value={newProp.reviewGuestNameInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, reviewGuestNameInput: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <div className="row g-2 align-items-end">
                <div className="col-md-9">
                  <Field label="Review Quote">
                    <RichTextEditor
                      rows={1}
                      placeholder="One of the amazing resorts... Great service and comfy rooms."
                      value={newProp.reviewQuoteInput || ""}
                      onChange={(html) => setNewProp({ ...newProp, reviewQuoteInput: html })}
                    />
                  </Field>
                </div>
                <div className="col-md-3">
                  <button
                    type="button"
                    onClick={handleAddReviewItem}
                    className={`btn btn-sm w-100 ${editingReviewIndex !== null ? "btn-success" : "btn-primary"}`}
                    style={{ borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", padding: "7px 0" }}
                  >
                    {editingReviewIndex !== null ? "✔ Update Review" : "+ Add Review"}
                  </button>
                </div>
              </div>
            </SubPanel>

            {newProp.reviews && newProp.reviews.length > 0 ? (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "2px" }}>
                {newProp.reviews.map((rev, revIdx) => (
                  <div key={revIdx} className={`d-flex align-items-center justify-content-between p-3 rounded-3 border ${editingReviewIndex === revIdx ? "bg-warning-subtle border-warning" : "bg-white"}`}>
                    <div className="text-truncate" style={{ fontSize: "13px" }}>
                      <span className="text-warning d-block micro">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                      <span className="text-muted">"{stripHtml(rev.quote)}"</span>
                      <span style={{ fontWeight: "700", color: "#0F172A" }} className="d-block">{rev.guestName}</span>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditReviewItem(revIdx)}
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveReviewItem(revIdx)}
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted micro py-3">No reviews added yet.</div>
            )}
          </SectionCard>

          <SectionCard icon="❓" title="FAQs Section" tag="Shown as an expandable FAQ accordion on the property page">
            <HeadingFieldsCaption text="Section heading shown above the FAQ accordion on the property page" />
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <Field label="Eyebrow">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Default: FAQs"
                    value={newProp.faqsEyebrow || ""}
                    onChange={(e) => setNewProp({ ...newProp, faqsEyebrow: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Heading">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Default: Frequently asked questions"
                    value={newProp.faqsTitle || ""}
                    onChange={(e) => setNewProp({ ...newProp, faqsTitle: e.target.value })}
                  />
                </Field>
              </div>
              <div className="col-md-4">
                <Field label="Subtext (optional)">
                  <RichTextEditor
                    rows={1}
                    placeholder="Short description"
                    value={newProp.faqsDescription || ""}
                    onChange={(html) => setNewProp({ ...newProp, faqsDescription: html })}
                  />
                </Field>
              </div>
            </div>

            <SubPanel title={`Add a question (${newProp.faqs ? newProp.faqs.length : 0} added)`} isEditing={editingFaqIndex !== null} onCancel={handleCancelEditFaqItem}>
              <div className="row g-2 mb-2">
                <div className="col-md-12">
                  <Field label="Question">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="What time is check-in and check-out?"
                      value={newProp.faqQuestionInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, faqQuestionInput: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
              <div className="row g-2 align-items-end">
                <div className="col-md-9">
                  <Field label="Answer">
                    <RichTextEditor
                      rows={1}
                      placeholder="Check-in is at 12 PM and check-out is at 11 AM."
                      value={newProp.faqAnswerInput || ""}
                      onChange={(html) => setNewProp({ ...newProp, faqAnswerInput: html })}
                    />
                  </Field>
                </div>
                <div className="col-md-3">
                  <button
                    type="button"
                    onClick={handleAddFaqItem}
                    className={`btn btn-sm w-100 ${editingFaqIndex !== null ? "btn-success" : "btn-primary"}`}
                    style={{ borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", padding: "7px 0" }}
                  >
                    {editingFaqIndex !== null ? "✔ Update Question" : "+ Add Question"}
                  </button>
                </div>
              </div>
            </SubPanel>

            {newProp.faqs && newProp.faqs.length > 0 ? (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "2px" }}>
                {newProp.faqs.map((faq, faqIdx) => (
                  <div key={faqIdx} className={`d-flex align-items-center justify-content-between p-3 rounded-3 border ${editingFaqIndex === faqIdx ? "bg-warning-subtle border-warning" : "bg-white"}`}>
                    <div className="text-truncate" style={{ fontSize: "13px" }}>
                      <span style={{ fontWeight: "700", color: "#0F172A" }} className="d-block">{faq.question}</span>
                      <span className="text-muted">{stripHtml(faq.answer)}</span>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditFaqItem(faqIdx)}
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaqItem(faqIdx)}
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted micro py-3">No FAQs added yet.</div>
            )}
          </SectionCard>

          <SectionCard icon="🏷️" title="Property Image Badges / Pills (Comma-separated)" tone="gold">
            <div className="text-muted micro mb-2">Shown directly on property card images (e.g. Rooms, Pool, Family)</div>
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="e.g. Rooms, Pool, Family"
              value={newProp.badges || ""}
              onChange={(e) => setNewProp({ ...newProp, badges: e.target.value })}
            />
            {newProp.badges && (
              <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
                <span className="micro text-muted fw-600">Live Preview:</span>
                {(typeof newProp.badges === "string" ? newProp.badges.split(",") : newProp.badges)
                  .map((b) => (typeof b === "string" ? b.trim() : ""))
                  .filter(Boolean)
                  .map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        background: "#F5F2EA",
                        color: "#0F172A",
                        padding: "4px 13px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "1px solid #E2D9C8",
                        display: "inline-flex",
                        alignItems: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </SectionCard>

          <SectionCard icon="⭐" title="Key Highlights Strip (Quick Facts under About Section)" tag={`${newProp.quickFacts ? newProp.quickFacts.length : 0} added`}>
            <div className="text-muted micro mb-2">Displays the white facts card shown on the property page — add, edit or remove as many facts as you need.</div>
            <SubPanel title="Add a quick fact" isEditing={editingQuickFactIndex !== null} onCancel={handleCancelEditQuickFactItem}>
              <div className="row g-2 align-items-end">
                <div className="col-md-4">
                  <Field label="Title">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Location"
                      value={newProp.quickFactTitleInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, quickFactTitleInput: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="col-md-5">
                  <Field label="Value">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Chitrod, near Sasan Gir"
                      value={newProp.quickFactValueInput || ""}
                      onChange={(e) => setNewProp({ ...newProp, quickFactValueInput: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="col-md-3">
                  <button
                    type="button"
                    onClick={handleAddQuickFactItem}
                    className={`btn btn-sm w-100 ${editingQuickFactIndex !== null ? "btn-success" : "btn-primary"}`}
                    style={{ borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", padding: "7px 0" }}
                  >
                    {editingQuickFactIndex !== null ? "✔ Update Fact" : "+ Add Fact"}
                  </button>
                </div>
              </div>
            </SubPanel>

            {newProp.quickFacts && newProp.quickFacts.length > 0 ? (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "2px" }}>
                {newProp.quickFacts.map((fact, fIdx) => (
                  <div key={fIdx} className={`d-flex align-items-center justify-content-between p-3 rounded-3 border ${editingQuickFactIndex === fIdx ? "bg-warning-subtle border-warning" : "bg-white"}`}>
                    <div className="d-flex align-items-start gap-2 text-truncate">
                      <span
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#EEF2FF", color: "#4338CA", fontSize: "11px", fontWeight: "700" }}
                      >
                        {fIdx + 1}
                      </span>
                      <div className="text-truncate" style={{ fontSize: "13px" }}>
                        <span style={{ fontWeight: "700", color: "#0F172A" }}>{fact.title}</span>
                        <span className="text-muted"> — {fact.value}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditQuickFactItem(fIdx)}
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickFactItem(fIdx)}
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        style={{ fontSize: "11px", fontWeight: "600" }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted micro py-3">No quick facts added yet.</div>
            )}

            {newProp.quickFacts && newProp.quickFacts.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded-3 border" style={{ borderColor: "#EAECF0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="micro text-muted fw-700 mb-2">Live Strip Preview:</div>
                <div className="row g-2 text-start">
                  {newProp.quickFacts.map((fact, fIdx) => (
                    <div key={fIdx} className="col-md col-6 border-end pe-2">
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#101828" }}>{fact.title}</div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard icon="🌿" title="Resort Amenities Section Header (Dynamic Title & Description)" tone="green">
            <div className="text-muted micro mb-2">Customise the title and description of the amenities grid</div>
            <div className="row g-3">
              <div className="col-md-4 col-12">
                <label className="form-label micro fw-600 text-secondary mb-1">Eyebrow Tag (optional)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder={newProp.type ? `${newProp.type.toUpperCase()} AMENITIES` : "RESORT AMENITIES"}
                  value={newProp.amenitiesEyebrow || ""}
                  onChange={(e) => setNewProp({ ...newProp, amenitiesEyebrow: e.target.value })}
                />
              </div>

              <div className="col-md-4 col-12">
                <label className="form-label micro fw-600 text-secondary mb-1">Amenities Title / Heading</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="More than a place to sleep"
                  value={newProp.amenitiesTitle || ""}
                  onChange={(e) => setNewProp({ ...newProp, amenitiesTitle: e.target.value })}
                />
              </div>

              <div className="col-md-4 col-12">
                <label className="form-label micro fw-600 text-secondary mb-1">Description / Subtext (optional)</label>
                <RichTextEditor
                  rows={1}
                  placeholder="Leave blank or enter custom subtext"
                  value={newProp.amenitiesDescription || ""}
                  onChange={(html) => setNewProp({ ...newProp, amenitiesDescription: html })}
                />
              </div>
            </div>
          </SectionCard>

          <div className="bg-white rounded-4 border shadow-sm p-4 mb-4">
            <h6 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>🔍 SEO (optional — leave blank to auto-generate)</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-600">Meta Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`e.g. ${newProp.name || "Property Name"} — ${newProp.location || "Location"}`}
                  value={newProp.metaTitle}
                  onChange={(e) => setNewProp({ ...newProp, metaTitle: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-600">Meta Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Short description shown in Google search results"
                  value={newProp.metaDescription}
                  onChange={(e) => setNewProp({ ...newProp, metaDescription: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-600">Schema Markup (JSON-LD, optional)</label>
                <div className="small text-muted mb-1">
                  Advanced: paste valid Schema.org JSON-LD here. Leave blank if unsure — it never overwrites the property's automatic SEO data.
                </div>
                <textarea
                  className="form-control"
                  rows={4}
                  style={{ fontFamily: "monospace", fontSize: "12px" }}
                  value={newProp.schemaMarkup || ""}
                  onChange={(e) => setNewProp({ ...newProp, schemaMarkup: e.target.value })}
                  placeholder='{"@context":"https://schema.org","@type":"LodgingBusiness",...}'
                />
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button type="button" onClick={goBackToList} className="btn btn-light" style={{ borderRadius: "8px" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 24px" }}>
              {saving ? "Saving..." : isEditMode ? "💾 Update Property Details" : "💾 Save Property & Media"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
