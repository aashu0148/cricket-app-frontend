import React from "react";

import styles from "./Toggle.module.scss";

function Toggle({ big = false, active = false, onChange }) {
  return (
    <div
      className={`${big ? styles.big : ""} ${
        active ? styles.active : styles.disabled
      } ${styles.container}`}
      onClick={onChange}
    >
      <span className={styles.ball} />
    </div>
  );
}

export default Toggle;
