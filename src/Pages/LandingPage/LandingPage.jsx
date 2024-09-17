import React, { useState } from "react";
import { Star } from "react-feather";

import Navbar from "@/Components/Navbar/Navbar";

import { features, performancePoints, testimonials } from "./landingCopy";

import styles from "./LandingPage.module.scss";

function LandingPage() {
  return (
    <div className={`page-container ${styles.container}`}>
      <h1>Landing Page </h1>
    </div>
  );
}

export default LandingPage;
