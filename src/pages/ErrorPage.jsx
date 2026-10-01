import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function ErrorPage() {
  return (
    <>
      <SEO title="Page Not Found" noindex />
      {/* Page Banner */}
      <div className="page-banner overlay">
        <picture className="media media-bg">
          <img
            src="/assets/img/banner/page-banner.jpg"
            width="1920"
            height="620"
            loading="eager"
            alt="Page Banner Image"
          />
        </picture>
        <div className="page-banner-content">
          <div className="container text-center">
            <h1 className="heading text-60 fw-700" data-aos="fade-up">
              Error Page
            </h1>
            <ul
              className="breadcrumb list-unstyled"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <li>
                <Link
                  to="/"
                  className="text text-18 no-underline"
                  aria-label="Home Page"
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="svg-wrapper icon-12">
                  <svg
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.08929 5.40903C7.24552 5.5653 7.33328 5.77723 7.33328 5.9982C7.33328 6.21917 7.24552 6.43109 7.08929 6.58736L2.37512 11.3015C2.29825 11.3811 2.2063 11.4446 2.10463 11.4883C2.00296 11.532 1.89361 11.5549 1.78296 11.5559C1.67231 11.5569 1.56258 11.5358 1.46016 11.4939C1.35775 11.452 1.2647 11.3901 1.18646 11.3119C1.10822 11.2336 1.04634 11.1406 1.00444 11.0382C0.962537 10.9357 0.941453 10.826 0.942414 10.7154C0.943376 10.6047 0.966364 10.4954 1.01004 10.3937C1.05371 10.292 1.1172 10.2001 1.19679 10.1232L5.32179 5.9982L1.19679 1.8732C1.04499 1.71603 0.960996 1.50553 0.962894 1.28703C0.964793 1.06853 1.05243 0.859522 1.20694 0.705015C1.36145 0.550508 1.57046 0.462868 1.78896 0.460969C2.00745 0.45907 2.21795 0.543066 2.37512 0.694864L7.08929 5.40903Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </li>
              <li>
                <a role="link" aria-disabled="true" className="text text-18 no-underline active">
                  Error
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Page */}
      <div className="error-page mt-100">
        <div className="container">
          <div className="error-inner">
            <div className="image" data-aos="fade-up">
              <img
                src="/assets/img/error/1.png"
                width="710"
                height="376"
                loading="lazy" decoding="async"
                alt="Error image"
              />
            </div>
            <h2 className="heading text-50" data-aos="fade-up">
              Oops! That Page Can't be Found
            </h2>
            <div className="text text-14" data-aos="fade-up">
              Sorry, we couldn't find the page you're looking for.
            </div>
            <Link to="/" className="button button--primary svg-wrapper" data-aos="fade-up">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.295 4.28432C10.3885 4.19207 10.4993 4.11913 10.6209 4.06968C10.7426 4.02023 10.8729 3.99523 11.0042 3.99612C11.1356 3.997 11.2655 4.02374 11.3865 4.07482C11.5075 4.1259 11.6172 4.20032 11.7095 4.29382C11.8018 4.38732 11.8747 4.49808 11.9241 4.61976C11.9736 4.74145 11.9986 4.87169 11.9977 5.00304C11.9968 5.13438 11.9701 5.26427 11.919 5.38529C11.8679 5.5063 11.7935 5.61607 11.7 5.70832L6.33 11.0003H20C20.2652 11.0003 20.5196 11.1057 20.7071 11.2932C20.8946 11.4807 21 11.7351 21 12.0003C21 12.2655 20.8946 12.5199 20.7071 12.7074C20.5196 12.895 20.2652 13.0003 20 13.0003H6.335L11.7 18.2853C11.8794 18.4733 11.9786 18.7238 11.9765 18.9837C11.9744 19.2435 11.8712 19.4924 11.6888 19.6775C11.5065 19.8626 11.2592 19.9694 10.9994 19.9754C10.7396 19.9813 10.4877 19.8859 10.297 19.7093L3.372 12.8873C3.25408 12.771 3.16045 12.6325 3.09654 12.4797C3.03263 12.3269 2.99972 12.1629 2.99972 11.9973C2.99972 11.8317 3.03263 11.6677 3.09654 11.515C3.16045 11.3622 3.25408 11.2236 3.372 11.1073L10.295 4.28432Z"
                  fill="currentColor"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
