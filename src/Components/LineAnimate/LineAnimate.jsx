import React from 'react'
import styles from "./LineAnimate.module.scss";

export default function LineAnimate({className}) {
  return (
    <div className={`${styles.line} ${className}`}></div>
  )
}
