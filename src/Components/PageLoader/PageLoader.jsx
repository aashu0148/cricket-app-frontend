import React from "react";

import Logo from "../Navbar/Logo";

import styles from "./PageLoader.module.scss";

function PageLoader({ fullPage = false }) {
  return (
    <div className={`${fullPage ? styles.fullPage : ""} ${styles.container}`}>
      <div className={styles.loader} />
      <Logo
        staticLogo
        onlyImage
        large
        imageStyle={{ height: "80px", width: "80px" }}
      />
    </div>
  );
}

export default PageLoader;
