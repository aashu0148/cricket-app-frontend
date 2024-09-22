import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Facebook,
  Instagram,
  Linkedin,
  Star,
  Twitter,
} from "react-feather";
import { useNavigate } from "react-router-dom";

import Navbar from "@/Components/Navbar/Navbar";
import Shapes from "./Shapes";
import Card from "./Card/Card";
import Button from "@/Components/Button/Button";

import {
  features,
  details,
  testimonials,
  FAQs,
  generalCopy,
} from "./landingCopy";
import image from "@/assets/images/batsman.png";
import aboutImage from "@/assets/images/about-us.png";
import LineAnimate from "@/Components/LineAnimate/LineAnimate";
import { quoteIcon } from "@/utils/svgs";
import { handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";

import styles from "./LandingPage.module.scss";
import { useSelector } from "react-redux";

function Hero() {
  const navigate = useNavigate();
  const isMobileView = useSelector((s) => s.root.isMobileView);

  return (
    <div className={styles.heroSection}>
      <Shapes
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
          Create Your <span className="gradient-text">Dream Team</span> and
          Dominate Fantasy Cricket!
        </h1>
        <p>
          Join the ultimate fantasy cricket experience with real-time scoring,
          custom draft leagues, and in-depth player stats. Build your team,
          compete with friends, and climb the leaderboard. Your strategy, your
          game—make every match count!
        </p>
        <div className={styles.heroSection__buttonContainer}>
          <Button
            className={styles.heroSection__button}
            onClick={(e) =>
              handleAppNavigation(e, navigate, applicationRoutes.auth)
            }
          >
            Get Started
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

          <p>{generalCopy.about.shoulder}</p>
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
        hidePlus
        hideCircle
        shapeStyles={{
          half: {
            top: isMobileView ? "5%" : "4%",
            left: isMobileView ? "3%" : "15%",
          },
          triangle: {
            top: "5%",
            right: isMobileView ? "50px" : "300px",
          },
        }}
      />
      <div className={styles.generalHeading}>
        <div className={styles.generalHeadingContent}>
          <div className="flex-col-xxs align-center">
            <h1>Awesome Features</h1>
            <LineAnimate className="mb-3" />
          </div>
          <p>{generalCopy.features.shoulder}</p>
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
      <Shapes
        hideHalf
        hideCircle
        shapeStyles={{
          triangle: {
            top: "3%",
            right: isMobileView ? "20px" : "300px",
          },
          plus: {
            top: isMobileView ? "-10px" : "10%",
            left: isMobileView ? "5px" : "5%",
          },
        }}
      />
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
                <p className={styles.faqSection_answer}>{item.answer}</p>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactUs() {
  const contactUsIcons = [
    <Facebook />,
    <Linkedin />,
    <Twitter />,
    <Instagram />,
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
          {contactUsIcons.map((item, index) => (
            <div key={index} className={styles.contactUsSection_iconWrapper}>
              {item}
            </div>
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

      <div className={styles.cardSection}>
        {details.map((item, index) => (
          <Card
            key={index}
            style={{ maxWidth: "300px" }}
            icon={item.icon}
            mainText={item.mainText}
            subText={item.subText}
          />
        ))}
      </div>

      <About />

      <Features />

      <Testimonials />

      <FaQ />

      <ContactUs />
    </div>
  );
}

export default LandingPage;
