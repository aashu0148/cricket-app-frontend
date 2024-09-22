import React from "react";
import styles from "./Card.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card({
  style = {},
  horizontal = false,
  icon,
  mainText,
  subText,
}) {
  return (
    <div
      style={style}
      className={`${styles.container} ${
        horizontal ? styles.horizontal3D : styles.nonHorizontal
      }`}
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>
          <FontAwesomeIcon
            icon={icon}
            style={{ fontSize: horizontal ? "24px" : "0.5x" }}
          />
        </span>
      </div>
      <h1>{mainText}</h1>
      <p className={styles.subText}>{subText}</p>
      {horizontal && <div className={styles.horizontalDiv}></div>}
    </div>
  );
}
