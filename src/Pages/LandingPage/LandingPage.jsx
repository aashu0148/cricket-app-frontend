import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Instagram,
  Linkedin,
  Star,
  Twitter,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "@/Components/Navbar/Navbar";
import Shapes from "./Shapes";
import Card from "./Card/Card";
import Button from "@/Components/Button/Button";

import {
  features,
  testimonials,
  FAQs,
  generalCopy,
  scoringSystemLink,
} from "./landingCopy.jsx";
import image from "@/assets/images/batsman.png";
import aboutImage from "@/assets/images/about-us.png";
import LineAnimate from "@/Components/LineAnimate/LineAnimate";
import { quoteIcon } from "@/utils/svgs";
import { handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";

import styles from "./LandingPage.module.scss";

function Hero() {
  const navigate = useNavigate();
  const isMobileView = useSelector((s) => s.root.isMobileView);

  return (
    <div className={styles.heroSection}>
      <Shapes
        hideRing
        shapeStyles={{
          circle: {
            top: isMobileView ? "10%" : "20%",
            right: "100px",
          },
          half: {
            top: isMobileView ? "-20px" : "10%",
            left: "5px",
          },
          triangle: {
            top: "3%",
            right: isMobileView ? "30px" : "300px",
          },
          plus: {
            top: "10px",
            left: "40%",
          },
        }}
      />
      <div className={styles.heroSection__left}>
        <h1>
          The ultimate cricket fantasy experience for{" "}
          <span className="gradient-text">serious fans</span>
        </h1>
        <p>A draft-based fantasy cricket app with superior scoring system</p>
        <div className={styles.heroSection__buttonContainer}>
          <Button
            className={styles.heroSection__button}
            onClick={(e) =>
              handleAppNavigation(e, navigate, applicationRoutes.auth)
            }
          >
            Get Started
          </Button>

          <Button
            outlineButton
            onClick={() => window.open(scoringSystemLink, "_blank")}
          >
            Scoring System
          </Button>
        </div>
      </div>
      <div className={styles.heroSection__right}>
        <img src={image} />
      </div>
    </div>
  );
}

function About() {
  const isMobileView = useSelector((s) => s.root.isMobileView);

  return (
    <div className={styles.aboutSection}>
      <div className={styles.generalHeading}>
        <div className={styles.generalHeadingContent}>
          <div className="flex-col-xxs align-center">
            <h1>About </h1>
            <LineAnimate className="mb-3" />
          </div>

          {/* <p>{generalCopy.about.shoulder}</p> */}
        </div>
      </div>
      <div className={styles.aboutSection_below}>
        <div className={styles.aboutSection_left}>
          <div className={`flex-col-xxs ${isMobileView && "align-center"}`}>
            <h2>{generalCopy.about.heading}</h2>
            <LineAnimate className="mb-3" />
          </div>

          <p>{generalCopy.about.description}</p>
        </div>
        <div className={styles.aboutSection_right}>
          <img src={aboutImage} />
        </div>
      </div>
    </div>
  );
}

function Features() {
  const isMobileView = useSelector((s) => s.root.isMobileView);

  return (
    <div className={styles.featuresSection}>
      <Shapes
        hideHalf
        hideCircle
        shapeStyles={{
          triangle: {
            top: "3%",
            right: isMobileView ? "20px" : "300px",
          },
          ring: {
            top: isMobileView ? "-10px" : "-2%",
            left: isMobileView ? "5px" : "5%",
          },
          plus: {
            top: isMobileView ? "-10px" : "10%",
            right: isMobileView ? "5px" : "5%",
          },
        }}
      />
      <div className={styles.generalHeading}>
        <div className={styles.generalHeadingContent}>
          <div className="flex-col-xxs align-center">
            <h1>Unique Features</h1>
            <LineAnimate className="mb-3" />
          </div>
          {/* <p>{generalCopy.features.shoulder}</p> */}
        </div>
      </div>
      <div className={styles.featuresSection_Cards}>
        {features?.map((item, index) => (
          <Card
            key={index}
            horizontal
            icon={item.icon}
            mainText={item.mainText}
            subText={item.subText}
          />
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  const isMobileView = useSelector((s) => s.root.isMobileView);

  const [activeIndexTestimonial, setActiveIndexTestimonial] = useState(0);

  const handlePrev = () => {
    if (!testimonials) return;
    if (activeIndexTestimonial === 0) {
      setActiveIndexTestimonial(testimonials.length - 1);
      return;
    }
    setActiveIndexTestimonial((prev) => prev - 1);
  };
  const handleNext = () => {
    if (!testimonials) return;
    if (activeIndexTestimonial === testimonials.length - 1) {
      setActiveIndexTestimonial(0);
      return;
    }
    setActiveIndexTestimonial((prev) => prev + 1);
  };

  return (
    <div className={styles.testimonialSection}>
      <div className={styles.generalHeading}>
        <div className={styles.generalHeadingContent}>
          <div className="flex-col-xxs align-center">
            <h1>Testimonials</h1>
            <LineAnimate className="mb-3" />
          </div>
          <p>{generalCopy.testimonials.shoulder}</p>
        </div>
      </div>
      <div className={styles.testimonial_carousel}>
        <span onClick={() => handlePrev()}>
          <ChevronLeft size={"35px"} />
        </span>

        <div className={styles.testimonial_carousel_between}>
          <div className={styles.quote}>{quoteIcon}</div>
          <div className={styles.testimonial_stars}>
            {Array.from({
              length: testimonials[activeIndexTestimonial].stars,
            })
              .fill("")
              .map((_, index) => (
                <Star key={index} />
              ))}
          </div>
          <p>{testimonials[activeIndexTestimonial].review}</p>
          <h2>{testimonials[activeIndexTestimonial].name}</h2>
        </div>

        <span onClick={() => handleNext()}>
          <ChevronRight size={"35px"} />
        </span>
      </div>
    </div>
  );
}

function FaQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className={styles.faqSection}>
      <div className={styles.generalHeading}>
        <div className={styles.generalHeadingContent}>
          <div className="flex-col-xxs align-center">
            <h1>Frequently Asked Questions</h1>
            <LineAnimate className="mb-3" />
          </div>
          <p>{generalCopy.faq.shoulder}</p>
        </div>
      </div>
      <div className={styles.faqSection_Below}>
        <div className={styles.faqSection_accordion}>
          {FAQs?.map((item, index) => (
            <React.Fragment key={index}>
              <div className={styles.faqSection_question}>
                <p className={styles.text}>{item.question}</p>

                <span
                  className={styles.icon}
                  onClick={() => handleAccordion(index)}
                >
                  {openIndex === index ? (
                    <ChevronUp size={"35px"} color="white" />
                  ) : (
                    <ChevronDown size={"35px"} color="white" />
                  )}
                </span>
              </div>
              {openIndex === index && (
                <p className={styles.faqSection_answer}>
                  {item.jsx || item.answer}
                </p>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactUs() {
  const socialMedia = [
    {
      icon: <Linkedin />,
      link: "",
      label: "Linkedin",
    },
    {
      icon: <Twitter />,
      link: "",
      label: "Twitter",
    },
    {
      icon: <Instagram />,
      link: "",
      label: "Instagram",
    },
  ];

  return (
    <div className={styles.contactUsSection}>
      <div className={styles.generalHeading}>
        <div className={styles.generalHeadingContent}>
          <div className="flex-col-xxs align-center">
            <h1>Contact Us</h1>
            <LineAnimate />
          </div>
          <p>{generalCopy.contact.shoulder}</p>
        </div>
      </div>
      <div className={styles.contactUsSection_details}>
        <div className={styles.iconsContainer}>
          {socialMedia.map((item) => (
            <a
              key={item.link || item.label}
              href={item.link}
              target="_blank"
              title={item.label}
              className={styles.contactUsSection_iconWrapper}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className={`page-container ${styles.container}`}>
      <Navbar className={styles.navbar} />

      <Hero />

      {/* <div className={styles.cardSection}>
        {details.map((item, index) => (
          <Card
            key={index}
            style={{ maxWidth: "300px" }}
            icon={item.icon}
            mainText={item.mainText}
            subText={item.subText}
          />
        ))}
      </div> */}

      <Features />

      <About />

      {/* <Testimonials /> */}

      <FaQ />

      <ContactUs />
    </div>
  );
}

export default LandingPage;
