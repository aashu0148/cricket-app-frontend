import React, { useState } from "react";
import { Star } from "react-feather";
import Navbar from "@/Components/Navbar/Navbar";
import {
  features,
  details,
  performancePoints,
  testimonials,
} from "./landingCopy";
import faqImage from "@/assets/images/faqImage.jpg"
import styles from "./LandingPage.module.scss";
import image from "../../assets/images/gradient-ipl-cricket-illustration_23-2149205212.avif";
import Button from "@/Components/Button/Button";
import Card from "./Card/Card";
import LineAnimate from "@/Components/LineAnimate/LineAnimate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";

function LandingPage() {
  const [activeIndexTestimonial, setActiveIndexTestimonial] = useState(0);

  const handlePrev = () => {
    if (!testimonials) return;
    if (activeIndexTestimonial === 0) return;
    setActiveIndexTestimonial((prev) => prev - 1);
  };
  const handleNext = () => {
    if (!testimonials) return;
    if (activeIndexTestimonial === testimonials.length - 1) return;
    setActiveIndexTestimonial((prev) => prev + 1);
  };

  return (
    <div className={`page-container ${styles.container}`}>
      <Navbar className={styles.navbar} />
      <div className={styles.heroSection}>
        <div className={styles.heroSection__left}>
          <h1>Best Mobile App Template For Your Business</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis
            reprehenderit fugiat rem quod assumenda, optio, tempore ab hic omnis
            vel eum facere quasi.
          </p>
          <div className={styles.heroSection__buttonContainer}>
            <Button>Google Play</Button>
            <Button>Download on App Store</Button>
          </div>
        </div>
        <div className={styles.heroSection__right}>
          <img src={image} />
        </div>
      </div>
      <div className={styles.cardSection}>
        {details.map((item, index) => (
          <Card
            icon={item.icon}
            mainText={item.mainText}
            subText={item.subText}
          />
        ))}
      </div>
      <div className={styles.aboutSection}>
        <div className={styles.aboutSectionContent}>
          <h1>About Our App</h1>
          <LineAnimate className="mb-3" />
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non ab
            quibusdam velit voluptatem, nulla, id maxime natus, optio
            consequuntur
          </p>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <div className={styles.aboutSection}>
          <div className={styles.aboutSectionContent}>
            <h1>Awesome Features</h1>
            <LineAnimate className="mb-3" />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non ab
              quibusdam velit voluptatem, nulla, id maxime natus, optio
              consequuntur
            </p>
          </div>
        </div>
        <div className={styles.featuresSection_Cards}>
          {features?.map((item) => (
            <Card
              horizontal
              icon={item.icon}
              mainText={item.mainText}
              subText={item.subText}
            />
          ))}
        </div>
      </div>

      <div className={styles.testimonialSection}>
        <div className={styles.aboutSection}>
          <div className={styles.aboutSectionContent}>
            <h1>Testimonials</h1>
            <LineAnimate className="mb-3" />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non ab
              quibusdam velit voluptatem, nulla, id maxime natus, optio
              consequuntur
            </p>
          </div>
        </div>
        <div className={styles.testimonial_carousel}>
          <span onClick={() => handlePrev()}>{"<"}</span>

          <div className={styles.testimonial_carousel_between}>
            <FontAwesomeIcon icon={faQuoteLeft} size="3x" />
            <div className={styles.testimonial_profile}>
              <img src={testimonials[activeIndexTestimonial].photo} />
            </div>
            <div className={styles.testimonial_stars}>
              {Array.from({
                length: testimonials[activeIndexTestimonial].stars,
              })
                .fill("")
                .map((_, index) => (
                  <FontAwesomeIcon icon={faStar} key={index} color="green" />
                ))}
            </div>
            <h2>{testimonials[activeIndexTestimonial].name}</h2>
            <div>{testimonials[activeIndexTestimonial].review}</div>
          </div>

          <span onClick={() => handleNext()}>{">"}</span>
        </div>
      </div>

      <div className={styles.faqSection}>
        <div className={styles.aboutSection}>
          <div className={styles.aboutSectionContent}>
            <h1>Frequently Asked Questions</h1>
            <LineAnimate className="mb-3" />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non ab
              quibusdam velit voluptatem, nulla, id maxime natus, optio
              consequuntur
            </p>
          </div>
        </div>
        <div className={styles.faqSection_Below}>
          <div className={styles.faqSection_Accordion}>
<div className=""></div>

          </div>
          <div className={styles.faqSection_image}>
            <img src={faqImage}></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
