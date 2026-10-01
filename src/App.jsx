import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
const About = lazy(() => import("./pages/About"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const Amenities = lazy(() => import("./pages/Amenities"));
const Gallery = lazy(() => import("./pages/Gallery"));
const WeddingEvents = lazy(() => import("./pages/WeddingEvents"));
const PartnerWithUs = lazy(() => import("./pages/PartnerWithUs"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsCondition = lazy(() => import("./pages/TermsCondition"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const CustomPage = lazy(() => import("./pages/CustomPage"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPropertyForm = lazy(() => import("./pages/admin/AdminPropertyForm"));
const AdminPagesManager = lazy(() => import("./pages/admin/AdminPagesManager"));

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="page-loader" role="status" aria-label="Loading"><span className="page-loader-spinner" /></div>}>
      <Routes>
        {/* Admin Portal Routes (Without Public MainLayout Header/Footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/properties" element={<AdminDashboard />} />
        <Route path="/admin/properties/new" element={<AdminPropertyForm />} />
        <Route path="/admin/properties/:id/edit" element={<AdminPropertyForm />} />
        <Route path="/admin/pages" element={<AdminPagesManager />} />
        <Route path="/admin/:tab" element={<AdminDashboard />} />

        {/* Public Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetails />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/weddings-events" element={<WeddingEvents />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-condition" element={<TermsCondition />} />
          <Route path="/404" element={<ErrorPage />} />
          {/* Admin-created custom pages (Admin Panel → Pages). Always loses to
              any explicit route above (e.g. /about) since React Router ranks
              static path segments above dynamic ones, regardless of order. */}
          <Route path="/:slug" element={<CustomPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
      </Suspense>
    </AuthProvider>
  );
}
