import React from "react";

import Logo from "../Navbar/Logo";

import styles from "./PageLoader.module.scss";

function PageLoader(fullPage = false) {
  return (
    <div className={`${fullPage ? styles.fullPage : ""} ${styles.container}`}>
      <div className={styles.loader} />

      <Logo staticLogo />
    </div>
  );
}

export default PageLoader;
