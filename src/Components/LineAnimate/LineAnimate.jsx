import React from "react";
import styles from "./LineAnimate.module.scss";

export default function LineAnimate({ className = "", style = {} }) {
  return <div style={style} className={`${styles.line} ${className}`}></div>;
}
