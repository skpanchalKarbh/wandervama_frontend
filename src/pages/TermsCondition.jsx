import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import usePageSeo from "../hooks/usePageSeo";

export default function TermsCondition() {
  const seo = usePageSeo("terms-condition", {
    title: "Terms & Conditions",
    description: "Read the terms and conditions for booking a stay at Wanderama Hospitality LLP's hotels, resorts and villas.",
  });

  return (
    <>
      <SEO title={seo.title} description={seo.description} customSchema={seo.schema} />
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
              Terms of Services
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
                <a
                  role="link"
                  aria-disabled="true"
                  className="text text-18 no-underline active"
                >
                  Terms of Services
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Terms of Services */}
      <div className="privacy-page mt-100">
        <div className="container container-narrow">
          <div className="section-headings" data-aos="fade-up">
            <h2 className="heading text-50 text-center">Our Terms of Services</h2>
          </div>
          <div className="description section-content">
            <p data-aos="fade-up">
              This website is operated by Hawaa. Throughout the site, the terms
              "we", "us" and "our" refer to Hawaa. Hawaa offers this website,
              including all information, tools and services available from
              this site to you, the user, conditioned upon your acceptance of
              all terms, conditions, policies and notices stated here.
            </p>

            <p data-aos="fade-up">
              Please read these Terms of Service carefully before accessing or
              using our website. By accessing or using any part of the site,
              you agree to be bound by these Terms of Service. If you do not
              agree to all the terms and conditions of this agreement, then
              you may not access the website or use any services. If these
              Terms of Service are considered an offer, acceptance is
              expressly limited to these Terms of Service.
            </p>

            <h3 data-aos="fade-up">What is Lorem Ipsum?</h3>
            <p data-aos="fade-up">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy
              text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book.
              It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>

            <h3 data-aos="fade-up">Why do we use it?</h3>
            <p data-aos="fade-up">
              It is a long established fact that a reader will be distracted
              by the readable content of a page when looking at its layout.
              The point of using Lorem Ipsum is that it has a more-or-less
              normal distribution of letters, as opposed to using 'Content
              here, content here', making it look like readable English. Many
              desktop publishing packages and web page editors now use Lorem
              Ipsum as their default model text, and a search for 'lorem
              ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
            </p>

            <h3 data-aos="fade-up">Where does it come from?</h3>
            <p data-aos="fade-up">
              Contrary to popular belief, Lorem Ipsum is not simply random
              text. It has roots in a piece of classical Latin literature
              from 45 BC, making it over 2000 years old. Richard McClintock, a
              Latin professor at Hampden-Sydney College in Virginia, looked up
              one of the more obscure Latin words, consectetur, from a Lorem
              Ipsum passage, and going through the cites of the word in
              classical literature, discovered the undoubtable source. Lorem
              Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
              Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
              written in 45 BC. This book is a treatise on the theory of
              ethics, very popular during the Renaissance. The first line of
              Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line
              in section 1.10.32.
            </p>

            <p data-aos="fade-up">
              The standard chunk of Lorem Ipsum used since the 1500s is
              reproduced below for those interested. Sections 1.10.32 and
              1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also
              reproduced in their exact original form, accompanied by English
              versions from the 1914 translation by H. Rackham.
            </p>

            <p data-aos="fade-up">
              Use both direct conversations and indirect observations to get
              visibility into employees challenges and concerns. Use every
              opportunity to make clear to employees that you support and
              care them. To facilitate regular conversations between managers
              and employees, provide.
            </p>

            <p data-aos="fade-up">
              The third Monday of January is supposed to be the most
              depressing day of the year. Whether you believe that or not,
              the long nights, cold weather, and trying to keep to new year
              resolutions are all probably getting to you a little by now. To
              make matters worse many will still be recovering from their
              Christmas spending. So how can you make today
            </p>

            <p data-aos="fade-up">
              Vast numbers of employees now work remotely, and it's too late
              to develop a set of remote-work policies if you didn't already
              have one. But there are ways to make the remote-work experience
              productive and engaging for employees
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="subscribe-2 mt-100">
        <div className="container">
          <div className="subscribe-wrap radius20" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-lg-6 col-12">
                <div className="image">
                  <img src="/assets/img/subscribe/1.jpg" width="992" height="885" loading="lazy" decoding="async" alt="Subscribe Image" />
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="content">
                  <div className="subheading text-18" data-aos="fade-up" data-aos-delay="50">
                    Join Our Newsletter
                  </div>
                  <h2 className="heading text-30" data-aos="fade-up" data-aos-delay="100">
                    Unlock exclusive deals — prices drop as soon as you subscribe!
                  </h2>
                  <form action="#" className="form subscribe-form" data-aos="fade-up" data-aos-delay="150">
                    <div className="field">
                      <label htmlFor="SubscribeForm-email" className="visually-hidden">
                        Your E-mail
                      </label>
                      <div className="input-wrap">
                        <input
                          id="SubscribeForm-email"
                          className="text text-16"
                          type="text"
                          placeholder="Your email"
                          name="email"
                          required
                        />
                        <div className="form-button">
                          <button type="submit" className="button button--primary" aria-label="Subscribe">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="text text-16" data-aos="fade-up" data-aos-delay="200">
                    Your email is safe with us — no spam, just useful travel insights.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
