import React from "react";
import styles from "./Card.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card({ horizontal = false, icon, mainText, subText }) {
  return (
    <div
      className={`${styles.container} ${
        horizontal ? styles.horizontal3D : styles.nonHorizontal
      }`}
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>
          <FontAwesomeIcon icon={icon} size="0.5x" />
        </span>
      </div>
      <h1>{mainText}</h1>
      <p>{subText}</p>
      {horizontal && (
        <>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </>
      )}
    </div>
  );
}
