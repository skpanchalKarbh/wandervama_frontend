import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import useSectionScrollSnap from "../hooks/useSectionScrollSnap";

export default function MainLayout() {
  const location = useLocation();

  useSectionScrollSnap(location.pathname);

  useEffect(() => {
    // scroll to top on every route change, like a fresh page load
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // main.js runs AOS.init() before React mounts any [data-aos] elements,
    // so re-init/refresh once content exists and again whenever the route changes.
    if (window.AOS) {
      window.AOS.init({ duration: 1500, once: true });
      window.AOS.refreshHard();
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="page-loader" role="status" aria-label="Loading"><span className="page-loader-spinner" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
      <drawer-opener id="drawer-overlay"></drawer-opener>
      <scroll-top>
        <div className="scroll-to-top">
          <div className="svg-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none" />
              <path
                d="M152,96l80,40v32l-80-16v32l16,16v32l-40-16L88,232V200l16-16V152L24,168V136l80-40V48a24,24,0,0,1,48,0Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
          </div>
        </div>
      </scroll-top>
    </>
  );
}
