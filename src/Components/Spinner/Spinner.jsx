import React from "react";

import styles from "./Spinner.module.scss";

function Spinner({ white, small, noMargin }) {
  return (
    <div
      className={`${styles.spinner} ${white ? styles.white : ""} ${
        small ? styles.small : ""
      }  ${noMargin ? styles.noMargin : ""}`}
    >
      <div className={styles.circle} />
    </div>
  );
}

export default Spinner;
