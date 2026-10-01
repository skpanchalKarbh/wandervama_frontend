import { useState, useEffect } from "react";
import PageBanner from "../components/PageBanner";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";
import { API_BASE_URL } from "../config/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const seo = usePageSeo("blog", {
    title: "Blog",
    description: "Travel guides, destination highlights and hospitality stories from the Wanderama team — tips for planning your next stay across Gujarat, Maharashtra, Rajasthan and Madhya Pradesh.",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />
      <PageBanner title="Blog" current="Blog" />

      <div className="blog blog-list home-band-cream home-band-after-banner">
        <div className="container">
          <div className="section-headings headings-width text-center">
            <h2 className="heading text-50" data-aos="fade-up">Travel Guides & Hospitality Stories</h2>
            <div className="text text-18" data-aos="fade-up" data-aos-delay="50">
              Tips and inspiration for planning your next Wanderama stay
            </div>
          </div>

          <div className="section-content mt-40">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5">
                <p className="text text-18">No blog posts yet.</p>
              </div>
            ) : (
              <div className="row grid-gap">
                {posts.map((post, i) => (
                  <div className="col-lg-4 col-md-6 col-12" key={post.id} data-aos="fade-up" data-aos-delay={i * 50}>
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
