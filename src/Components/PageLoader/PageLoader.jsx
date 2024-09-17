import React from "react";

import Logo from "../Navbar/Logo";

import styles from "./PageLoader.module.scss";

function PageLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.loaderContainer}>
        <div className={styles.loader} />
      </div>
      <Logo staticLogo />
    </div>
  );
}

export default PageLoader;
