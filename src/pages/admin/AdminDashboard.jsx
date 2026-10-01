import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { indianStates } from "../../data/properties";
import AmenityIcon, { iconNames } from "../../components/AmenityIcon";
import RichTextEditor from "../../components/admin/RichTextEditor";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AboutIcon, { iconNames as aboutIconNames } from "../../components/AboutIcon";
import { API_BASE_URL } from "../../config/api";
import PasswordInput from "../../components/PasswordInput";
import SEO from "../../components/SEO";
import resolveImageUrl from "../../utils/resolveImageUrl";
import { stripHtml } from "../../utils/richText";

const galleryCategories = [
  { id: "property", label: "Property Photographs" },
  { id: "rooms", label: "Rooms & Stays" },
  { id: "facilities", label: "Resort Facilities" },
  { id: "food", label: "Food & Dining" },
  { id: "events", label: "Events & Celebrations" },
  { id: "activities", label: "Activities & Adventure" },
  { id: "destinations", label: "Destination Highlights" },
  { id: "videos", label: "Video Gallery" },
];

export default function AdminDashboard() {
  const { user, token, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const getTabFromUrl = () => {
    if (params.tab) return params.tab;
    if (location.pathname.startsWith("/admin/properties")) return "properties";
    const sub = location.pathname.replace(/^\/admin\/?/, "");
    if (sub && sub !== "admin") return sub;
    return location.state?.tab || "overview";
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl);

  useEffect(() => {
    const tabFromUrl = getTabFromUrl();
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [params.tab, location.pathname, location.state]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [uploadingPropertiesBanner, setUploadingPropertiesBanner] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [pageSeoList, setPageSeoList] = useState([]);
  const [pageSeoDrafts, setPageSeoDrafts] = useState({});
  const [savingSeoKey, setSavingSeoKey] = useState(null);
  const [seoMsg, setSeoMsg] = useState({ type: "", text: "", key: "" });
  const [seoActivePage, setSeoActivePage] = useState("home");

  // Hero Slides State
  const [heroSlides, setHeroSlides] = useState([]);

  // Amenity Add/Edit Modal State
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [editingAmenityId, setEditingAmenityId] = useState(null);
  const [amenityForm, setAmenityForm] = useState({ title: "", description: "", icon: "bed" });
  const [savingAmenity, setSavingAmenity] = useState(false);

  // Testimonial Add/Edit Modal State
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const defaultTestimonialForm = { authorName: "", authorLocation: "", stayProperty: "", quoteText: "", rating: 5, avatarUrl: "", avatarAlt: "" };
  const [testimonialForm, setTestimonialForm] = useState(defaultTestimonialForm);
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [uploadingTestimonialAvatar, setUploadingTestimonialAvatar] = useState(false);

  // Team Member Add/Edit Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const defaultTeamForm = {
    category: "team",
    name: "",
    role: "",
    bio: "",
    photo_url: "",
    photo_alt: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    twitter_url: "",
  };
  const [teamForm, setTeamForm] = useState(defaultTeamForm);
  const [savingTeam, setSavingTeam] = useState(false);
  const [uploadingTeamPhoto, setUploadingTeamPhoto] = useState(false);

  // Wedding & Events Type Add/Edit Modal State
  const [eventTypesList, setEventTypesList] = useState([]);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [editingEventTypeId, setEditingEventTypeId] = useState(null);
  const defaultEventTypeForm = { title: "", subtitle: "", description: "", image_url: "", image_alt: "" };
  const [eventTypeForm, setEventTypeForm] = useState(defaultEventTypeForm);
  const [savingEventType, setSavingEventType] = useState(false);
  const [uploadingEventTypeImage, setUploadingEventTypeImage] = useState(false);

  // Weddings & Events Page Hero State
  const [weddingHeroForm, setWeddingHeroForm] = useState(null);
  const [savingWeddingHero, setSavingWeddingHero] = useState(false);
  const [weddingHeroMsg, setWeddingHeroMsg] = useState("");
  const [uploadingWeddingHeroImage, setUploadingWeddingHeroImage] = useState(null);

  // "Partner With Us" Page State
  const [partnerForm, setPartnerForm] = useState(null);
  const [savingPartner, setSavingPartner] = useState(false);
  const [partnerMsg, setPartnerMsg] = useState("");
  const [uploadingPartnerImage, setUploadingPartnerImage] = useState(false);

  // Weddings & Events Page "Event Planning Options" Cards State
  const [planOptionsList, setPlanOptionsList] = useState([]);
  const [showPlanOptionModal, setShowPlanOptionModal] = useState(false);
  const [editingPlanOptionId, setEditingPlanOptionId] = useState(null);
  const defaultPlanOptionForm = { eyebrow: "", title: "", description: "", bullets: [], button_text: "", button_link: "", featured: false };
  const [planOptionForm, setPlanOptionForm] = useState(defaultPlanOptionForm);
  const [savingPlanOption, setSavingPlanOption] = useState(false);

  // Weddings & Events Page FAQs State
  const [weddingFaqsList, setWeddingFaqsList] = useState([]);
  const [showWeddingFaqModal, setShowWeddingFaqModal] = useState(false);
  const [editingWeddingFaqId, setEditingWeddingFaqId] = useState(null);
  const defaultWeddingFaqForm = { question: "", answer: "" };
  const [weddingFaqForm, setWeddingFaqForm] = useState(defaultWeddingFaqForm);
  const [savingWeddingFaq, setSavingWeddingFaq] = useState(false);

  // Gallery Add/Edit Modal State
  const [galleryFilterCategory, setGalleryFilterCategory] = useState("all");
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const defaultGalleryForm = { category: "property", type: "image", url: "", posterUrl: "", title: "", caption: "" };
  const [galleryForm, setGalleryForm] = useState(defaultGalleryForm);
  const [savingGalleryItem, setSavingGalleryItem] = useState(false);
  const [uploadingGalleryField, setUploadingGalleryField] = useState(null);

  const [savingHero, setSavingHero] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [heroMsg, setHeroMsg] = useState("");

  // Destination Add/Edit Modal State
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [destinationForm, setDestinationForm] = useState({ name: "", imageUrl: "", imageAlt: "" });
  const [savingDestination, setSavingDestination] = useState(false);
  const [uploadingDestinationImage, setUploadingDestinationImage] = useState(false);

  // Blog Add/Edit Modal State
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const defaultBlogForm = { title: "", slug: "", featuredImage: "", featuredImageAlt: "", excerpt: "", content: "", author: "Wanderama Team", metaTitle: "", metaDescription: "", schemaMarkup: "", ctaTitle: "", ctaDescription: "", ctaButtonText: "", ctaButtonLink: "", tocItems: [], faqs: [] };
  const [blogForm, setBlogForm] = useState(defaultBlogForm);
  const [savingBlog, setSavingBlog] = useState(false);
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);
  const [blogPreviewMode, setBlogPreviewMode] = useState(false);

  // Account Settings State
  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" });
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ type: "", text: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // About Page Settings State
  const [aboutForm, setAboutForm] = useState(null);
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutMsg, setAboutMsg] = useState("");
  const [uploadingAboutField, setUploadingAboutField] = useState(null);

  // Site Settings ("Other") State
  const [siteSettingsForm, setSiteSettingsForm] = useState(null);
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);
  const [siteSettingsMsg, setSiteSettingsMsg] = useState("");

  const [selectedVideoPreview, setSelectedVideoPreview] = useState(null);

  const fetchPropertiesList = () => {
    fetch(`${API_BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProperties(data.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    fetchPropertiesList();

    fetch(`${API_BASE_URL}/api/enquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setEnquiries(data.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/hero`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setHeroSlides(data.data);
        }
      })
      .catch(() => {});

    fetchTestimonialsList();

    fetchAmenitiesList();
    fetchGalleryList();
    fetchAboutSettings();
    fetchSiteSettings();
    fetchDestinationsList();
    fetchPageSeoList();
    fetchBlogPosts();
    fetchTeamList();
    fetchEventTypesList();
    fetchWeddingHero();
    fetchPlanOptionsList();
    fetchWeddingFaqsList();
    fetchPartnerSettings();
  }, [isAuthenticated, navigate, token]);

  const fetchPartnerSettings = () => {
    fetch(`${API_BASE_URL}/api/partner-settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPartnerForm(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchTeamList = () => {
    fetch(`${API_BASE_URL}/api/team`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTeamList(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchWeddingFaqsList = () => {
    fetch(`${API_BASE_URL}/api/wedding-faqs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setWeddingFaqsList(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchPlanOptionsList = () => {
    fetch(`${API_BASE_URL}/api/event-plan-options`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPlanOptionsList(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchWeddingHero = () => {
    fetch(`${API_BASE_URL}/api/wedding-hero`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setWeddingHeroForm(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchEventTypesList = () => {
    fetch(`${API_BASE_URL}/api/event-types`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setEventTypesList(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchBlogPosts = () => {
    fetch(`${API_BASE_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBlogPosts(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchDestinationsList = () => {
    fetch(`${API_BASE_URL}/api/destinations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDestinationsList(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchPageSeoList = () => {
    fetch(`${API_BASE_URL}/api/seo`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPageSeoList(data.data);
          const drafts = {};
          data.data.forEach((row) => {
            drafts[row.page_key] = { metaTitle: row.meta_title, metaDescription: row.meta_description, slug: row.slug || row.page_key, schemaMarkup: row.schema_markup || "", bannerImage: row.banner_image || "", bannerImageAlt: row.banner_image_alt || "" };
          });
          setPageSeoDrafts(drafts);
        }
      })
      .catch(() => {});
  };

  const fetchAboutSettings = () => {
    fetch(`${API_BASE_URL}/api/about`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAboutForm(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchSiteSettings = () => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSiteSettingsForm(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchTestimonialsList = () => {
    fetch(`${API_BASE_URL}/api/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTestimonials(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchAmenitiesList = () => {
    fetch(`${API_BASE_URL}/api/amenities`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAmenitiesList(data.data);
        }
      })
      .catch(() => {});
  };

  const fetchGalleryList = () => {
    fetch(`${API_BASE_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setGalleryList(data.data);
        }
      })
      .catch(() => {});
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSavingEmail(true);
    setEmailMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(token, data.user);
        setEmailMsg({ type: "success", text: "✅ Email updated successfully!" });
        setEmailForm({ newEmail: "", currentPassword: "" });
      } else {
        setEmailMsg({ type: "error", text: data.message || "Error updating email" });
      }
    } catch (err) {
      setEmailMsg({ type: "error", text: "Network error while updating email" });
    } finally {
      setSavingEmail(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New password and confirm password do not match" });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordMsg({ type: "success", text: "✅ Password updated successfully!" });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMsg({ type: "error", text: data.message || "Error updating password" });
      }
    } catch (err) {
      setPasswordMsg({ type: "error", text: "Network error while updating password" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleOpenAddAmenityModal = () => {
    setEditingAmenityId(null);
    setAmenityForm({ title: "", description: "", icon: "bed" });
    setShowAmenityModal(true);
  };

  const handleEditAmenity = (amenity) => {
    setEditingAmenityId(amenity.id);
    setAmenityForm({
      title: amenity.title || "",
      description: amenity.description || "",
      icon: amenity.icon || "bed",
    });
    setShowAmenityModal(true);
  };

  const handleAmenitySubmit = async (e) => {
    e.preventDefault();
    if (!amenityForm.title.trim()) return;
    setSavingAmenity(true);

    try {
      const url = editingAmenityId
        ? `${API_BASE_URL}/api/amenities/${editingAmenityId}`
        : `${API_BASE_URL}/api/amenities`;
      const res = await fetch(url, {
        method: editingAmenityId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(amenityForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchAmenitiesList();
        setShowAmenityModal(false);
      } else {
        alert(data.message || "Error saving amenity");
      }
    } catch (err) {
      alert("Network error while saving amenity");
    } finally {
      setSavingAmenity(false);
    }
  };

  const handleDeleteAmenity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this amenity?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/amenities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAmenitiesList((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.message || "Error deleting amenity");
      }
    } catch (err) {
      alert("Network error while deleting amenity");
    }
  };

  const handleOpenAddTestimonialModal = () => {
    setEditingTestimonialId(null);
    setTestimonialForm(defaultTestimonialForm);
    setShowTestimonialModal(true);
  };

  const handleEditTestimonial = (t) => {
    setEditingTestimonialId(t.id);
    setTestimonialForm({
      authorName: t.author_name || "",
      authorLocation: t.author_location || "",
      stayProperty: t.stay_property || "",
      quoteText: t.quote_text || "",
      rating: t.rating || 5,
      avatarUrl: t.avatar_url || "",
      avatarAlt: t.avatar_alt || "",
    });
    setShowTestimonialModal(true);
  };

  const handleTestimonialAvatarUpload = async (file) => {
    if (!file) return;
    setUploadingTestimonialAvatar(true);

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
        setTestimonialForm((prev) => ({ ...prev, avatarUrl: data.url }));
      } else {
        const localUrl = URL.createObjectURL(file);
        setTestimonialForm((prev) => ({ ...prev, avatarUrl: localUrl }));
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setTestimonialForm((prev) => ({ ...prev, avatarUrl: localUrl }));
    } finally {
      setUploadingTestimonialAvatar(false);
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialForm.authorName.trim() || !testimonialForm.quoteText.trim()) return;
    setSavingTestimonial(true);

    try {
      const url = editingTestimonialId
        ? `${API_BASE_URL}/api/testimonials/${editingTestimonialId}`
        : `${API_BASE_URL}/api/testimonials`;
      const res = await fetch(url, {
        method: editingTestimonialId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testimonialForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchTestimonialsList();
        setShowTestimonialModal(false);
      } else {
        alert(data.message || "Error saving testimonial");
      }
    } catch (err) {
      alert("Network error while saving testimonial");
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(data.message || "Error deleting testimonial");
      }
    } catch (err) {
      alert("Network error while deleting testimonial");
    }
  };

  const handleOpenAddTeamModal = () => {
    setEditingTeamId(null);
    setTeamForm(defaultTeamForm);
    setShowTeamModal(true);
  };

  const handleEditTeamMember = (member) => {
    setEditingTeamId(member.id);
    setTeamForm({
      category: member.category || "team",
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      photo_url: member.photo_url || "",
      photo_alt: member.photo_alt || "",
      facebook_url: member.facebook_url || "",
      instagram_url: member.instagram_url || "",
      linkedin_url: member.linkedin_url || "",
      twitter_url: member.twitter_url || "",
    });
    setShowTeamModal(true);
  };

  const handleTeamPhotoUpload = async (file) => {
    if (!file) return;
    setUploadingTeamPhoto(true);

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
        setTeamForm((prev) => ({ ...prev, photo_url: data.url }));
      } else {
        const localUrl = URL.createObjectURL(file);
        setTeamForm((prev) => ({ ...prev, photo_url: localUrl }));
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setTeamForm((prev) => ({ ...prev, photo_url: localUrl }));
    } finally {
      setUploadingTeamPhoto(false);
    }
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;
    setSavingTeam(true);

    try {
      const url = editingTeamId
        ? `${API_BASE_URL}/api/team/${editingTeamId}`
        : `${API_BASE_URL}/api/team`;
      const res = await fetch(url, {
        method: editingTeamId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchTeamList();
        setShowTeamModal(false);
      } else {
        alert(data.message || "Error saving team member");
      }
    } catch (err) {
      alert("Network error while saving team member");
    } finally {
      setSavingTeam(false);
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/team/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeamList((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(data.message || "Error deleting team member");
      }
    } catch (err) {
      alert("Network error while deleting team member");
    }
  };

  const handleOpenAddEventTypeModal = () => {
    setEditingEventTypeId(null);
    setEventTypeForm(defaultEventTypeForm);
    setShowEventTypeModal(true);
  };

  const handleEditEventType = (eventType) => {
    setEditingEventTypeId(eventType.id);
    setEventTypeForm({
      title: eventType.title || "",
      subtitle: eventType.subtitle || "",
      description: eventType.description || "",
      image_url: eventType.image_url || "",
      image_alt: eventType.image_alt || "",
    });
    setShowEventTypeModal(true);
  };

  const handleEventTypeImageUpload = async (file) => {
    if (!file) return;
    setUploadingEventTypeImage(true);

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
        setEventTypeForm((prev) => ({ ...prev, image_url: data.url }));
      } else {
        const localUrl = URL.createObjectURL(file);
        setEventTypeForm((prev) => ({ ...prev, image_url: localUrl }));
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setEventTypeForm((prev) => ({ ...prev, image_url: localUrl }));
    } finally {
      setUploadingEventTypeImage(false);
    }
  };

  const handleEventTypeSubmit = async (e) => {
    e.preventDefault();
    if (!eventTypeForm.title.trim()) return;
    setSavingEventType(true);

    try {
      const url = editingEventTypeId
        ? `${API_BASE_URL}/api/event-types/${editingEventTypeId}`
        : `${API_BASE_URL}/api/event-types`;
      const res = await fetch(url, {
        method: editingEventTypeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventTypeForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchEventTypesList();
        setShowEventTypeModal(false);
      } else {
        alert(data.message || "Error saving event type");
      }
    } catch (err) {
      alert("Network error while saving event type");
    } finally {
      setSavingEventType(false);
    }
  };

  const handleDeleteEventType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event type?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/event-types/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEventTypesList((prev) => prev.filter((et) => et.id !== id));
      } else {
        alert(data.message || "Error deleting event type");
      }
    } catch (err) {
      alert("Network error while deleting event type");
    }
  };

  const handleOpenAddPlanOptionModal = () => {
    setEditingPlanOptionId(null);
    setPlanOptionForm(defaultPlanOptionForm);
    setShowPlanOptionModal(true);
  };

  const handleEditPlanOption = (option) => {
    setEditingPlanOptionId(option.id);
    setPlanOptionForm({
      eyebrow: option.eyebrow || "",
      title: option.title || "",
      description: option.description || "",
      bullets: Array.isArray(option.bullets) ? option.bullets : [],
      button_text: option.button_text || "",
      button_link: option.button_link || "",
      featured: Boolean(option.featured),
    });
    setShowPlanOptionModal(true);
  };

  const handleAddPlanOptionBullet = () => {
    setPlanOptionForm((prev) => ({ ...prev, bullets: [...(prev.bullets || []), ""] }));
  };

  const handlePlanOptionBulletChange = (index, value) => {
    setPlanOptionForm((prev) => {
      const updated = [...(prev.bullets || [])];
      updated[index] = value;
      return { ...prev, bullets: updated };
    });
  };

  const handleRemovePlanOptionBullet = (index) => {
    setPlanOptionForm((prev) => ({ ...prev, bullets: (prev.bullets || []).filter((_, i) => i !== index) }));
  };

  const handlePlanOptionSubmit = async (e) => {
    e.preventDefault();
    if (!planOptionForm.title.trim()) return;
    setSavingPlanOption(true);

    try {
      const url = editingPlanOptionId
        ? `${API_BASE_URL}/api/event-plan-options/${editingPlanOptionId}`
        : `${API_BASE_URL}/api/event-plan-options`;
      const res = await fetch(url, {
        method: editingPlanOptionId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...planOptionForm,
          bullets: (planOptionForm.bullets || []).filter((b) => b && b.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchPlanOptionsList();
        setShowPlanOptionModal(false);
      } else {
        alert(data.message || "Error saving plan option");
      }
    } catch (err) {
      alert("Network error while saving plan option");
    } finally {
      setSavingPlanOption(false);
    }
  };

  const handleDeletePlanOption = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan option?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/event-plan-options/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPlanOptionsList((prev) => prev.filter((o) => o.id !== id));
      } else {
        alert(data.message || "Error deleting plan option");
      }
    } catch (err) {
      alert("Network error while deleting plan option");
    }
  };

  const handleOpenAddWeddingFaqModal = () => {
    setEditingWeddingFaqId(null);
    setWeddingFaqForm(defaultWeddingFaqForm);
    setShowWeddingFaqModal(true);
  };

  const handleEditWeddingFaq = (faq) => {
    setEditingWeddingFaqId(faq.id);
    setWeddingFaqForm({
      question: faq.question || "",
      answer: faq.answer || "",
    });
    setShowWeddingFaqModal(true);
  };

  const handleWeddingFaqSubmit = async (e) => {
    e.preventDefault();
    if (!weddingFaqForm.question.trim()) return;
    setSavingWeddingFaq(true);

    try {
      const url = editingWeddingFaqId
        ? `${API_BASE_URL}/api/wedding-faqs/${editingWeddingFaqId}`
        : `${API_BASE_URL}/api/wedding-faqs`;
      const res = await fetch(url, {
        method: editingWeddingFaqId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(weddingFaqForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchWeddingFaqsList();
        setShowWeddingFaqModal(false);
      } else {
        alert(data.message || "Error saving FAQ");
      }
    } catch (err) {
      alert("Network error while saving FAQ");
    } finally {
      setSavingWeddingFaq(false);
    }
  };

  const handleDeleteWeddingFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/wedding-faqs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWeddingFaqsList((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert(data.message || "Error deleting FAQ");
      }
    } catch (err) {
      alert("Network error while deleting FAQ");
    }
  };

  const handleOpenAddGalleryModal = (category) => {
    setEditingGalleryId(null);
    setGalleryForm({
      ...defaultGalleryForm,
      category: category && category !== "all" ? category : "property",
      type: category === "videos" ? "video" : "image",
    });
    setShowGalleryModal(true);
  };

  const handleEditGalleryItem = (item) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      category: item.category,
      type: item.type,
      url: item.url || "",
      posterUrl: item.poster_url || "",
      title: item.title || "",
      caption: item.caption || "",
    });
    setShowGalleryModal(true);
  };

  const handleGalleryCategoryChange = (category) => {
    setGalleryForm((prev) => ({ ...prev, category, type: category === "videos" ? "video" : "image" }));
  };

  const handleGalleryFileUpload = async (field, file) => {
    if (!file) return;
    setUploadingGalleryField(field);

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
        setGalleryForm((prev) => ({ ...prev, [field]: data.url }));
      } else {
        const localUrl = URL.createObjectURL(file);
        setGalleryForm((prev) => ({ ...prev, [field]: localUrl }));
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setGalleryForm((prev) => ({ ...prev, [field]: localUrl }));
    } finally {
      setUploadingGalleryField(null);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.url.trim()) return;
    setSavingGalleryItem(true);

    try {
      const url = editingGalleryId
        ? `${API_BASE_URL}/api/gallery/${editingGalleryId}`
        : `${API_BASE_URL}/api/gallery`;
      const res = await fetch(url, {
        method: editingGalleryId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(galleryForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchGalleryList();
        setShowGalleryModal(false);
      } else {
        alert(data.message || "Error saving gallery item");
      }
    } catch (err) {
      alert("Network error while saving gallery item");
    } finally {
      setSavingGalleryItem(false);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGalleryList((prev) => prev.filter((g) => g.id !== id));
      } else {
        alert(data.message || "Error deleting gallery item");
      }
    } catch (err) {
      alert("Network error while deleting gallery item");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await fetch(`${API_BASE_URL}/api/properties/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {}
      setProperties(properties.filter((p) => p.id !== id && p.slug !== id));
      fetchPropertiesList();
    }
  };

  const handleUpdateEnquiryStatus = async (id, newStatus) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Error updating enquiry status");
      }
    } catch (err) {
      alert("Network error while updating enquiry status");
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert(data.message || "Error deleting enquiry");
      }
    } catch (err) {
      alert("Network error while deleting enquiry");
    }
  };

  const handleHeroSlideChange = (index, field, value) => {
    const updated = [...heroSlides];
    updated[index][field] = value;
    setHeroSlides(updated);
  };

  const handleAddHeroSlide = () => {
    const newSlide = {
      slide_number: heroSlides.length + 1,
      title: "New Luxury Experience",
      description: "Discover our handpicked premium hospitality destinations across India.",
      image_url: "/assets/img/slider/hero-bg.jpg",
    };
    setHeroSlides([...heroSlides, newSlide]);
    setHeroMsg("✨ New Hero slide card added below. Edit title/image and click Save!");
  };

  const handleRemoveHeroSlide = (index) => {
    if (heroSlides.length <= 1) {
      alert("At least one slide is required in the hero banner.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove Slide #${index + 1}?`)) {
      const updated = heroSlides.filter((_, idx) => idx !== index);
      setHeroSlides(updated);
      setHeroMsg(`🗑️ Slide #${index + 1} removed. Click 'Save Hero Settings' to apply.`);
    }
  };

  // Upload image file from computer
  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIdx(index);
    setHeroMsg("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        handleHeroSlideChange(index, "image_url", data.url);
        setHeroMsg(`✅ Image uploaded from computer for Slide #${index + 1}!`);
      } else {
        // Fallback object URL if server offline
        const localUrl = URL.createObjectURL(file);
        handleHeroSlideChange(index, "image_url", localUrl);
        setHeroMsg(`ℹ️ Local preview image set for Slide #${index + 1}`);
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      handleHeroSlideChange(index, "image_url", localUrl);
      setHeroMsg(`ℹ️ Local preview image set for Slide #${index + 1}`);
    } finally {
      setUploadingIdx(null);
    }
  };

  // Upload image file for the Properties listing page's own banner (separate
  // from any individual property's hero/thumb image, see AdminPropertyForm).
  const handlePropertiesBannerUpload = async (file) => {
    if (!file) return;
    setUploadingPropertiesBanner(true);
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
        handleSeoDraftChange("properties", "bannerImage", data.url);
      } else {
        handleSeoDraftChange("properties", "bannerImage", URL.createObjectURL(file));
      }
    } catch (err) {
      handleSeoDraftChange("properties", "bannerImage", URL.createObjectURL(file));
    } finally {
      setUploadingPropertiesBanner(false);
    }
  };

  const handleSaveHeroSlides = async (e) => {
    e.preventDefault();
    setSavingHero(true);
    setHeroMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slides: heroSlides }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHeroMsg("✅ Hero banner settings saved successfully! Check homepage.");
      } else {
        setHeroMsg("ℹ️ Hero settings updated!");
      }
    } catch (err) {
      setHeroMsg("ℹ️ Hero settings updated!");
    } finally {
      setSavingHero(false);
    }
  };

  const handleAboutFieldChange = (field, value) => {
    setAboutForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAboutFileUpload = async (field, file) => {
    if (!file) return;
    setUploadingAboutField(field);

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
        handleAboutFieldChange(field, data.url);
      } else {
        handleAboutFieldChange(field, URL.createObjectURL(file));
      }
    } catch (err) {
      handleAboutFieldChange(field, URL.createObjectURL(file));
    } finally {
      setUploadingAboutField(null);
    }
  };

  const handleAboutFeatureChange = (index, value) => {
    const updated = [...(aboutForm.features || [])];
    updated[index] = value;
    setAboutForm((prev) => ({ ...prev, features: updated }));
  };

  const handleAddAboutFeature = () => {
    setAboutForm((prev) => ({ ...prev, features: [...(prev.features || []), "New Highlight"] }));
  };

  const handleRemoveAboutFeature = (index) => {
    setAboutForm((prev) => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) }));
  };

  const handleHomeIntroFeatureChange = (index, value) => {
    const updated = [...(aboutForm.home_intro_features || [])];
    updated[index] = value;
    setAboutForm((prev) => ({ ...prev, home_intro_features: updated }));
  };

  const handleAddHomeIntroFeature = () => {
    setAboutForm((prev) => ({ ...prev, home_intro_features: [...(prev.home_intro_features || []), "New Highlight"] }));
  };

  const handleRemoveHomeIntroFeature = (index) => {
    setAboutForm((prev) => ({ ...prev, home_intro_features: (prev.home_intro_features || []).filter((_, i) => i !== index) }));
  };

  const handleWhyFeatureChange = (index, field, value) => {
    const updated = [...(aboutForm.why_features || [])];
    updated[index] = { ...updated[index], [field]: value };
    setAboutForm((prev) => ({ ...prev, why_features: updated }));
  };

  const handleAddWhyFeature = () => {
    setAboutForm((prev) => ({
      ...prev,
      why_features: [...(prev.why_features || []), { title: "New Highlight", desc: "Describe this highlight." }],
    }));
  };

  const handleRemoveWhyFeature = (index) => {
    setAboutForm((prev) => ({ ...prev, why_features: (prev.why_features || []).filter((_, i) => i !== index) }));
  };

  const handleAboutPhilosophyChange = (index, field, value) => {
    const updated = [...(aboutForm.philosophy || [])];
    updated[index] = { ...updated[index], [field]: value };
    setAboutForm((prev) => ({ ...prev, philosophy: updated }));
  };

  const handleAddAboutPhilosophy = () => {
    setAboutForm((prev) => ({
      ...prev,
      philosophy: [...(prev.philosophy || []), { icon: "building", title: "New Value", desc: "Describe this commitment." }],
    }));
  };

  const handleRemoveAboutPhilosophy = (index) => {
    setAboutForm((prev) => ({ ...prev, philosophy: (prev.philosophy || []).filter((_, i) => i !== index) }));
  };

  const handleAboutStatChange = (index, field, value) => {
    const updated = [...(aboutForm.stats || [])];
    updated[index] = { ...updated[index], [field]: value };
    setAboutForm((prev) => ({ ...prev, stats: updated }));
  };

  const handleAddAboutStat = () => {
    setAboutForm((prev) => ({ ...prev, stats: [...(prev.stats || []), { number: "0", label: "New Stat" }] }));
  };

  const handleRemoveAboutStat = (index) => {
    setAboutForm((prev) => ({ ...prev, stats: (prev.stats || []).filter((_, i) => i !== index) }));
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSavingAbout(true);
    setAboutMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          introTitle: aboutForm.intro_title,
          introText: aboutForm.intro_text,
          introImage: aboutForm.intro_image,
          introImageAlt: aboutForm.intro_image_alt,
          introImageSm: aboutForm.intro_image_sm,
          features: aboutForm.features,
          journeyTitle: aboutForm.journey_title,
          journeyText1: aboutForm.journey_text_1,
          journeyText2: aboutForm.journey_text_2,
          journeyImage: aboutForm.journey_image,
          journeyImageAlt: aboutForm.journey_image_alt,
          journeyImageSm: aboutForm.journey_image_sm,
          philosophy: aboutForm.philosophy,
          founderName: aboutForm.founder_name,
          founderTitle: aboutForm.founder_title,
          founderBio1: aboutForm.founder_bio_1,
          founderBio2: aboutForm.founder_bio_2,
          founderImage: aboutForm.founder_image,
          founderImageAlt: aboutForm.founder_image_alt,
          stats: aboutForm.stats,
          homeIntroTitle: aboutForm.home_intro_title,
          homeIntroText: aboutForm.home_intro_text,
          homeIntroImage: aboutForm.home_intro_image,
          homeIntroImageAlt: aboutForm.home_intro_image_alt,
          homeIntroImageSm: aboutForm.home_intro_image_sm,
          homeIntroFeatures: aboutForm.home_intro_features,
          whyTag: aboutForm.why_tag,
          whyTitle: aboutForm.why_title,
          whyText: aboutForm.why_text,
          whyImage: aboutForm.why_image,
          whyImageAlt: aboutForm.why_image_alt,
          whyButtonText: aboutForm.why_button_text,
          whyButtonLink: aboutForm.why_button_link,
          whyFeatures: aboutForm.why_features,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAboutForm(data.data);
        setAboutMsg("✅ About page updated successfully! Check the About page.");
      } else {
        setAboutMsg(data.message || "Error saving About page");
      }
    } catch (err) {
      setAboutMsg("Network error while saving About page");
    } finally {
      setSavingAbout(false);
    }
  };

  const handleSiteSettingsFieldChange = (field, value) => {
    setSiteSettingsForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (index, value) => {
    const updated = [...(siteSettingsForm.emails || [])];
    updated[index] = value;
    setSiteSettingsForm((prev) => ({ ...prev, emails: updated }));
  };

  const handleAddEmail = () => {
    setSiteSettingsForm((prev) => ({ ...prev, emails: [...(prev.emails || []), ""] }));
  };

  const handleRemoveEmail = (index) => {
    setSiteSettingsForm((prev) => ({ ...prev, emails: (prev.emails || []).filter((_, i) => i !== index) }));
  };

  const handlePhoneChange = (index, value) => {
    const updated = [...(siteSettingsForm.phone_numbers || [])];
    updated[index] = value;
    setSiteSettingsForm((prev) => ({ ...prev, phone_numbers: updated }));
  };

  const handleAddPhone = () => {
    setSiteSettingsForm((prev) => ({ ...prev, phone_numbers: [...(prev.phone_numbers || []), ""] }));
  };

  const handleRemovePhone = (index) => {
    setSiteSettingsForm((prev) => ({ ...prev, phone_numbers: (prev.phone_numbers || []).filter((_, i) => i !== index) }));
  };

  const handleSaveSiteSettings = async (e) => {
    e.preventDefault();
    setSavingSiteSettings(true);
    setSiteSettingsMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: siteSettingsForm.address,
          workingHours: siteSettingsForm.working_hours,
          workingDays: siteSettingsForm.working_days,
          emails: siteSettingsForm.emails,
          phoneNumbers: siteSettingsForm.phone_numbers,
          instagramUrl: siteSettingsForm.instagram_url,
          facebookUrl: siteSettingsForm.facebook_url,
          linkedinUrl: siteSettingsForm.linkedin_url,
          whatsappNumber: siteSettingsForm.whatsapp_number,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSiteSettingsForm(data.data);
        setSiteSettingsMsg("✅ Site settings updated successfully! Check the footer.");
      } else {
        setSiteSettingsMsg(data.message || "Error saving site settings");
      }
    } catch (err) {
      setSiteSettingsMsg("Network error while saving site settings");
    } finally {
      setSavingSiteSettings(false);
    }
  };

  const handleWeddingHeroFieldChange = (field, value) => {
    setWeddingHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleWeddingHeroImageUpload = async (file, field = "image") => {
    if (!file) return;
    setUploadingWeddingHeroImage(field);

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
        handleWeddingHeroFieldChange(field, data.url);
      } else {
        handleWeddingHeroFieldChange(field, URL.createObjectURL(file));
      }
    } catch (err) {
      handleWeddingHeroFieldChange(field, URL.createObjectURL(file));
    } finally {
      setUploadingWeddingHeroImage(null);
    }
  };

  const handleAddWeddingAboutFeature = () => {
    setWeddingHeroForm((prev) => ({
      ...prev,
      about_features: [...(prev.about_features || []), ""],
    }));
  };

  const handleWeddingAboutFeatureChange = (index, value) => {
    setWeddingHeroForm((prev) => {
      const updated = [...(prev.about_features || [])];
      updated[index] = value;
      return { ...prev, about_features: updated };
    });
  };

  const handleRemoveWeddingAboutFeature = (index) => {
    setWeddingHeroForm((prev) => ({
      ...prev,
      about_features: (prev.about_features || []).filter((_, i) => i !== index),
    }));
  };

  const handleSaveWeddingHero = async (e) => {
    e.preventDefault();
    setSavingWeddingHero(true);
    setWeddingHeroMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/wedding-hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: weddingHeroForm.image,
          imageAlt: weddingHeroForm.image_alt,
          eyebrow: weddingHeroForm.eyebrow,
          title: weddingHeroForm.title,
          description: weddingHeroForm.description,
          btn1Text: weddingHeroForm.btn1_text,
          btn1Link: weddingHeroForm.btn1_link,
          btn2Text: weddingHeroForm.btn2_text,
          btn2Link: weddingHeroForm.btn2_link,
          disclaimer: weddingHeroForm.disclaimer,
          aboutImage: weddingHeroForm.about_image,
          aboutImageAlt: weddingHeroForm.about_image_alt,
          aboutEyebrow: weddingHeroForm.about_eyebrow,
          aboutTitle: weddingHeroForm.about_title,
          aboutDescription: weddingHeroForm.about_description,
          aboutFeatures: (weddingHeroForm.about_features || []).filter((f) => f && f.trim()),
          aboutButtonText: weddingHeroForm.about_button_text,
          aboutButtonLink: weddingHeroForm.about_button_link,
          planOptionsTitle: weddingHeroForm.plan_options_title,
          planOptionsDescription: weddingHeroForm.plan_options_description,
          faqsTitle: weddingHeroForm.faqs_title,
          faqsDescription: weddingHeroForm.faqs_description,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWeddingHeroForm(data.data);
        setWeddingHeroMsg("✅ Weddings & Events hero updated successfully!");
      } else {
        setWeddingHeroMsg(data.message || "Error saving wedding hero");
      }
    } catch (err) {
      setWeddingHeroMsg("Network error while saving wedding hero");
    } finally {
      setSavingWeddingHero(false);
    }
  };

  const handlePartnerFieldChange = (field, value) => {
    setPartnerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePartnerImageUpload = async (file) => {
    if (!file) return;
    setUploadingPartnerImage(true);

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
        handlePartnerFieldChange("image", data.url);
      } else {
        handlePartnerFieldChange("image", URL.createObjectURL(file));
      }
    } catch (err) {
      handlePartnerFieldChange("image", URL.createObjectURL(file));
    } finally {
      setUploadingPartnerImage(false);
    }
  };

  const handlePartnerBenefitChange = (index, field, value) => {
    const updated = [...(partnerForm.benefits || [])];
    updated[index] = { ...updated[index], [field]: value };
    setPartnerForm((prev) => ({ ...prev, benefits: updated }));
  };

  const handleAddPartnerBenefit = () => {
    setPartnerForm((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), { title: "New Benefit", desc: "Describe this benefit." }],
    }));
  };

  const handleRemovePartnerBenefit = (index) => {
    setPartnerForm((prev) => ({ ...prev, benefits: (prev.benefits || []).filter((_, i) => i !== index) }));
  };

  const handlePartnerServiceChange = (index, field, value) => {
    const updated = [...(partnerForm.services || [])];
    updated[index] = { ...updated[index], [field]: value };
    setPartnerForm((prev) => ({ ...prev, services: updated }));
  };

  const handleAddPartnerService = () => {
    setPartnerForm((prev) => ({
      ...prev,
      services: [...(prev.services || []), { icon: "common", title: "New Service", desc: "", featured: false, items: [] }],
    }));
  };

  const handleRemovePartnerService = (index) => {
    setPartnerForm((prev) => ({ ...prev, services: (prev.services || []).filter((_, i) => i !== index) }));
  };

  const handlePartnerServiceItemChange = (serviceIndex, itemIndex, value) => {
    const services = [...(partnerForm.services || [])];
    const items = [...(services[serviceIndex].items || [])];
    items[itemIndex] = value;
    services[serviceIndex] = { ...services[serviceIndex], items };
    setPartnerForm((prev) => ({ ...prev, services }));
  };

  const handleAddPartnerServiceItem = (serviceIndex) => {
    const services = [...(partnerForm.services || [])];
    services[serviceIndex] = { ...services[serviceIndex], items: [...(services[serviceIndex].items || []), "New point"] };
    setPartnerForm((prev) => ({ ...prev, services }));
  };

  const handleRemovePartnerServiceItem = (serviceIndex, itemIndex) => {
    const services = [...(partnerForm.services || [])];
    services[serviceIndex] = { ...services[serviceIndex], items: (services[serviceIndex].items || []).filter((_, i) => i !== itemIndex) };
    setPartnerForm((prev) => ({ ...prev, services }));
  };

  const handlePartnerWhyItemChange = (index, field, value) => {
    const updated = [...(partnerForm.why_items || [])];
    updated[index] = { ...updated[index], [field]: value };
    setPartnerForm((prev) => ({ ...prev, why_items: updated }));
  };

  const handleAddPartnerWhyItem = () => {
    setPartnerForm((prev) => ({
      ...prev,
      why_items: [...(prev.why_items || []), { icon: "common", title: "New Benefit", desc: "" }],
    }));
  };

  const handleRemovePartnerWhyItem = (index) => {
    setPartnerForm((prev) => ({ ...prev, why_items: (prev.why_items || []).filter((_, i) => i !== index) }));
  };

  const handleSavePartner = async (e) => {
    e.preventDefault();
    setSavingPartner(true);
    setPartnerMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/partner-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eyebrow: partnerForm.eyebrow,
          title: partnerForm.title,
          description: partnerForm.description,
          image: partnerForm.image,
          imageAlt: partnerForm.image_alt,
          benefits: (partnerForm.benefits || []).filter((b) => b && (b.title || "").trim()),
          formTitle: partnerForm.form_title,
          formDescription: partnerForm.form_description,
          servicesEyebrow: partnerForm.services_eyebrow,
          servicesTitle: partnerForm.services_title,
          servicesDescription: partnerForm.services_description,
          services: (partnerForm.services || [])
            .filter((s) => s && (s.title || "").trim())
            .map((s) => ({ ...s, items: (s.items || []).filter((it) => it && it.trim()) })),
          whyEyebrow: partnerForm.why_eyebrow,
          whyTitle: partnerForm.why_title,
          whyDescription: partnerForm.why_description,
          whyItems: (partnerForm.why_items || []).filter((w) => w && (w.title || "").trim()),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPartnerForm(data.data);
        setPartnerMsg("✅ Partner With Us page updated successfully!");
      } else {
        setPartnerMsg(data.message || "Error saving Partner With Us page");
      }
    } catch (err) {
      setPartnerMsg("Network error while saving Partner With Us page");
    } finally {
      setSavingPartner(false);
    }
  };

  const handleOpenAddDestinationModal = () => {
    setEditingDestinationId(null);
    setDestinationForm({ name: "", imageUrl: "", imageAlt: "" });
    setShowDestinationModal(true);
  };

  const handleEditDestination = (dest) => {
    setEditingDestinationId(dest.id);
    setDestinationForm({ name: dest.name || "", imageUrl: dest.image_url || "", imageAlt: dest.image_alt || "" });
    setShowDestinationModal(true);
  };

  const handleDestinationImageUpload = async (file) => {
    if (!file) return;
    setUploadingDestinationImage(true);

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
        setDestinationForm((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        setDestinationForm((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
      }
    } catch (err) {
      setDestinationForm((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    } finally {
      setUploadingDestinationImage(false);
    }
  };

  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    if (!destinationForm.name.trim()) return;
    setSavingDestination(true);

    try {
      const url = editingDestinationId
        ? `${API_BASE_URL}/api/destinations/${editingDestinationId}`
        : `${API_BASE_URL}/api/destinations`;
      const res = await fetch(url, {
        method: editingDestinationId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(destinationForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchDestinationsList();
        setShowDestinationModal(false);
      } else {
        alert(data.message || "Error saving destination state");
      }
    } catch (err) {
      alert("Network error while saving destination state");
    } finally {
      setSavingDestination(false);
    }
  };

  const handleSeoDraftChange = (pageKey, field, value) => {
    setPageSeoDrafts((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value },
    }));
  };

  const handleSaveSeo = async (pageKey) => {
    setSavingSeoKey(pageKey);
    setSeoMsg({ type: "", text: "", key: "" });

    try {
      const draft = pageSeoDrafts[pageKey];
      const res = await fetch(`${API_BASE_URL}/api/seo/${pageKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPageSeoList((prev) => prev.map((row) => (row.page_key === pageKey ? data.data : row)));
        setSeoMsg({ type: "success", text: "✅ Saved!", key: pageKey });
      } else {
        setSeoMsg({ type: "error", text: data.message || "Error saving SEO settings", key: pageKey });
      }
    } catch (err) {
      setSeoMsg({ type: "error", text: "Network error while saving SEO settings", key: pageKey });
    } finally {
      setSavingSeoKey(null);
    }
  };

  const handleOpenAddBlogModal = () => {
    setEditingBlogId(null);
    setBlogForm(defaultBlogForm);
    setBlogPreviewMode(false);
    setShowBlogModal(true);
  };

  const handleEditBlogPost = (post) => {
    setEditingBlogId(post.id);
    setBlogForm({
      title: post.title || "",
      slug: post.slug || "",
      featuredImage: post.featured_image || "",
      featuredImageAlt: post.featured_image_alt || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "Wanderama Team",
      metaTitle: post.meta_title || "",
      metaDescription: post.meta_description || "",
      schemaMarkup: post.schema_markup || "",
      ctaTitle: post.cta_title || "",
      ctaDescription: post.cta_description || "",
      ctaButtonText: post.cta_button_text || "",
      ctaButtonLink: post.cta_button_link || "",
      tocItems: Array.isArray(post.toc_items)
        ? post.toc_items.map((item) => ({ label: item.label || "", heading: item.heading || "", description: item.description || "" }))
        : [],
      faqs: Array.isArray(post.faqs)
        ? post.faqs.map((item) => ({ question: item.question || "", answer: item.answer || "" }))
        : [],
    });
    setBlogPreviewMode(false);
    setShowBlogModal(true);
  };

  const handleAddBlogTocItem = () => {
    setBlogForm((prev) => ({
      ...prev,
      tocItems: [...(prev.tocItems || []), { label: "", heading: "", description: "" }],
    }));
  };

  const handleBlogTocItemChange = (index, field, value) => {
    setBlogForm((prev) => {
      const updated = [...(prev.tocItems || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, tocItems: updated };
    });
  };

  const handleRemoveBlogTocItem = (index) => {
    setBlogForm((prev) => ({
      ...prev,
      tocItems: (prev.tocItems || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddBlogFaq = () => {
    setBlogForm((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: "", answer: "" }],
    }));
  };

  const handleBlogFaqChange = (index, field, value) => {
    setBlogForm((prev) => {
      const updated = [...(prev.faqs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveBlogFaq = (index) => {
    setBlogForm((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index),
    }));
  };

  const handleBlogImageUpload = async (file) => {
    if (!file) return;
    setUploadingBlogImage(true);

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
        setBlogForm((prev) => ({ ...prev, featuredImage: data.url }));
      } else {
        setBlogForm((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
      }
    } catch (err) {
      setBlogForm((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
    } finally {
      setUploadingBlogImage(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) return;
    setSavingBlog(true);

    try {
      const url = editingBlogId
        ? `${API_BASE_URL}/api/blog/${editingBlogId}`
        : `${API_BASE_URL}/api/blog`;
      const res = await fetch(url, {
        method: editingBlogId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...blogForm,
          tocItems: (blogForm.tocItems || []).filter((item) => item.label && item.label.trim() && item.heading && item.heading.trim()),
          faqs: (blogForm.faqs || []).filter((item) => item.question && item.question.trim() && item.answer && item.answer.trim()),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchBlogPosts();
        setShowBlogModal(false);
      } else {
        alert(data.message || "Error saving blog post");
      }
    } catch (err) {
      alert("Network error while saving blog post");
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlogPost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBlogPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Error deleting blog post");
      }
    } catch (err) {
      alert("Network error while deleting blog post");
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination state?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/destinations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDestinationsList((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert(data.message || "Error deleting destination state");
      }
    } catch (err) {
      alert("Network error while deleting destination state");
    }
  };

  const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;

  const handleSelectTab = (tabKey) => {
    setActiveTab(tabKey);
    const targetPath = tabKey === "overview" ? "/admin" : `/admin/${tabKey}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
    <SEO title="Admin Dashboard" noindex />
    <div className="admin-dashboard-root" style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ELEGANT PROFESSIONAL SIDEBAR */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        counts={{
          properties: properties.length,
          amenities: amenitiesList.length,
          gallery: galleryList.length,
          eventTypes: eventTypesList.length,
          team: teamList.length,
          blog: blogPosts.length,
          destinations: destinationsList.length,
        }}
        enquiriesCount={newEnquiriesCount}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* RIGHT MAIN PAGE CONTENT */}
      <main style={{ flexGrow: 1, padding: "28px 36px", overflowY: "auto" }}>
        {/* Top Header Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: "#E2E8F0" }}>
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="admin-menu-toggle d-lg-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open admin menu"
              style={{
                background: "#0F172A",
                border: "none",
                borderRadius: "8px",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
            <div style={{ fontSize: "12px", color: "#64748B", fontWeight: "500", marginBottom: "4px" }}>
              Admin Panel &gt; <span style={{ color: "#0F172A", fontWeight: "600" }}>{activeTab.toUpperCase()}</span>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "hero" && "Hero Banner Management"}
              {activeTab === "properties" && "Properties Management"}
              {activeTab === "enquiries" && "Customer Stay Enquiries Desk"}
              {activeTab === "testimonials" && "Guest Reviews & Testimonials"}
              {activeTab === "amenities" && "Amenities Management"}
              {activeTab === "gallery" && "Gallery Management"}
              {activeTab === "about" && "About Page Management"}
              {activeTab === "partner" && "Partner With Us Page"}
              {activeTab === "team" && "Team & Co-Founders Management"}
              {activeTab === "eventTypes" && "Weddings & Events Management"}
              {activeTab === "other" && "Other Settings — Contact & Footer Info"}
              {activeTab === "destinations" && "Homepage Destination States"}
              {activeTab === "account" && "Account Settings"}
              {activeTab === "seo" && "SEO — Page Titles & Meta Descriptions"}
              {activeTab === "blog" && "Blog Management"}
            </h1>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {activeTab === "properties" && (
              <button
                onClick={() => navigate("/admin/properties/new")}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add Property
              </button>
            )}

            {activeTab === "amenities" && (
              <button
                onClick={handleOpenAddAmenityModal}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add Amenity
              </button>
            )}

            {activeTab === "destinations" && (
              <button
                onClick={handleOpenAddDestinationModal}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add State
              </button>
            )}

            {activeTab === "blog" && (
              <button
                onClick={handleOpenAddBlogModal}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add Blog Post
              </button>
            )}

            {activeTab === "testimonials" && (
              <button
                onClick={handleOpenAddTestimonialModal}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add Testimonial
              </button>
            )}

            {activeTab === "team" && (
              <button
                onClick={handleOpenAddTeamModal}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add Team Member
              </button>
            )}

            {activeTab === "eventTypes" && (
              <button
                onClick={handleOpenAddEventTypeModal}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add Event Type
              </button>
            )}

            {activeTab === "gallery" && (
              <button
                onClick={() => handleOpenAddGalleryModal(galleryFilterCategory)}
                className="btn btn-primary"
                style={{ borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600" }}
              >
                + Add Photo / Video
              </button>
            )}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            {/* KPI Cards Grid */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="p-4 bg-white rounded-3 border shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Total Properties
                    </span>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EBF3FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#0564F2" }}>
                      🏨
                    </div>
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#0F172A" }}>{properties.length}</div>
                  <div style={{ fontSize: "12.5px", color: "#166534", marginTop: "4px", fontWeight: "500" }}>
                    ● 100% Listed & Active
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-4 bg-white rounded-3 border shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Stay Enquiries
                    </span>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706" }}>
                      📩
                    </div>
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#0F172A" }}>{enquiries.length}</div>
                  <div style={{ fontSize: "12.5px", color: "#D97706", marginTop: "4px", fontWeight: "500" }}>
                    ● {newEnquiriesCount} New Unread Requests
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-4 bg-white rounded-3 border shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Guest Reviews
                    </span>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", color: "#15803D" }}>
                      ★
                    </div>
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#0F172A" }}>{testimonials.length}</div>
                  <div style={{ fontSize: "12.5px", color: "#15803D", marginTop: "4px", fontWeight: "500" }}>
                    ★ 5-Star Average Guest Rating
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Enquiries Table */}
            <div className="bg-white rounded-3 border shadow-sm p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Recent Customer Enquiries</h3>
                <button
                  onClick={() => setActiveTab("enquiries")}
                  style={{ background: "none", border: "none", color: "#0564F2", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                >
                  View All Enquiries &rarr;
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: "14px" }}>
                  <thead style={{ background: "#F8FAFC", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>
                    <tr>
                      <th style={{ padding: "12px 16px" }}>Guest Name</th>
                      <th style={{ padding: "12px 16px" }}>Contact</th>
                      <th style={{ padding: "12px 16px" }}>Property Requested</th>
                      <th style={{ padding: "12px 16px" }}>Message</th>
                      <th style={{ padding: "12px 16px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.slice(0, 5).map((e) => (
                      <tr key={e.id}>
                        <td style={{ padding: "14px 16px" }}>
                          <strong style={{ color: "#0F172A" }}>{e.name}</strong>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div>📞 {e.phone}</div>
                          <small style={{ color: "#64748B" }}>{e.email}</small>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span className="badge bg-light text-dark border px-2 py-1" style={{ fontWeight: "600" }}>
                            {e.property_slug || "General"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", maxWidth: "280px" }}>
                          <small style={{ color: "#334155" }}>{e.message}</small>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {e.status === "new" ? (
                            <span className="badge bg-warning-subtle text-warning-emphasis px-2 py-1">● New</span>
                          ) : (
                            <span className="badge bg-success-subtle text-success-emphasis px-2 py-1">✓ Contacted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* HERO BANNER TAB */}
        {activeTab === "hero" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0, display: "flex", alignItems: "center" }}>
                  Homepage Hero Banner Editor
                  <span
                    style={{
                      background: "#F1F5F9",
                      color: "#334155",
                      fontSize: "12px",
                      fontWeight: "600",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      marginLeft: "8px",
                      display: "inline-block"
                    }}
                  >
                    {heroSlides.length} Slides
                  </span>
                </h3>
                <p style={{ fontSize: "13.5px", color: "#64748B", margin: "4px 0 0 0" }}>
                  Add multiple slides, upload PC files or enter image URL links for homepage hero banner.
                </p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddHeroSlide}
                  className="btn btn-outline-primary"
                  style={{ borderRadius: "8px", fontWeight: "600", padding: "9px 18px", fontSize: "13.5px" }}
                >
                  ➕ Add New Slide
                </button>

                <button
                  onClick={handleSaveHeroSlides}
                  disabled={savingHero}
                  className="btn btn-primary"
                  style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 24px" }}
                >
                  {savingHero ? "Saving..." : "💾 Save Hero Settings"}
                </button>
              </div>
            </div>

            {heroMsg && (
              <div className="alert alert-info py-2 px-3 small rounded-3 mb-4">
                {heroMsg}
              </div>
            )}

            <form onSubmit={handleSaveHeroSlides}>
              <div className="d-flex flex-column gap-4">
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="p-4 bg-light rounded-3 border" style={{ position: "relative" }}>
                    <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#0F172A",
                            color: "#FFFFFF",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "700",
                            flexShrink: 0
                          }}
                        >
                          {idx + 1}
                        </span>
                        <h5 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", margin: 0, padding: 0, lineHeight: "1.4" }}>
                          Slide #{idx + 1} Configuration
                        </h5>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            background: "#EFF6FF",
                            color: "#2563EB",
                            fontSize: "12px",
                            fontWeight: "600",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            border: "1px solid #BFDBFE",
                            display: "inline-flex",
                            alignItems: "center",
                            lineHeight: "1.2"
                          }}
                        >
                          ● Active Slide
                        </span>
                        {heroSlides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveHeroSlide(idx)}
                            className="btn btn-outline-danger btn-sm"
                            style={{ borderRadius: "6px", fontSize: "12px", padding: "4px 12px", fontWeight: "600" }}
                          >
                            🗑️ Remove Slide
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-7">
                        <div className="mb-3">
                          <label className="form-label small fw-600 text-dark">Hero Main Heading Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={slide.title}
                            onChange={(e) => handleHeroSlideChange(idx, "title", e.target.value)}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-600 text-dark">Hero Sub-Description Paragraph</label>
                          <RichTextEditor
                            rows={2}
                            value={slide.description}
                            onChange={(html) => handleHeroSlideChange(idx, "description", html)}
                          />
                        </div>

                        {/* Dual Option Image Selection: PC Upload OR URL */}
                        <div className="p-3 bg-white rounded-3 border">
                          <label className="form-label small fw-700 text-dark mb-2 d-block">
                            🖼️ Slide Background Image Choice:
                          </label>

                          <div className="mb-3">
                            <label className="form-label micro text-muted fw-600 mb-1">Option A: Upload File From Your Computer</label>
                            <div className="d-flex gap-2 align-items-center">
                              <input
                                type="file"
                                accept="image/*"
                                className="form-control form-control-sm"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(idx, e.target.files[0]);
                                  }
                                }}
                              />
                              {uploadingIdx === idx && (
                                <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                              )}
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label micro text-muted fw-600 mb-1">Option B: Enter Web Image URL / Path</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="https://example.com/banner.jpg or /assets/img/slider/1.jpg"
                              value={slide.image_url}
                              onChange={(e) => handleHeroSlideChange(idx, "image_url", e.target.value)}
                              required
                            />
                          </div>

                          <div>
                            <label className="form-label micro text-muted fw-600 mb-1">Alt Text (for accessibility &amp; SEO)</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="e.g. Wanderama resort pool at sunset"
                              value={slide.image_alt || ""}
                              onChange={(e) => handleHeroSlideChange(idx, "image_alt", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Live Image Preview Card */}
                      <div className="col-md-5">
                        <label className="form-label small fw-600 text-dark">Live Image Preview</label>
                        <div
                          style={{
                            height: "230px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                            border: "1px solid #CBD5E1",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          }}
                        >
                          <img
                            src={resolveImageUrl(slide.image_url)}
                            alt={slide.title}
                            referrerPolicy="no-referrer"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/assets/img/slider/hero-bg.jpg";
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "rgba(15, 23, 42, 0.45)",
                              padding: "16px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              color: "#FFFFFF",
                            }}
                          >
                            <div style={{ fontSize: "14px", fontWeight: "700" }}>{slide.title}</div>
                            <div style={{ fontSize: "11px", opacity: 0.9 }} className="text-truncate">
                              {stripHtml(slide.description)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 d-flex align-items-center justify-content-between pt-3 border-top">
                <button
                  type="button"
                  onClick={handleAddHeroSlide}
                  className="btn btn-outline-primary"
                  style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 22px" }}
                >
                  ➕ Add Another Hero Slide
                </button>

                <button
                  type="submit"
                  disabled={savingHero}
                  className="btn btn-primary"
                  style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 32px" }}
                >
                  {savingHero ? "Saving..." : "💾 Save All Hero Settings"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === "properties" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Listed Properties ({properties.length})</h3>
              <button
                onClick={() => navigate("/admin/properties/new")}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: "8px", fontWeight: "600" }}
              >
                + Add Property
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: "14px" }}>
                <thead style={{ background: "#F8FAFC", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>
                  <tr>
                    <th style={{ padding: "12px 16px" }}>Property</th>
                    <th style={{ padding: "12px 16px" }}>Location</th>
                    <th style={{ padding: "12px 16px" }}>Type</th>
                    <th style={{ padding: "12px 16px" }}>Media Attachments</th>
                    <th style={{ padding: "12px 16px" }}>Tagline</th>
                    <th style={{ padding: "12px 16px" }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(properties) && properties.map((p, idx) => {
                    if (!p) return null;
                    const propKey = p.slug || p.id || idx;
                    const propId = p.id || p.slug;
                    return (
                      <tr key={propKey}>
                        <td style={{ padding: "14px 16px" }}>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={resolveImageUrl(p.thumbImage || p.heroImage)}
                              alt={p.name || "Property"}
                              style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid #E2E8F0" }}
                              onError={(e) => { e.target.src = "/assets/img/slider/hero-bg.jpg"; }}
                            />
                            <div>
                              <strong style={{ color: "#0F172A", display: "block" }}>{p.name || "Untitled Property"}</strong>
                              <div className="d-flex align-items-center gap-1 flex-wrap mt-1">
                                {p.slug && <small style={{ color: "#64748B", marginRight: "4px" }}>/{p.slug}</small>}
                                {Array.isArray(p.badges) && p.badges.map((b, bi) => (
                                  <span
                                    key={bi}
                                    style={{
                                      fontSize: "10.5px",
                                      fontWeight: "600",
                                      background: "#F5F2EA",
                                      color: "#0F172A",
                                      padding: "1px 7px",
                                      borderRadius: "999px",
                                      border: "1px solid #E2D9C8",
                                      lineHeight: "1.3",
                                    }}
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div className="fw-600 text-dark">📍 {p.location || "N/A"}, {p.state || ""}</div>
                          {(p.phone || p.mobile_no) && (
                            <div style={{ fontSize: "11px", color: "#2563EB", marginTop: "3px", fontWeight: "600" }}>
                              📞 {p.phone || p.mobile_no}
                            </div>
                          )}
                          {p.address && (
                            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px", maxWidth: "220px" }} className="text-truncate" title={p.address}>
                              🏠 {p.address}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span className="badge bg-primary-subtle text-primary px-2.5 py-1">{p.type || "Resort"}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success-subtle text-success px-2 py-1" style={{ fontSize: "11px" }}>
                              🖼️ {Array.isArray(p.gallery) ? p.gallery.length : (p.gallery ? 1 : 0)} Image(s)
                            </span>
                            {(p.video || p.videoUrl) ? (
                              <button
                                type="button"
                                onClick={() => setSelectedVideoPreview({ name: p.name || "Video", url: p.video || p.videoUrl })}
                                className="btn btn-dark btn-sm py-0 px-2"
                                style={{ fontSize: "11px", borderRadius: "6px" }}
                              >
                                ▶️ Watch Video
                              </button>
                            ) : (
                              <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: "11px" }}>
                                No Video
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", maxWidth: "220px" }}>
                          <small style={{ color: "#475569" }} className="text-truncate d-block">{p.tagline || ""}</small>
                        </td>
                        <td style={{ padding: "14px 16px" }} className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <button
                              onClick={() => navigate(`/admin/properties/${propId}/edit`)}
                              className="btn btn-outline-primary btn-sm"
                              style={{ borderRadius: "6px", fontWeight: "600", fontSize: "12.5px" }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(propId)}
                              className="btn btn-outline-danger btn-sm"
                              style={{ borderRadius: "6px", fontSize: "12.5px" }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ENQUIRIES TAB */}
        {activeTab === "enquiries" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "16px" }}>Customer Stay Enquiries ({enquiries.length})</h3>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: "14px" }}>
                <thead style={{ background: "#F8FAFC", color: "#475569", fontSize: "12px", textTransform: "uppercase" }}>
                  <tr>
                    <th style={{ padding: "12px 16px" }}>Guest Name</th>
                    <th style={{ padding: "12px 16px" }}>Contact Information</th>
                    <th style={{ padding: "12px 16px" }}>Property Requested</th>
                    <th style={{ padding: "12px 16px" }}>Message Details</th>
                    <th style={{ padding: "12px 16px" }}>Status</th>
                    <th style={{ padding: "12px 16px" }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <tr key={e.id}>
                      <td style={{ padding: "14px 16px" }}>
                        <strong style={{ color: "#0F172A" }}>{e.name}</strong>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div>📞 {e.phone}</div>
                        <small style={{ color: "#64748B" }}>✉️ {e.email}</small>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className="badge bg-light text-dark border px-2 py-1">{e.property_slug || "General"}</span>
                      </td>
                      <td style={{ padding: "14px 16px", maxWidth: "280px" }}>
                        <small style={{ color: "#334155" }}>{e.message}</small>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {e.status === "new" ? (
                          <span className="badge bg-warning-subtle text-warning-emphasis px-2 py-1">● New</span>
                        ) : e.status === "contacted" ? (
                          <span className="badge bg-info-subtle text-info-emphasis px-2 py-1">✓ Contacted</span>
                        ) : (
                          <span className="badge bg-success-subtle text-success-emphasis px-2 py-1">✓ Closed</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px" }} className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => handleUpdateEnquiryStatus(e.id, "contacted")}
                            className="btn btn-outline-primary"
                          >
                            Contacted
                          </button>
                          <button
                            onClick={() => handleUpdateEnquiryStatus(e.id, "closed")}
                            className="btn btn-outline-success"
                          >
                            Close
                          </button>
                          <button onClick={() => handleDeleteEnquiry(e.id)} className="btn btn-outline-danger">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === "testimonials" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "16px" }}>
              Guest Reviews ({testimonials.length})
            </h3>
            {testimonials.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No testimonials yet. Click "+ Add Testimonial" to create one.</p>
            ) : (
              <div className="row g-3">
                {testimonials.map((t) => (
                  <div className="col-md-6" key={t.id}>
                    <div className="p-3 bg-light rounded-3 border h-100 d-flex flex-column">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <strong style={{ color: "#0F172A" }}>{t.author_name} ({t.author_location})</strong>
                        <span className="text-warning">{"★".repeat(t.rating)}</span>
                      </div>
                      <small className="text-muted d-block mb-2">Stayed at: {t.stay_property}</small>
                      <p style={{ fontSize: "13.5px", color: "#334155", flexGrow: 1 }}>"{stripHtml(t.quote_text)}"</p>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditTestimonial(t)}
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === "team" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "16px" }}>
              Team & Co-Founders ({teamList.length})
            </h3>
            {teamList.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No team members yet. Click "+ Add Team Member" to create one.</p>
            ) : (
              <div className="row g-3">
                {teamList.map((m) => (
                  <div className="col-md-6 col-lg-4" key={m.id}>
                    <div className="p-3 bg-light rounded-3 border h-100 d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <img
                          src={resolveImageUrl(m.photo_url)}
                          alt={m.name}
                          style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <strong style={{ color: "#0F172A", fontSize: "14.5px", display: "block" }}>{m.name}</strong>
                          <span
                            style={{
                              fontSize: "10.5px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              color: m.category === "founder" || m.category === "cofounder" ? "#D9A752" : "#64748B",
                            }}
                          >
                            {m.category === "founder" ? "Founder" : m.category === "cofounder" ? "Co-Founder" : "Team Member"}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: "13px", color: "#334155", marginBottom: "4px" }}>{m.role}</p>
                      {m.bio && <p style={{ fontSize: "12.5px", color: "#64748B", flexGrow: 1 }}>{stripHtml(m.bio)}</p>}
                      <div className="d-flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditTeamMember(m)}
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(m.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WEDDING & EVENTS TAB */}
        {activeTab === "eventTypes" && weddingHeroForm && (
          <div className="bg-white rounded-3 border shadow-sm p-4 mb-4">
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
              🎊 Weddings & Events Page — Hero Section
            </h3>
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              The full-width banner at the very top of the public Weddings &amp; Events page.
            </p>

            {weddingHeroMsg && (
              <div className={`alert py-2 px-3 mb-3 ${weddingHeroMsg.startsWith("✅") ? "alert-success" : "alert-danger"}`} style={{ fontSize: "13px" }}>
                {weddingHeroMsg}
              </div>
            )}

            <form onSubmit={handleSaveWeddingHero}>
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label small fw-600 mb-1">Background Image</label>
                  <label className="form-label micro text-muted fw-600 mb-1">Option A: Upload from PC</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-2"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleWeddingHeroImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                  {uploadingWeddingHeroImage === "image" && <div className="text-info micro mb-2">⏳ Uploading...</div>}
                  <label className="form-label micro text-muted fw-600 mb-1">Option B: Enter Web Image Link</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="https://images.unsplash.com/..."
                    value={weddingHeroForm.image || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("image", e.target.value)}
                  />
                  <label className="form-label micro text-muted fw-600 mb-1">Alt Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="e.g. Wedding mandap set up at a Wanderama lawn"
                    value={weddingHeroForm.image_alt || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("image_alt", e.target.value)}
                  />
                  {weddingHeroForm.image && (
                    <img
                      src={resolveImageUrl(weddingHeroForm.image)}
                      alt="Hero preview"
                      style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", border: "1px solid #E2E8F0" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="col-md-7">
                  <div className="mb-3">
                    <label className="form-label small fw-600">Eyebrow Tag</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="WEDDINGS & EVENTS"
                      value={weddingHeroForm.eyebrow || ""}
                      onChange={(e) => handleWeddingHeroFieldChange("eyebrow", e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-600">Heading</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Celebrate Your Big Moments, The Wanderama Way"
                      value={weddingHeroForm.title || ""}
                      onChange={(e) => handleWeddingHeroFieldChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-600">Description</label>
                    <RichTextEditor
                      rows={3}
                      value={weddingHeroForm.description || ""}
                      onChange={(html) => handleWeddingHeroFieldChange("description", html)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-600">Button 1 Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Plan Your Event"
                    value={weddingHeroForm.btn1_text || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("btn1_text", e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-600">Button 1 Link</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="/contact"
                    value={weddingHeroForm.btn1_link || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("btn1_link", e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-600">Button 2 Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Explore Event Venues"
                    value={weddingHeroForm.btn2_text || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("btn2_text", e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-600">Button 2 Link</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="/properties"
                    value={weddingHeroForm.btn2_link || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("btn2_link", e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-600">Small Disclaimer Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Venue capacity, menus, decor, availability and pricing are confirmed individually for each event."
                    value={weddingHeroForm.disclaimer || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("disclaimer", e.target.value)}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
                🏛️ "Guest Experience" About Section
              </h3>
              <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
                The image + checklist block shown just below the hero on the public page.
              </p>

              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label small fw-600 mb-1">Section Image</label>
                  <label className="form-label micro text-muted fw-600 mb-1">Option A: Upload from PC</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-2"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleWeddingHeroImageUpload(e.target.files[0], "about_image");
                      }
                    }}
                  />
                  {uploadingWeddingHeroImage === "about_image" && <div className="text-info micro mb-2">⏳ Uploading...</div>}
                  <label className="form-label micro text-muted fw-600 mb-1">Option B: Enter Web Image Link</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="https://images.unsplash.com/..."
                    value={weddingHeroForm.about_image || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("about_image", e.target.value)}
                  />
                  <label className="form-label micro text-muted fw-600 mb-1">Alt Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="e.g. Guests dining at a Wanderama event lawn"
                    value={weddingHeroForm.about_image_alt || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("about_image_alt", e.target.value)}
                  />
                  {weddingHeroForm.about_image && (
                    <img
                      src={resolveImageUrl(weddingHeroForm.about_image)}
                      alt="About section preview"
                      style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", border: "1px solid #E2E8F0" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="col-md-7">
                  <div className="mb-3">
                    <label className="form-label small fw-600">Eyebrow Tag</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="MORE THAN A VENUE"
                      value={weddingHeroForm.about_eyebrow || ""}
                      onChange={(e) => handleWeddingHeroFieldChange("about_eyebrow", e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-600">Heading</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Your Event Is Also A Guest Experience"
                      value={weddingHeroForm.about_title || ""}
                      onChange={(e) => handleWeddingHeroFieldChange("about_title", e.target.value)}
                    />
                  </div>
                  <div className="mb-0">
                    <label className="form-label small fw-600">Description</label>
                    <RichTextEditor
                      rows={3}
                      value={weddingHeroForm.about_description || ""}
                      onChange={(html) => handleWeddingHeroFieldChange("about_description", html)}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-600 mb-2">Checklist Items</label>
                  <div className="d-flex flex-column gap-2 mb-2">
                    {(weddingHeroForm.about_features || []).map((feature, idx) => (
                      <div className="d-flex gap-2" key={idx}>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={feature}
                          onChange={(e) => handleWeddingAboutFeatureChange(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveWeddingAboutFeature(idx)}
                          className="btn btn-outline-danger btn-sm py-0 px-2 flex-shrink-0"
                          style={{ fontSize: "11px", fontWeight: "600" }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddWeddingAboutFeature}
                    className="btn btn-outline-secondary btn-sm"
                    style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
                  >
                    + Add Checklist Item
                  </button>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-600">Button Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Discuss Your Requirements"
                    value={weddingHeroForm.about_button_text || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("about_button_text", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Button Link</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="/contact"
                    value={weddingHeroForm.about_button_link || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("about_button_link", e.target.value)}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
                🗂️ "Event Planning Options" Section Header
              </h3>
              <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
                The heading above the plan option cards below. The cards themselves are managed further down this page.
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-600">Heading</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Event Planning Options"
                    value={weddingHeroForm.plan_options_title || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("plan_options_title", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Subtext</label>
                  <RichTextEditor
                    rows={1}
                    placeholder="Use these as starting points..."
                    value={weddingHeroForm.plan_options_description || ""}
                    onChange={(html) => handleWeddingHeroFieldChange("plan_options_description", html)}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
                ❓ FAQs Section Header
              </h3>
              <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
                The heading above the FAQ accordion below. The questions themselves are managed further down this page.
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-600">Heading</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Frequently Asked Questions"
                    value={weddingHeroForm.faqs_title || ""}
                    onChange={(e) => handleWeddingHeroFieldChange("faqs_title", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Subtext (optional)</label>
                  <RichTextEditor
                    rows={1}
                    placeholder="Optional subtext"
                    value={weddingHeroForm.faqs_description || ""}
                    onChange={(html) => handleWeddingHeroFieldChange("faqs_description", html)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm mt-3"
                disabled={savingWeddingHero}
                style={{ borderRadius: "6px", fontWeight: "600" }}
              >
                {savingWeddingHero ? "Saving..." : "Save Weddings Page Content"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "eventTypes" && (
          <div className="bg-white rounded-3 border shadow-sm p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                🗂️ Event Planning Options ({planOptionsList.length})
              </h3>
              <button
                onClick={handleOpenAddPlanOptionModal}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: "6px", fontWeight: "600" }}
              >
                + Add Plan Option
              </button>
            </div>
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              The 3 cards shown under "Event Planning Options" on the public Weddings &amp; Events page. Mark one "Featured" to highlight it.
            </p>
            {planOptionsList.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No plan options yet. Click "+ Add Plan Option" to create one.</p>
            ) : (
              <div className="row g-3">
                {planOptionsList.map((option) => (
                  <div className="col-md-6 col-lg-4" key={option.id}>
                    <div
                      className="p-3 rounded-3 border h-100 d-flex flex-column"
                      style={{ background: option.featured ? "#FFFBF0" : "#F8FAFC", borderColor: option.featured ? "#D9A752" : "#E2E8F0" }}
                    >
                      {option.featured && (
                        <span className="badge bg-warning-subtle text-warning mb-2" style={{ fontSize: "10.5px", width: "fit-content" }}>
                          ⭐ FEATURED
                        </span>
                      )}
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#10372B", letterSpacing: "0.5px" }}>{option.eyebrow}</span>
                      <strong style={{ color: "#0F172A", fontSize: "14.5px", marginBottom: "6px" }}>{option.title}</strong>
                      <p style={{ fontSize: "12.5px", color: "#64748B", flexGrow: 1 }}>{stripHtml(option.description)}</p>
                      {Array.isArray(option.bullets) && option.bullets.length > 0 && (
                        <ul className="mb-2" style={{ fontSize: "12px", color: "#475569", paddingLeft: "18px" }}>
                          {option.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                      <div className="d-flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditPlanOption(option)}
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlanOption(option.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "eventTypes" && (
          <div className="bg-white rounded-3 border shadow-sm p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                ❓ Weddings & Events FAQs ({weddingFaqsList.length})
              </h3>
              <button
                onClick={handleOpenAddWeddingFaqModal}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: "6px", fontWeight: "600" }}
              >
                + Add FAQ
              </button>
            </div>
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              Shown as an expandable accordion below the photo gallery on the public Weddings &amp; Events page, in this order.
            </p>
            {weddingFaqsList.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No FAQs yet. Click "+ Add FAQ" to create one.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {weddingFaqsList.map((faq) => (
                  <div key={faq.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border">
                    <div className="text-truncate me-3" style={{ fontSize: "13px" }}>
                      <strong style={{ color: "#0F172A" }} className="d-block">{faq.question}</strong>
                      <span className="text-muted">{stripHtml(faq.answer)}</span>
                    </div>
                    <div className="d-flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditWeddingFaq(faq)}
                        className="btn btn-sm btn-outline-secondary"
                        style={{ fontSize: "12px", borderRadius: "6px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteWeddingFaq(faq.id)}
                        className="btn btn-sm btn-outline-danger"
                        style={{ fontSize: "12px", borderRadius: "6px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "eventTypes" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "16px" }}>
              Weddings & Events ({eventTypesList.length})
            </h3>
            <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
              These show up as full showcase blocks (alternating dark/light) on the public Weddings &amp; Events page, in this order.
            </p>
            {eventTypesList.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No event types yet. Click "+ Add Event Type" to create one.</p>
            ) : (
              <div className="row g-3">
                {eventTypesList.map((et) => (
                  <div className="col-md-6 col-lg-4" key={et.id}>
                    <div className="p-3 bg-light rounded-3 border h-100 d-flex flex-column">
                      <img
                        src={resolveImageUrl(et.image_url)}
                        alt={et.title}
                        style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                      />
                      <strong style={{ color: "#0F172A", fontSize: "14.5px" }}>{et.title}</strong>
                      <span style={{ fontSize: "12.5px", color: "#D9A752", fontWeight: "600", marginBottom: "6px" }}>{et.subtitle}</span>
                      <p style={{ fontSize: "12.5px", color: "#64748B", flexGrow: 1 }}>
                        {stripHtml(et.description).slice(0, 120)}{stripHtml(et.description).length > 120 ? "…" : ""}
                      </p>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditEventType(et)}
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEventType(et.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AMENITIES TAB */}
        {activeTab === "amenities" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                Website Amenities ({amenitiesList.length})
              </h3>
            </div>
            {amenitiesList.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No amenities yet. Click "+ Add Amenity" to create one.</p>
            ) : (
              <div className="row g-3">
                {amenitiesList.map((a) => (
                  <div className="col-md-6 col-lg-4" key={a.id}>
                    <div className="p-3 bg-light rounded-3 border h-100 d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EBF3FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#0564F2" }}>
                          <AmenityIcon name={a.icon} className="icon-18" />
                        </div>
                        <strong style={{ color: "#0F172A", fontSize: "14.5px" }}>{a.title}</strong>
                      </div>
                      <p style={{ fontSize: "13px", color: "#334155", flexGrow: 1 }}>{stripHtml(a.description)}</p>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditAmenity(a)}
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAmenity(a.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ fontSize: "12px", borderRadius: "6px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                Website Gallery ({galleryList.length})
              </h3>
              <div className="d-flex flex-wrap gap-2">
                <button
                  onClick={() => setGalleryFilterCategory("all")}
                  className={`btn btn-sm ${galleryFilterCategory === "all" ? "btn-dark" : "btn-outline-secondary"}`}
                  style={{ fontSize: "12px", borderRadius: "6px" }}
                >
                  All
                </button>
                {galleryCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setGalleryFilterCategory(cat.id)}
                    className={`btn btn-sm ${galleryFilterCategory === cat.id ? "btn-dark" : "btn-outline-secondary"}`}
                    style={{ fontSize: "12px", borderRadius: "6px" }}
                  >
                    {cat.label} ({galleryList.filter((g) => g.category === cat.id).length})
                  </button>
                ))}
              </div>
            </div>

            {galleryCategories
              .filter((cat) => galleryFilterCategory === "all" || galleryFilterCategory === cat.id)
              .map((cat) => {
                const items = galleryList.filter((g) => g.category === cat.id);
                return (
                  <div key={cat.id} className="mb-4">
                    <h4 style={{ fontSize: "14.5px", fontWeight: "700", color: "#334155", marginBottom: "12px" }}>
                      {cat.label} ({items.length})
                    </h4>
                    {items.length === 0 ? (
                      <p className="text-muted small mb-3">No items in this section yet.</p>
                    ) : (
                      <div className="row g-3 mb-3">
                        {items.map((item) => (
                          <div className="col-md-4 col-lg-3" key={item.id}>
                            <div className="p-2 bg-light rounded-3 border h-100 d-flex flex-column">
                              <div style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: "8px", overflow: "hidden", background: "#0F172A" }}>
                                <img
                                  src={resolveImageUrl(item.type === "video" ? item.poster_url : item.url)}
                                  alt={item.title || cat.label}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/slider/hero-bg.jpg"; }}
                                />
                                {item.type === "video" && (
                                  <span style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(15,23,42,0.75)", color: "#FFF", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px" }}>
                                    🎥 VIDEO
                                  </span>
                                )}
                              </div>
                              {item.title && (
                                <small style={{ fontSize: "11.5px", color: "#334155", marginTop: "6px", fontWeight: "600" }}>{item.title}</small>
                              )}
                              <div className="d-flex gap-2 mt-2">
                                <button
                                  onClick={() => handleEditGalleryItem(item)}
                                  className="btn btn-sm btn-outline-secondary"
                                  style={{ fontSize: "11px", borderRadius: "6px", flex: 1 }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteGalleryItem(item.id)}
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ fontSize: "11px", borderRadius: "6px", flex: 1 }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* ABOUT PAGE TAB */}
        {activeTab === "about" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            {!aboutForm ? (
              <p className="text-muted text-center py-4 mb-0">Loading About page content...</p>
            ) : (
              <form onSubmit={handleSaveAbout}>
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>About Page Content Editor</h3>
                    <p style={{ fontSize: "13.5px", color: "#64748B", margin: "4px 0 0 0" }}>
                      Controls the Homepage "Our Story" section, and the Intro, Journey, Philosophy, Founder and Stats sections on the About Us page.
                    </p>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingAbout} style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 24px" }}>
                    {savingAbout ? "Saving..." : "💾 Save About Page"}
                  </button>
                </div>

                {aboutMsg && <div className="alert alert-info py-2 px-3 small rounded-3 mb-4">{aboutMsg}</div>}

                {/* Homepage Intro Section */}
                <div className="p-4 bg-light rounded-3 border mb-4" style={{ borderColor: "#93C5FD" }}>
                  <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>Homepage — "Our Story & Philosophy" Section</h5>
                  <p className="small text-muted mb-3">This controls the introduction block on the public Homepage (separate from the About Us page below).</p>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-600">Heading</label>
                      <input type="text" className="form-control" value={aboutForm.home_intro_title || ""} onChange={(e) => handleAboutFieldChange("home_intro_title", e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-600">Main Image</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handleAboutFileUpload("home_intro_image", e.target.files[0])} disabled={uploadingAboutField === "home_intro_image"} />
                      <input type="text" className="form-control form-control-sm mb-2" placeholder="or paste image URL" value={aboutForm.home_intro_image || ""} onChange={(e) => handleAboutFieldChange("home_intro_image", e.target.value)} />
                      <label className="form-label small fw-600">Alt Text</label>
                      <input type="text" className="form-control form-control-sm mb-2" placeholder="Describe this image" value={aboutForm.home_intro_image_alt || ""} onChange={(e) => handleAboutFieldChange("home_intro_image_alt", e.target.value)} />
                      <label className="form-label small fw-600">Small Overlay Photo</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handleAboutFileUpload("home_intro_image_sm", e.target.files[0])} disabled={uploadingAboutField === "home_intro_image_sm"} />
                      <input type="text" className="form-control form-control-sm" placeholder="or paste image URL" value={aboutForm.home_intro_image_sm || ""} onChange={(e) => handleAboutFieldChange("home_intro_image_sm", e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Paragraph</label>
                      <RichTextEditor rows={4} value={aboutForm.home_intro_text || ""} onChange={(html) => handleAboutFieldChange("home_intro_text", html)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Highlights Checklist</label>
                      <div className="small text-muted mb-2">Shown as square cards: big value on the first line, label below. Use "|" to control the split, e.g. <strong>9+ | Years of Experience</strong>. Without "|", the number in the text is auto-detected.</div>
                      {(aboutForm.home_intro_features || []).map((f, i) => (
                        <div className="d-flex gap-2 mb-2" key={i}>
                          <input type="text" className="form-control form-control-sm" value={f} onChange={(e) => handleHomeIntroFeatureChange(i, e.target.value)} />
                          <button type="button" onClick={() => handleRemoveHomeIntroFeature(i)} className="btn btn-sm btn-outline-danger">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddHomeIntroFeature} className="btn btn-sm btn-outline-secondary">+ Add Highlight</button>
                    </div>
                  </div>
                </div>

                {/* Why Wanderama Section */}
                <div className="p-4 bg-light rounded-3 border mb-4" style={{ borderColor: "#93C5FD" }}>
                  <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>Homepage — "Why Wanderama" Section</h5>
                  <p className="small text-muted mb-3">Controls the "Why Wanderama" block on the public Homepage (image, heading, numbered highlights and the CTA button).</p>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-600">Small Tag (above heading)</label>
                      <input type="text" className="form-control mb-3" placeholder="e.g. WHY WANDERAMA" value={aboutForm.why_tag || ""} onChange={(e) => handleAboutFieldChange("why_tag", e.target.value)} />
                      <label className="form-label small fw-600">Heading</label>
                      <input type="text" className="form-control" value={aboutForm.why_title || ""} onChange={(e) => handleAboutFieldChange("why_title", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-600">Image</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handleAboutFileUpload("why_image", e.target.files[0])} disabled={uploadingAboutField === "why_image"} />
                      <input type="text" className="form-control form-control-sm mb-2" placeholder="or paste image URL" value={aboutForm.why_image || ""} onChange={(e) => handleAboutFieldChange("why_image", e.target.value)} />
                      <label className="form-label small fw-600">Alt Text</label>
                      <input type="text" className="form-control form-control-sm" placeholder="Describe this image" value={aboutForm.why_image_alt || ""} onChange={(e) => handleAboutFieldChange("why_image_alt", e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Paragraph</label>
                      <RichTextEditor rows={3} value={aboutForm.why_text || ""} onChange={(html) => handleAboutFieldChange("why_text", html)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Numbered Highlights</label>
                      {(aboutForm.why_features || []).map((f, i) => (
                        <div className="d-flex gap-2 mb-2 align-items-start" key={i}>
                          <span className="badge bg-secondary mt-2" style={{ minWidth: "30px" }}>{String(i + 1).padStart(2, "0")}</span>
                          <div className="flex-grow-1">
                            <input type="text" className="form-control form-control-sm mb-1" placeholder="Title" value={f.title || ""} onChange={(e) => handleWhyFeatureChange(i, "title", e.target.value)} />
                            <RichTextEditor rows={1} placeholder="Description" value={f.desc || ""} onChange={(html) => handleWhyFeatureChange(i, "desc", html)} />
                          </div>
                          <button type="button" onClick={() => handleRemoveWhyFeature(i)} className="btn btn-sm btn-outline-danger">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddWhyFeature} className="btn btn-sm btn-outline-secondary">+ Add Highlight</button>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-600">Button Text</label>
                      <input type="text" className="form-control" placeholder="e.g. Why Choose Wanderama" value={aboutForm.why_button_text || ""} onChange={(e) => handleAboutFieldChange("why_button_text", e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-600">Button Link</label>
                      <input type="text" className="form-control" placeholder="e.g. /about" value={aboutForm.why_button_link || ""} onChange={(e) => handleAboutFieldChange("why_button_link", e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Intro Section */}
                <div className="p-4 bg-light rounded-3 border mb-4">
                  <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>Section 1 — Who We Are (Intro)</h5>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-600">Heading</label>
                      <input type="text" className="form-control" value={aboutForm.intro_title || ""} onChange={(e) => handleAboutFieldChange("intro_title", e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-600">Main Image</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handleAboutFileUpload("intro_image", e.target.files[0])} disabled={uploadingAboutField === "intro_image"} />
                      <input type="text" className="form-control form-control-sm mb-2" placeholder="or paste image URL" value={aboutForm.intro_image || ""} onChange={(e) => handleAboutFieldChange("intro_image", e.target.value)} />
                      <label className="form-label small fw-600">Alt Text</label>
                      <input type="text" className="form-control form-control-sm mb-2" placeholder="Describe this image" value={aboutForm.intro_image_alt || ""} onChange={(e) => handleAboutFieldChange("intro_image_alt", e.target.value)} />
                      <label className="form-label small fw-600">Small Overlay Photo</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handleAboutFileUpload("intro_image_sm", e.target.files[0])} disabled={uploadingAboutField === "intro_image_sm"} />
                      <input type="text" className="form-control form-control-sm" placeholder="or paste image URL" value={aboutForm.intro_image_sm || ""} onChange={(e) => handleAboutFieldChange("intro_image_sm", e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Paragraph</label>
                      <RichTextEditor rows={4} value={aboutForm.intro_text || ""} onChange={(html) => handleAboutFieldChange("intro_text", html)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Highlights Checklist</label>
                      {(aboutForm.features || []).map((f, i) => (
                        <div className="d-flex gap-2 mb-2" key={i}>
                          <input type="text" className="form-control form-control-sm" value={f} onChange={(e) => handleAboutFeatureChange(i, e.target.value)} />
                          <button type="button" onClick={() => handleRemoveAboutFeature(i)} className="btn btn-sm btn-outline-danger">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddAboutFeature} className="btn btn-sm btn-outline-secondary">+ Add Highlight</button>
                    </div>
                  </div>
                </div>

                {/* Journey Section */}
                <div className="p-4 bg-light rounded-3 border mb-4">
                  <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>Section 2 — Our Journey</h5>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-600">Heading</label>
                      <input type="text" className="form-control" value={aboutForm.journey_title || ""} onChange={(e) => handleAboutFieldChange("journey_title", e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-600">Main Image</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handleAboutFileUpload("journey_image", e.target.files[0])} disabled={uploadingAboutField === "journey_image"} />
                      <input type="text" className="form-control form-control-sm mb-2" placeholder="or paste image URL" value={aboutForm.journey_image || ""} onChange={(e) => handleAboutFieldChange("journey_image", e.target.value)} />
                      <label className="form-label small fw-600">Alt Text</label>
                      <input type="text" className="form-control form-control-sm mb-2" placeholder="Describe this image" value={aboutForm.journey_image_alt || ""} onChange={(e) => handleAboutFieldChange("journey_image_alt", e.target.value)} />
                      <label className="form-label small fw-600">Small Overlay Photo</label>
                      <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handleAboutFileUpload("journey_image_sm", e.target.files[0])} disabled={uploadingAboutField === "journey_image_sm"} />
                      <input type="text" className="form-control form-control-sm" placeholder="or paste image URL" value={aboutForm.journey_image_sm || ""} onChange={(e) => handleAboutFieldChange("journey_image_sm", e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Paragraph 1</label>
                      <RichTextEditor rows={3} value={aboutForm.journey_text_1 || ""} onChange={(html) => handleAboutFieldChange("journey_text_1", html)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-600">Paragraph 2</label>
                      <RichTextEditor rows={3} value={aboutForm.journey_text_2 || ""} onChange={(html) => handleAboutFieldChange("journey_text_2", html)} />
                    </div>
                  </div>
                </div>

                {/* Philosophy Section */}
                <div className="p-4 bg-light rounded-3 border mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Section 3 — Vision & Hospitality Philosophy Cards</h5>
                    <button type="button" onClick={handleAddAboutPhilosophy} className="btn btn-sm btn-outline-secondary">+ Add Card</button>
                  </div>
                  <div className="row g-3">
                    {(aboutForm.philosophy || []).map((item, i) => (
                      <div className="col-md-6" key={i}>
                        <div className="p-3 bg-white rounded-3 border h-100">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#EBF3FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#0564F2", flexShrink: 0 }}>
                              <AboutIcon name={item.icon} className="icon-16" />
                            </div>
                            <select className="form-select form-select-sm" value={item.icon} onChange={(e) => handleAboutPhilosophyChange(i, "icon", e.target.value)}>
                              {aboutIconNames.map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <button type="button" onClick={() => handleRemoveAboutPhilosophy(i)} className="btn btn-sm btn-outline-danger" style={{ flexShrink: 0 }}>✕</button>
                          </div>
                          <input type="text" className="form-control form-control-sm mb-2" placeholder="Title" value={item.title} onChange={(e) => handleAboutPhilosophyChange(i, "title", e.target.value)} />
                          <RichTextEditor rows={2} placeholder="Description" value={item.desc} onChange={(html) => handleAboutPhilosophyChange(i, "desc", html)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Founder Section — moved to the Team tab */}
                <div className="p-4 bg-light rounded-3 border mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>Section 4 — Meet Our Founder</h5>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      The Founder is now managed as a team member, alongside Co-Founders and the rest of the team — edit their name, photo, bio and social links from the <strong>Team</strong> tab.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("team")}
                    className="btn btn-outline-primary"
                    style={{ borderRadius: "8px", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}
                  >
                    Go to Team Tab →
                  </button>
                </div>

                {/* Stats Section */}
                <div className="p-4 bg-light rounded-3 border">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Section 5 — Achievements & Experience Stats</h5>
                    <button type="button" onClick={handleAddAboutStat} className="btn btn-sm btn-outline-secondary">+ Add Stat</button>
                  </div>
                  <div className="row g-3">
                    {(aboutForm.stats || []).map((s, i) => (
                      <div className="col-md-3 col-6" key={i}>
                        <div className="p-3 bg-white rounded-3 border">
                          <input type="text" className="form-control form-control-sm mb-2" placeholder="Number e.g. 9" value={s.number} onChange={(e) => handleAboutStatChange(i, "number", e.target.value)} />
                          <input type="text" className="form-control form-control-sm mb-2" placeholder="Label e.g. Properties" value={s.label} onChange={(e) => handleAboutStatChange(i, "label", e.target.value)} />
                          <button type="button" onClick={() => handleRemoveAboutStat(i)} className="btn btn-sm btn-outline-danger w-100">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PARTNER WITH US TAB */}
        {activeTab === "partner" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            {!partnerForm ? (
              <p className="text-muted text-center py-4 mb-0">Loading Partner With Us page content...</p>
            ) : (
              <form onSubmit={handleSavePartner}>
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Partner With Us Page Editor</h3>
                    <p style={{ fontSize: "13.5px", color: "#64748B", margin: "4px 0 0 0" }}>
                      Controls the /partner-with-us page: banner image, intro text, the benefits grid, and the partnership enquiry form's heading.
                    </p>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingPartner} style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 24px" }}>
                    {savingPartner ? "Saving..." : "💾 Save Changes"}
                  </button>
                </div>

                {partnerMsg && <div className="alert alert-info py-2 px-3 small rounded-3 mb-4">{partnerMsg}</div>}

                <div className="row g-4">
                  <div className="col-12">
                    <div className="p-4 bg-light rounded-3 border">
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>Banner & Intro</h5>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label small fw-600">Banner Image</label>
                          <input type="file" accept="image/*" className="form-control form-control-sm mb-1" onChange={(e) => handlePartnerImageUpload(e.target.files[0])} disabled={uploadingPartnerImage} />
                          <input type="text" className="form-control form-control-sm mb-2" placeholder="or paste image URL" value={partnerForm.image || ""} onChange={(e) => handlePartnerFieldChange("image", e.target.value)} />
                          <label className="form-label small fw-600">Alt Text</label>
                          <input type="text" className="form-control form-control-sm" placeholder="Describe this image" value={partnerForm.image_alt || ""} onChange={(e) => handlePartnerFieldChange("image_alt", e.target.value)} />
                        </div>
                        <div className="col-md-8">
                          <label className="form-label small fw-600">Eyebrow Tag</label>
                          <input type="text" className="form-control form-control-sm mb-2" placeholder="e.g. PARTNER WITH US" value={partnerForm.eyebrow || ""} onChange={(e) => handlePartnerFieldChange("eyebrow", e.target.value)} />
                          <label className="form-label small fw-600">Title</label>
                          <input type="text" className="form-control form-control-sm mb-2" value={partnerForm.title || ""} onChange={(e) => handlePartnerFieldChange("title", e.target.value)} />
                          <label className="form-label small fw-600">Description</label>
                          <RichTextEditor rows={3} value={partnerForm.description || ""} onChange={(html) => handlePartnerFieldChange("description", html)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-4 bg-light rounded-3 border">
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>Benefits Grid</h5>
                      {(partnerForm.benefits || []).map((b, i) => (
                        <div className="d-flex gap-2 mb-2 align-items-start" key={i}>
                          <span className="badge bg-secondary mt-2" style={{ minWidth: "30px" }}>{String(i + 1).padStart(2, "0")}</span>
                          <div className="flex-grow-1">
                            <input type="text" className="form-control form-control-sm mb-1" placeholder="Title" value={b.title || ""} onChange={(e) => handlePartnerBenefitChange(i, "title", e.target.value)} />
                            <RichTextEditor rows={1} placeholder="Description" value={b.desc || ""} onChange={(html) => handlePartnerBenefitChange(i, "desc", html)} />
                          </div>
                          <button type="button" onClick={() => handleRemovePartnerBenefit(i)} className="btn btn-sm btn-outline-danger">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddPartnerBenefit} className="btn btn-sm btn-outline-secondary">+ Add Benefit</button>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-4 bg-light rounded-3 border" style={{ borderColor: "#93C5FD" }}>
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>"What We Do" Services Grid</h5>
                      <p className="small text-muted mb-3">Shown just below the page banner. Add, edit, reorder or remove service cards below.</p>
                      <div className="row g-3 mb-3">
                        <div className="col-md-4">
                          <label className="form-label small fw-600">Eyebrow Tag</label>
                          <input type="text" className="form-control form-control-sm" placeholder="e.g. OUR EXPERTISE" value={partnerForm.services_eyebrow || ""} onChange={(e) => handlePartnerFieldChange("services_eyebrow", e.target.value)} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-600">Section Title</label>
                          <input type="text" className="form-control form-control-sm" placeholder="e.g. What We Do" value={partnerForm.services_title || ""} onChange={(e) => handlePartnerFieldChange("services_title", e.target.value)} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-600">Section Description</label>
                          <RichTextEditor rows={1} value={partnerForm.services_description || ""} onChange={(html) => handlePartnerFieldChange("services_description", html)} />
                        </div>
                      </div>

                      {(partnerForm.services || []).map((s, si) => (
                        <div className="p-3 mb-3 bg-white rounded-3 border" key={si}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-secondary">Service {si + 1}</span>
                            <button type="button" onClick={() => handleRemovePartnerService(si)} className="btn btn-sm btn-outline-danger">✕ Remove Service</button>
                          </div>
                          <div className="row g-2 mb-2">
                            <div className="col-md-3">
                              <label className="form-label small fw-600">Icon</label>
                              <select className="form-select form-select-sm" value={s.icon || "common"} onChange={(e) => handlePartnerServiceChange(si, "icon", e.target.value)}>
                                {iconNames.map((name) => (
                                  <option key={name} value={name}>{name}</option>
                                ))}
                              </select>
                              <div className="mt-2 d-flex align-items-center gap-2">
                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FBF1DF", display: "flex", alignItems: "center", justifyContent: "center", color: "#10372B" }}>
                                  <AmenityIcon name={s.icon || "common"} className="icon-18" />
                                </div>
                                <div className="form-check mb-0">
                                  <input className="form-check-input" type="checkbox" id={`partner-service-featured-${si}`} checked={!!s.featured} onChange={(e) => handlePartnerServiceChange(si, "featured", e.target.checked)} />
                                  <label className="form-check-label small" htmlFor={`partner-service-featured-${si}`}>Highlighted card</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-9">
                              <label className="form-label small fw-600">Title</label>
                              <input type="text" className="form-control form-control-sm mb-2" value={s.title || ""} onChange={(e) => handlePartnerServiceChange(si, "title", e.target.value)} />
                              <label className="form-label small fw-600">Description</label>
                              <RichTextEditor rows={2} value={s.desc || ""} onChange={(html) => handlePartnerServiceChange(si, "desc", html)} />
                            </div>
                          </div>
                          <label className="form-label small fw-600 mt-2">Bullet Points</label>
                          {(s.items || []).map((item, ii) => (
                            <div className="d-flex gap-2 mb-1" key={ii}>
                              <input type="text" className="form-control form-control-sm" value={item} onChange={(e) => handlePartnerServiceItemChange(si, ii, e.target.value)} />
                              <button type="button" onClick={() => handleRemovePartnerServiceItem(si, ii)} className="btn btn-sm btn-outline-danger">✕</button>
                            </div>
                          ))}
                          <button type="button" onClick={() => handleAddPartnerServiceItem(si)} className="btn btn-sm btn-outline-secondary mt-1">+ Add Bullet Point</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddPartnerService} className="btn btn-sm btn-outline-primary">+ Add Service Card</button>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-4 bg-light rounded-3 border" style={{ borderColor: "#93C5FD" }}>
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "2px" }}>"Why Partner With Us" Benefits Grid</h5>
                      <p className="small text-muted mb-3">Shown below the Properties strip, as a 3-column grid of icon cards.</p>
                      <div className="row g-3 mb-3">
                        <div className="col-md-4">
                          <label className="form-label small fw-600">Eyebrow Tag</label>
                          <input type="text" className="form-control form-control-sm" placeholder="e.g. PARTNERSHIP BENEFITS" value={partnerForm.why_eyebrow || ""} onChange={(e) => handlePartnerFieldChange("why_eyebrow", e.target.value)} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-600">Section Title</label>
                          <input type="text" className="form-control form-control-sm" placeholder="e.g. Why Partner With Us" value={partnerForm.why_title || ""} onChange={(e) => handlePartnerFieldChange("why_title", e.target.value)} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-600">Section Description</label>
                          <RichTextEditor rows={1} value={partnerForm.why_description || ""} onChange={(html) => handlePartnerFieldChange("why_description", html)} />
                        </div>
                      </div>

                      {(partnerForm.why_items || []).map((w, wi) => (
                        <div className="d-flex gap-2 mb-2 align-items-start" key={wi}>
                          <div style={{ width: "90px" }}>
                            <select className="form-select form-select-sm mb-1" value={w.icon || "common"} onChange={(e) => handlePartnerWhyItemChange(wi, "icon", e.target.value)}>
                              {iconNames.map((name) => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#10372B", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", margin: "0 auto" }}>
                              <AmenityIcon name={w.icon || "common"} className="icon-16" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <input type="text" className="form-control form-control-sm mb-1" placeholder="Title" value={w.title || ""} onChange={(e) => handlePartnerWhyItemChange(wi, "title", e.target.value)} />
                            <RichTextEditor rows={1} placeholder="Description" value={w.desc || ""} onChange={(html) => handlePartnerWhyItemChange(wi, "desc", html)} />
                          </div>
                          <button type="button" onClick={() => handleRemovePartnerWhyItem(wi)} className="btn btn-sm btn-outline-danger">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddPartnerWhyItem} className="btn btn-sm btn-outline-secondary">+ Add Benefit Card</button>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-4 bg-light rounded-3 border">
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>Enquiry Form Heading</h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-600">Form Title</label>
                          <input type="text" className="form-control form-control-sm" value={partnerForm.form_title || ""} onChange={(e) => handlePartnerFieldChange("form_title", e.target.value)} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-600">Form Subtext</label>
                          <RichTextEditor rows={1} value={partnerForm.form_description || ""} onChange={(html) => handlePartnerFieldChange("form_description", html)} />
                        </div>
                      </div>
                      <p className="small text-muted mt-3 mb-0">
                        Submitted partnership enquiries appear in the <strong>Enquiries</strong> tab, tagged with property "partner-with-us".
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* OTHER (SITE SETTINGS / FOOTER) TAB */}
        {activeTab === "other" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            {!siteSettingsForm ? (
              <p className="text-muted text-center py-4 mb-0">Loading site settings...</p>
            ) : (
              <form onSubmit={handleSaveSiteSettings}>
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Contact & Footer Settings</h3>
                    <p style={{ fontSize: "13.5px", color: "#64748B", margin: "4px 0 0 0" }}>
                      Controls the address, working hours, contact numbers, emails and social media links shown across the site footer.
                    </p>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingSiteSettings} style={{ borderRadius: "8px", fontWeight: "600", padding: "10px 24px" }}>
                    {savingSiteSettings ? "Saving..." : "💾 Save Settings"}
                  </button>
                </div>

                {siteSettingsMsg && <div className="alert alert-info py-2 px-3 small rounded-3 mb-4">{siteSettingsMsg}</div>}

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-4 bg-light rounded-3 border h-100">
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>📍 Address & Hours</h5>
                      <div className="mb-3">
                        <label className="form-label small fw-600">Address</label>
                        <input type="text" className="form-control" value={siteSettingsForm.address || ""} onChange={(e) => handleSiteSettingsFieldChange("address", e.target.value)} required />
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label small fw-600">Working Hours</label>
                          <input type="text" className="form-control" placeholder="e.g. 9:00 AM - 7:00 PM" value={siteSettingsForm.working_hours || ""} onChange={(e) => handleSiteSettingsFieldChange("working_hours", e.target.value)} required />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-600">Working Days</label>
                          <input type="text" className="form-control" placeholder="e.g. All 7 Days" value={siteSettingsForm.working_days || ""} onChange={(e) => handleSiteSettingsFieldChange("working_days", e.target.value)} required />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-4 bg-light rounded-3 border h-100">
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>🔗 Social Media Links</h5>
                      <div className="mb-2">
                        <label className="form-label small fw-600">Instagram URL</label>
                        <input type="text" className="form-control form-control-sm" placeholder="https://www.instagram.com/..." value={siteSettingsForm.instagram_url || ""} onChange={(e) => handleSiteSettingsFieldChange("instagram_url", e.target.value)} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small fw-600">Facebook URL</label>
                        <input type="text" className="form-control form-control-sm" placeholder="https://www.facebook.com/..." value={siteSettingsForm.facebook_url || ""} onChange={(e) => handleSiteSettingsFieldChange("facebook_url", e.target.value)} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small fw-600">LinkedIn URL</label>
                        <input type="text" className="form-control form-control-sm" placeholder="https://www.linkedin.com/..." value={siteSettingsForm.linkedin_url || ""} onChange={(e) => handleSiteSettingsFieldChange("linkedin_url", e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label small fw-600">WhatsApp Number (country code, no + or spaces)</label>
                        <input type="text" className="form-control form-control-sm" placeholder="910000000000" value={siteSettingsForm.whatsapp_number || ""} onChange={(e) => handleSiteSettingsFieldChange("whatsapp_number", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-4 bg-light rounded-3 border h-100">
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>📞 Contact Numbers</h5>
                      {(siteSettingsForm.phone_numbers || []).map((num, i) => (
                        <div className="d-flex gap-2 mb-2" key={i}>
                          <input type="text" className="form-control form-control-sm" placeholder="+91 00000 00000" value={num} onChange={(e) => handlePhoneChange(i, e.target.value)} />
                          <button type="button" onClick={() => handleRemovePhone(i)} className="btn btn-sm btn-outline-danger">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddPhone} className="btn btn-sm btn-outline-secondary">+ Add Number</button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-4 bg-light rounded-3 border h-100">
                      <h5 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>✉️ Email Addresses</h5>
                      {(siteSettingsForm.emails || []).map((email, i) => (
                        <div className="d-flex gap-2 mb-2" key={i}>
                          <input type="email" className="form-control form-control-sm" placeholder="info@example.com" value={email} onChange={(e) => handleEmailChange(i, e.target.value)} />
                          <button type="button" onClick={() => handleRemoveEmail(i)} className="btn btn-sm btn-outline-danger">✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddEmail} className="btn btn-sm btn-outline-secondary">+ Add Email</button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* DESTINATIONS TAB */}
        {activeTab === "destinations" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                  Homepage Destination States ({destinationsList.length})
                </h3>
                <p className="small text-muted mb-0 mt-1">Controls the "Four States, One Standard Of Hospitality" section on the Homepage. Only the first 4 states are shown there.</p>
              </div>
            </div>
            {destinationsList.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No destination states yet. Click "+ Add State" to create one.</p>
            ) : (
              <div className="row g-3">
                {destinationsList.map((dest, i) => (
                  <div className="col-md-6 col-lg-3" key={dest.id}>
                    <div className="p-2 bg-light rounded-3 border h-100 d-flex flex-column">
                      <div style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: "8px", overflow: "hidden", background: "#0F172A" }}>
                        <img
                          src={resolveImageUrl(dest.image_url)}
                          alt={dest.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/slider/hero-bg.jpg"; }}
                        />
                        {i < 4 ? (
                          <span style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(21,128,61,0.85)", color: "#FFF", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px" }}>
                            ✓ SHOWN
                          </span>
                        ) : (
                          <span style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(15,23,42,0.75)", color: "#FFF", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px" }}>
                            HIDDEN
                          </span>
                        )}
                      </div>
                      <strong style={{ fontSize: "14px", color: "#0F172A", marginTop: "8px" }}>{dest.name}</strong>
                      <div className="d-flex gap-2 mt-2">
                        <button onClick={() => handleEditDestination(dest)} className="btn btn-sm btn-outline-secondary" style={{ fontSize: "12px", borderRadius: "6px", flex: 1 }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteDestination(dest.id)} className="btn btn-sm btn-outline-danger" style={{ fontSize: "12px", borderRadius: "6px", flex: 1 }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACCOUNT SETTINGS TAB */}
        {activeTab === "account" && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="bg-white rounded-3 border shadow-sm p-4 h-100">
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>✉️ Change Email</h3>
                <p className="small text-muted mb-3">Current email: <strong>{user?.email}</strong></p>

                {emailMsg.text && (
                  <div className={`alert py-2 px-3 small rounded-3 mb-3 ${emailMsg.type === "success" ? "alert-success" : "alert-danger"}`}>
                    {emailMsg.text}
                  </div>
                )}

                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-600">New Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="new-email@example.com"
                      value={emailForm.newEmail}
                      onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-600">Current Password</label>
                    <PasswordInput
                      className="form-control"
                      placeholder="Enter your current password to confirm"
                      value={emailForm.currentPassword}
                      onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingEmail}>
                    {savingEmail ? "Saving..." : "Update Email"}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-md-6">
              <div className="bg-white rounded-3 border shadow-sm p-4 h-100">
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>🔒 Change Password</h3>
                <p className="small text-muted mb-3">Choose a new password with at least 6 characters.</p>

                {passwordMsg.text && (
                  <div className={`alert py-2 px-3 small rounded-3 mb-3 ${passwordMsg.type === "success" ? "alert-success" : "alert-danger"}`}>
                    {passwordMsg.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-600">Current Password</label>
                    <PasswordInput
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-600">New Password</label>
                    <PasswordInput
                      className="form-control"
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-600">Confirm New Password</label>
                    <PasswordInput
                      className="form-control"
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                    {savingPassword ? "Saving..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === "seo" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>Page SEO Settings</h3>
            <p className="small text-muted mb-4">
              Controls the browser tab title, Google search snippet and social-share preview for each public page.
              Property pages have their own SEO fields inside each property's Add/Edit form.
            </p>

            {pageSeoList.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">Loading SEO settings...</p>
            ) : (
              <>
                <div className="d-flex flex-wrap gap-2 mb-4 pb-3 border-bottom">
                  {pageSeoList.map((row) => (
                    <button
                      key={row.page_key}
                      type="button"
                      onClick={() => setSeoActivePage(row.page_key)}
                      className={`btn btn-sm ${seoActivePage === row.page_key ? "btn-dark" : "btn-outline-secondary"}`}
                      style={{ borderRadius: "999px", fontSize: "12.5px", fontWeight: "600" }}
                    >
                      {row.page_label}
                    </button>
                  ))}
                </div>

                {pageSeoList
                  .filter((row) => row.page_key === seoActivePage)
                  .map((row) => {
                    const draft = pageSeoDrafts[row.page_key] || { metaTitle: "", metaDescription: "", slug: row.page_key };
                    const isLocked = row.page_key === "home";
                    return (
                      <div key={row.page_key} style={{ maxWidth: "640px" }}>
                        {isLocked && (
                          <div className="d-flex align-items-center gap-2 mb-3 p-2 px-3 rounded-3" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: "12.5px", color: "#475569" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Home page SEO is fixed and shown here read-only.
                          </div>
                        )}

                        <div className="mb-3">
                          <label className="form-label small fw-600">URL Slug</label>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">/</span>
                            <input
                              type="text"
                              className="form-control"
                              value={draft.slug === "home" ? "" : (draft.slug || "")}
                              placeholder={row.page_key === "home" ? "(home page)" : row.page_key}
                              onChange={(e) => handleSeoDraftChange(row.page_key, "slug", e.target.value)}
                              disabled={isLocked}
                              readOnly={isLocked}
                            />
                          </div>
                          {!isLocked && (
                            <small className="text-muted">Reference only — used for SEO tracking. Changing it here does not move the live page.</small>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-600">Meta Title</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            maxLength={70}
                            value={draft.metaTitle}
                            onChange={(e) => handleSeoDraftChange(row.page_key, "metaTitle", e.target.value)}
                            disabled={isLocked}
                            readOnly={isLocked}
                          />
                          {!isLocked && <small className="text-muted">{(draft.metaTitle || "").length}/70</small>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-600">Meta Description</label>
                          <div className="small text-muted mb-1">Plain text only — this goes into the page's search-engine meta tag, which can't hold formatting.</div>
                          <textarea
                            className="form-control form-control-sm"
                            rows="3"
                            maxLength={200}
                            value={draft.metaDescription}
                            onChange={(e) => handleSeoDraftChange(row.page_key, "metaDescription", e.target.value)}
                            disabled={isLocked}
                            readOnly={isLocked}
                          />
                          {!isLocked && <small className="text-muted">{(draft.metaDescription || "").length}/200</small>}
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-600">Schema Markup (JSON-LD, optional)</label>
                          <div className="small text-muted mb-1">
                            Advanced: paste valid Schema.org JSON-LD here, e.g. {`{"@context":"https://schema.org","@type":"Organization",...}`}. Leave blank if unsure — it never overwrites the page's automatic SEO data.
                          </div>
                          <textarea
                            className="form-control form-control-sm"
                            rows="4"
                            style={{ fontFamily: "monospace", fontSize: "12px" }}
                            value={draft.schemaMarkup || ""}
                            onChange={(e) => handleSeoDraftChange(row.page_key, "schemaMarkup", e.target.value)}
                            disabled={isLocked}
                            readOnly={isLocked}
                            placeholder='{"@context":"https://schema.org","@type":"Organization","name":"Wanderama"}'
                          />
                        </div>

                        {seoMsg.key === row.page_key && seoMsg.text && (
                          <div className={`small mb-2 ${seoMsg.type === "success" ? "text-success" : "text-danger"}`}>
                            {seoMsg.text}
                          </div>
                        )}

                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => handleSaveSeo(row.page_key)}
                            className="btn btn-sm btn-primary"
                            disabled={savingSeoKey === row.page_key}
                          >
                            {savingSeoKey === row.page_key ? "Saving..." : "Save"}
                          </button>
                        )}
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        )}

        {/* BLOG TAB */}
        {activeTab === "blog" && (
          <div className="bg-white rounded-3 border shadow-sm p-4">
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A", marginBottom: "14px" }}>
              Blog Posts ({blogPosts.length})
            </h3>
            {blogPosts.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">No blog posts yet. Click "+ Add Blog Post" to create one.</p>
            ) : (
              <div className="row g-3">
                {blogPosts.map((post) => (
                  <div className="col-md-6 col-lg-4" key={post.id}>
                    <div className="p-2 bg-light rounded-3 border h-100 d-flex flex-column">
                      <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "8px", overflow: "hidden", background: "#0F172A" }}>
                        <img
                          src={resolveImageUrl(post.featured_image)}
                          alt={post.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/slider/hero-bg.jpg"; }}
                        />
                      </div>
                      <strong style={{ fontSize: "14px", color: "#0F172A", marginTop: "10px" }}>{post.title}</strong>
                      <small className="text-muted d-block mb-2">/blog/{post.slug}</small>
                      {post.excerpt && (
                        <p style={{ fontSize: "12.5px", color: "#334155", flexGrow: 1 }}>{stripHtml(post.excerpt)}</p>
                      )}
                      <div className="d-flex gap-2 mt-2">
                        <button onClick={() => handleEditBlogPost(post)} className="btn btn-sm btn-outline-secondary" style={{ fontSize: "12px", borderRadius: "6px", flex: 1 }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBlogPost(post.id)} className="btn btn-sm btn-outline-danger" style={{ fontSize: "12px", borderRadius: "6px", flex: 1 }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADD / EDIT BLOG POST MODAL */}
      {showBlogModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingBlogId ? "✏️ Edit Blog Post" : "➕ Add New Blog Post"}
              </h4>
              <button onClick={() => setShowBlogModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleBlogSubmit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-600">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Planning Your First Trip to Gir National Park"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-600">URL Slug (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="auto-generated from title"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label small fw-600">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-1"
                    onChange={(e) => handleBlogImageUpload(e.target.files[0])}
                    disabled={uploadingBlogImage}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="or paste image URL"
                    value={blogForm.featuredImage}
                    onChange={(e) => setBlogForm({ ...blogForm, featuredImage: e.target.value })}
                  />
                  {uploadingBlogImage && <small className="text-muted d-block mb-2">Uploading...</small>}
                  <label className="form-label small fw-600">Alt Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Describe this image"
                    value={blogForm.featuredImageAlt || ""}
                    onChange={(e) => setBlogForm({ ...blogForm, featuredImageAlt: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-600">Author</label>
                  <input
                    type="text"
                    className="form-control"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-600">Excerpt (short summary shown on the Blog list)</label>
                  <RichTextEditor
                    rows={2}
                    value={blogForm.excerpt}
                    onChange={(html) => setBlogForm({ ...blogForm, excerpt: html })}
                  />
                </div>

                <div className="col-12 mt-2 pt-3 border-top">
                  <h6 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A", marginBottom: "10px" }}>🔍 SEO (optional — leave blank to auto-generate)</h6>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Meta Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={blogForm.title || "Meta title"}
                    value={blogForm.metaTitle}
                    onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Meta Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Short description shown in Google search results"
                    value={blogForm.metaDescription}
                    onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Schema Markup (JSON-LD, optional)</label>
                  <div className="small text-muted mb-1">
                    Advanced: paste valid Schema.org JSON-LD here. Leave blank if unsure — it never overwrites the blog post's automatic SEO data.
                  </div>
                  <textarea
                    className="form-control"
                    rows="4"
                    style={{ fontFamily: "monospace", fontSize: "12px" }}
                    value={blogForm.schemaMarkup || ""}
                    onChange={(e) => setBlogForm({ ...blogForm, schemaMarkup: e.target.value })}
                    placeholder='{"@context":"https://schema.org","@type":"Article",...}'
                  />
                </div>

                <div className="col-12 mt-2 pt-3 border-top">
                  <h6 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>📌 Sidebar Promo Card (optional)</h6>
                  <p className="text-muted mb-2" style={{ fontSize: "12.5px" }}>
                    Shown as a dark green card on the right side of this article. Leave blank to show the default "Explore Wanderama Resorts" card instead.
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Card Heading</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Planning a Gir Trip?"
                    value={blogForm.ctaTitle}
                    onChange={(e) => setBlogForm({ ...blogForm, ctaTitle: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Card Description</label>
                  <RichTextEditor
                    rows={1}
                    placeholder="e.g. Stay near Sasan Gir and build your safari around a comfortable resort experience."
                    value={blogForm.ctaDescription}
                    onChange={(html) => setBlogForm({ ...blogForm, ctaDescription: html })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Button Text</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Explore Gokul Resort"
                    value={blogForm.ctaButtonText}
                    onChange={(e) => setBlogForm({ ...blogForm, ctaButtonText: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Button Link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="/properties/gokul-resort-sasan-gir"
                    value={blogForm.ctaButtonLink}
                    onChange={(e) => setBlogForm({ ...blogForm, ctaButtonLink: e.target.value })}
                  />
                </div>

                <div className="col-12 mt-2 pt-3 border-top">
                  <h6 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>📑 Table of Contents (optional)</h6>
                  <p className="text-muted mb-2" style={{ fontSize: "12.5px" }}>
                    Shown as a blue "Table of Contents" card in the sidebar. "Heading" must match the exact text of an H2/H3 heading already saved in this post's article body, so clicking the item scrolls to it. "Description" is an optional short line shown under the label on the page.
                  </p>
                  <div className="d-flex flex-column gap-2 mb-2">
                    {(blogForm.tocItems || []).map((item, idx) => (
                      <div className="p-2 bg-light rounded-3 border" key={idx}>
                        <div className="row g-2 align-items-center mb-2">
                          <div className="col-md-5">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Label shown in TOC (e.g. Safari timings)"
                              value={item.label}
                              onChange={(e) => handleBlogTocItemChange(idx, "label", e.target.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Exact heading text in content to jump to"
                              value={item.heading}
                              onChange={(e) => handleBlogTocItemChange(idx, "heading", e.target.value)}
                            />
                          </div>
                          <div className="col-md-1">
                            <button
                              type="button"
                              onClick={() => handleRemoveBlogTocItem(idx)}
                              className="btn btn-outline-danger btn-sm py-0 px-2 w-100"
                              style={{ fontSize: "11px", fontWeight: "600" }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <RichTextEditor
                          rows={1}
                          placeholder="Description shown under the label on the page (optional)"
                          value={item.description || ""}
                          onChange={(html) => handleBlogTocItemChange(idx, "description", html)}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBlogTocItem}
                    className="btn btn-outline-secondary btn-sm"
                    style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
                  >
                    + Add TOC Item
                  </button>
                </div>

                <div className="col-12 mt-2 pt-3 border-top">
                  <h6 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>❓ FAQs (optional)</h6>
                  <p className="text-muted mb-2" style={{ fontSize: "12.5px" }}>
                    Shown as an expandable FAQ accordion above "You May Also Like" on this article's page.
                  </p>
                  <div className="d-flex flex-column gap-2 mb-2">
                    {(blogForm.faqs || []).map((item, idx) => (
                      <div className="p-2 bg-light rounded-3 border" key={idx}>
                        <div className="d-flex gap-2 mb-2">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Question"
                            value={item.question}
                            onChange={(e) => handleBlogFaqChange(idx, "question", e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBlogFaq(idx)}
                            className="btn btn-outline-danger btn-sm py-0 px-2 flex-shrink-0"
                            style={{ fontSize: "11px", fontWeight: "600" }}
                          >
                            🗑️
                          </button>
                        </div>
                        <RichTextEditor
                          rows={2}
                          placeholder="Answer"
                          value={item.answer}
                          onChange={(html) => handleBlogFaqChange(idx, "answer", html)}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddBlogFaq}
                    className="btn btn-outline-secondary btn-sm"
                    style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
                  >
                    + Add FAQ
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" onClick={() => setShowBlogModal(false)} className="btn btn-outline-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingBlog}>
                  {savingBlog ? "Saving..." : editingBlogId ? "Save Changes" : "Add Blog Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT DESTINATION STATE MODAL */}
      {showDestinationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "440px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingDestinationId ? "✏️ Edit Destination State" : "➕ Add Destination State"}
              </h4>
              <button onClick={() => setShowDestinationModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleDestinationSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-600">State Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Gujarat"
                  value={destinationForm.name}
                  onChange={(e) => setDestinationForm({ ...destinationForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-600">Card Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm mb-1"
                  onChange={(e) => handleDestinationImageUpload(e.target.files[0])}
                  disabled={uploadingDestinationImage}
                />
                <input
                  type="text"
                  className="form-control form-control-sm mb-2"
                  placeholder="or paste image URL"
                  value={destinationForm.imageUrl}
                  onChange={(e) => setDestinationForm({ ...destinationForm, imageUrl: e.target.value })}
                />
                {uploadingDestinationImage && <small className="text-muted d-block mb-2">Uploading...</small>}
                <label className="form-label small fw-600">Alt Text</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Describe this image"
                  value={destinationForm.imageAlt || ""}
                  onChange={(e) => setDestinationForm({ ...destinationForm, imageAlt: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" onClick={() => setShowDestinationModal(false)} className="btn btn-outline-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingDestination}>
                  {savingDestination ? "Saving..." : editingDestinationId ? "Save Changes" : "Add State"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TESTIMONIAL MODAL */}
      {showTestimonialModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingTestimonialId ? "✏️ Edit Testimonial" : "➕ Add New Testimonial"}
              </h4>
              <button onClick={() => setShowTestimonialModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleTestimonialSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-600">Guest Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rakesh Patel"
                    value={testimonialForm.authorName}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, authorName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Guest Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ahmedabad, Gujarat"
                    value={testimonialForm.authorLocation}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, authorLocation: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Property Stayed At</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dhinga Masti Resort, Patdi"
                    value={testimonialForm.stayProperty}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, stayProperty: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Rating</label>
                  <select
                    className="form-select"
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Review Text</label>
                  <RichTextEditor
                    rows={4}
                    placeholder="What did the guest say about their stay?"
                    value={testimonialForm.quoteText}
                    onChange={(html) => setTestimonialForm({ ...testimonialForm, quoteText: html })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Guest Photo</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="https://... or /assets/img/testimonial/x.jpg"
                    value={testimonialForm.avatarUrl}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-2"
                    onChange={(e) => handleTestimonialAvatarUpload(e.target.files[0])}
                    disabled={uploadingTestimonialAvatar}
                  />
                  {uploadingTestimonialAvatar && <small className="text-muted d-block mb-2">Uploading...</small>}
                  <label className="form-label small fw-600">Alt Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Photo of the guest"
                    value={testimonialForm.avatarAlt || ""}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarAlt: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingTestimonial}>
                  {savingTestimonial ? "Saving..." : editingTestimonialId ? "Save Changes" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TEAM MEMBER MODAL */}
      {showTeamModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "560px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingTeamId ? "✏️ Edit Team Member" : "➕ Add Team Member"}
              </h4>
              <button onClick={() => setShowTeamModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleTeamSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-600">Category</label>
                  <select
                    className="form-select"
                    value={teamForm.category}
                    onChange={(e) => setTeamForm({ ...teamForm, category: e.target.value })}
                  >
                    <option value="founder">Founder (shown with full bio)</option>
                    <option value="cofounder">Co-Founder (shown with full bio)</option>
                    <option value="team">Team Member (shown in team grid)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Priya Joshi"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Role / Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Co-Founder & Guest Experience Head"
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Bio (optional, shown for Founder/Co-Founder)</label>
                  <RichTextEditor
                    rows={3}
                    placeholder="A short introduction shown next to their photo"
                    value={teamForm.bio}
                    onChange={(html) => setTeamForm({ ...teamForm, bio: html })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Photo</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="https://... or /assets/img/people/x.jpg"
                    value={teamForm.photo_url}
                    onChange={(e) => setTeamForm({ ...teamForm, photo_url: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-2"
                    onChange={(e) => handleTeamPhotoUpload(e.target.files[0])}
                    disabled={uploadingTeamPhoto}
                  />
                  {uploadingTeamPhoto && <small className="text-muted d-block mb-2">Uploading...</small>}
                  <label className="form-label small fw-600">Alt Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Photo of team member"
                    value={teamForm.photo_alt || ""}
                    onChange={(e) => setTeamForm({ ...teamForm, photo_alt: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600 d-block mb-1">Social Links (optional)</label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Facebook URL"
                    value={teamForm.facebook_url}
                    onChange={(e) => setTeamForm({ ...teamForm, facebook_url: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Instagram URL"
                    value={teamForm.instagram_url}
                    onChange={(e) => setTeamForm({ ...teamForm, instagram_url: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="LinkedIn URL"
                    value={teamForm.linkedin_url}
                    onChange={(e) => setTeamForm({ ...teamForm, linkedin_url: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Twitter / X URL"
                    value={teamForm.twitter_url}
                    onChange={(e) => setTeamForm({ ...teamForm, twitter_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingTeam}>
                  {savingTeam ? "Saving..." : editingTeamId ? "Save Changes" : "Add Team Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT EVENT TYPE MODAL */}
      {showEventTypeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "580px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingEventTypeId ? "✏️ Edit Event Type" : "➕ Add Event Type"}
              </h4>
              <button onClick={() => setShowEventTypeModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleEventTypeSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-600">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Wedding"
                    value={eventTypeForm.title}
                    onChange={(e) => setEventTypeForm({ ...eventTypeForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Subtitle</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Weddings crafted around you"
                    value={eventTypeForm.subtitle}
                    onChange={(e) => setEventTypeForm({ ...eventTypeForm, subtitle: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Description</label>
                  <RichTextEditor
                    rows={6}
                    value={eventTypeForm.description}
                    onChange={(html) => setEventTypeForm({ ...eventTypeForm, description: html })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Image</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="https://... or /assets/img/testimonial/x.jpg"
                    value={eventTypeForm.image_url}
                    onChange={(e) => setEventTypeForm({ ...eventTypeForm, image_url: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-2"
                    onChange={(e) => handleEventTypeImageUpload(e.target.files[0])}
                    disabled={uploadingEventTypeImage}
                  />
                  {uploadingEventTypeImage && <small className="text-muted d-block mb-2">Uploading...</small>}
                  <label className="form-label small fw-600">Alt Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Describe this image"
                    value={eventTypeForm.image_alt || ""}
                    onChange={(e) => setEventTypeForm({ ...eventTypeForm, image_alt: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowEventTypeModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingEventType}>
                  {savingEventType ? "Saving..." : editingEventTypeId ? "Save Changes" : "Add Event Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PLAN OPTION MODAL */}
      {showPlanOptionModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "580px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingPlanOptionId ? "✏️ Edit Plan Option" : "➕ Add Plan Option"}
              </h4>
              <button onClick={() => setShowPlanOptionModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handlePlanOptionSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-600">Eyebrow Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. FOR COUPLES"
                    value={planOptionForm.eyebrow}
                    onChange={(e) => setPlanOptionForm({ ...planOptionForm, eyebrow: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Wedding Getaway"
                    value={planOptionForm.title}
                    onChange={(e) => setPlanOptionForm({ ...planOptionForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-600">Description</label>
                  <RichTextEditor
                    rows={2}
                    placeholder="A short one or two line summary of this option."
                    value={planOptionForm.description}
                    onChange={(html) => setPlanOptionForm({ ...planOptionForm, description: html })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-600 mb-2">Bullet Points</label>
                  <div className="d-flex flex-column gap-2 mb-2">
                    {(planOptionForm.bullets || []).map((bullet, idx) => (
                      <div className="d-flex gap-2" key={idx}>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={bullet}
                          onChange={(e) => handlePlanOptionBulletChange(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePlanOptionBullet(idx)}
                          className="btn btn-outline-danger btn-sm py-0 px-2 flex-shrink-0"
                          style={{ fontSize: "11px", fontWeight: "600" }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPlanOptionBullet}
                    className="btn btn-outline-secondary btn-sm"
                    style={{ borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}
                  >
                    + Add Bullet
                  </button>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-600">Button Text</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Enquire"
                    value={planOptionForm.button_text}
                    onChange={(e) => setPlanOptionForm({ ...planOptionForm, button_text: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-600">Button Link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="/contact"
                    value={planOptionForm.button_link}
                    onChange={(e) => setPlanOptionForm({ ...planOptionForm, button_link: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="planOptionFeatured"
                      checked={planOptionForm.featured}
                      onChange={(e) => setPlanOptionForm({ ...planOptionForm, featured: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="planOptionFeatured">
                      ⭐ Featured (highlighted with a gold border and solid button)
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowPlanOptionModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingPlanOption}>
                  {savingPlanOption ? "Saving..." : editingPlanOptionId ? "Save Changes" : "Add Plan Option"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT WEDDING FAQ MODAL */}
      {showWeddingFaqModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingWeddingFaqId ? "✏️ Edit FAQ" : "➕ Add FAQ"}
              </h4>
              <button onClick={() => setShowWeddingFaqModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleWeddingFaqSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-600">Question</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. How far in advance should we book an event?"
                  value={weddingFaqForm.question}
                  onChange={(e) => setWeddingFaqForm({ ...weddingFaqForm, question: e.target.value })}
                  required
                />
              </div>
              <div className="mb-0">
                <label className="form-label small fw-600">Answer</label>
                <RichTextEditor
                  rows={4}
                  placeholder="Write the answer shown when this question is expanded."
                  value={weddingFaqForm.answer}
                  onChange={(html) => setWeddingFaqForm({ ...weddingFaqForm, answer: html })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowWeddingFaqModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingWeddingFaq}>
                  {savingWeddingFaq ? "Saving..." : editingWeddingFaqId ? "Save Changes" : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT AMENITY MODAL */}
      {showAmenityModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "480px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingAmenityId ? "✏️ Edit Amenity" : "➕ Add New Amenity"}
              </h4>
              <button onClick={() => setShowAmenityModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleAmenitySubmit}>
              <div className="mb-3">
                <label className="form-label small fw-600">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Swimming Pool"
                  value={amenityForm.title}
                  onChange={(e) => setAmenityForm({ ...amenityForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-600">Description</label>
                <RichTextEditor
                  rows={3}
                  placeholder="Short description shown on the Amenities page"
                  value={amenityForm.description}
                  onChange={(html) => setAmenityForm({ ...amenityForm, description: html })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-600">Icon</label>
                <select
                  className="form-select"
                  value={amenityForm.icon}
                  onChange={(e) => setAmenityForm({ ...amenityForm, icon: e.target.value })}
                >
                  {iconNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 d-flex align-items-center gap-2">
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#EBF3FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#0564F2" }}>
                    <AmenityIcon name={amenityForm.icon} className="icon-18" />
                  </div>
                  <small className="text-muted">Icon preview</small>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowAmenityModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingAmenity}>
                  {savingAmenity ? "Saving..." : editingAmenityId ? "Save Changes" : "Add Amenity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT GALLERY ITEM MODAL */}
      {showGalleryModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "520px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
                {editingGalleryId ? "✏️ Edit Gallery Item" : "➕ Add Photo / Video"}
              </h4>
              <button onClick={() => setShowGalleryModal(false)} className="btn-close"></button>
            </div>

            <form onSubmit={handleGallerySubmit}>
              <div className="mb-3">
                <label className="form-label small fw-600">Section</label>
                <select
                  className="form-select"
                  value={galleryForm.category}
                  onChange={(e) => handleGalleryCategoryChange(e.target.value)}
                >
                  {galleryCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {galleryForm.type === "video" && (
                <div className="mb-3">
                  <label className="form-label small fw-600">Video Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Property Walkthrough"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  />
                </div>
              )}

              {galleryForm.type === "video" && (
                <div className="mb-3">
                  <label className="form-label small fw-600">Video Caption</label>
                  <RichTextEditor
                    rows={2}
                    placeholder="Short caption shown under the video"
                    value={galleryForm.caption}
                    onChange={(html) => setGalleryForm({ ...galleryForm, caption: html })}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-600">
                  {galleryForm.type === "video" ? "Video File / URL" : "Image File / URL"}
                </label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder={galleryForm.type === "video" ? "https://... or /assets/img/video/x.mp4" : "https://... or /assets/img/x.jpg"}
                  value={galleryForm.url}
                  onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                  required
                />
                <input
                  type="file"
                  accept={galleryForm.type === "video" ? "video/*" : "image/*"}
                  className="form-control form-control-sm"
                  onChange={(e) => handleGalleryFileUpload("url", e.target.files[0])}
                  disabled={uploadingGalleryField === "url"}
                />
                {uploadingGalleryField === "url" && <small className="text-muted">Uploading...</small>}
              </div>

              {galleryForm.type === "video" && (
                <div className="mb-3">
                  <label className="form-label small fw-600">Poster / Thumbnail Image</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="https://... or /assets/img/banner/x.jpg"
                    value={galleryForm.posterUrl}
                    onChange={(e) => setGalleryForm({ ...galleryForm, posterUrl: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm"
                    onChange={(e) => handleGalleryFileUpload("posterUrl", e.target.files[0])}
                    disabled={uploadingGalleryField === "posterUrl"}
                  />
                  {uploadingGalleryField === "posterUrl" && <small className="text-muted">Uploading...</small>}
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={savingGalleryItem}>
                  {savingGalleryItem ? "Saving..." : editingGalleryId ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {selectedVideoPreview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
          }}
          onClick={() => setSelectedVideoPreview(null)}
        >
          <div
            style={{
              background: "#0F172A",
              borderRadius: "16px",
              padding: "20px",
              maxWidth: "700px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              color: "#FFFFFF",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="m-0 text-white fw-700">🎥 {selectedVideoPreview.name} Tour Video</h5>
              <button onClick={() => setSelectedVideoPreview(null)} className="btn-close btn-close-white"></button>
            </div>
            <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "16/9", background: "#000" }}>
              {selectedVideoPreview.url.includes("youtube") || selectedVideoPreview.url.includes("vimeo") ? (
                <iframe
                  src={selectedVideoPreview.url}
                  title="Property Video"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={resolveImageUrl(selectedVideoPreview.url)} controls autoPlay style={{ width: "100%", height: "100%", objectFit: "contain" }}></video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
