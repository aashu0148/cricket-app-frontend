import React from "react";

import { circleShape, halfMoon, plus, triangle } from "@/utils/svgs";

import styles from "./LandingPage.module.scss";

function Shapes({
  shapeStyles = { circle: {}, triangle: {}, half: {}, plus: {} },
  hidePlus = false,
  hideHalf = false,
  hideTriangle = false,
  hideCircle = false,
}) {
  return (
    <div className={styles.shapes}>
      {!hidePlus && (
        <div
          className={`${styles.shape} ${styles.plus}`}
          style={{
            ...(typeof shapeStyles.plus === "object" && shapeStyles.plus
              ? shapeStyles.plus
              : {}),
          }}
        >
          {plus}
        </div>
      )}
      {!hideHalf && (
        <div
          className={`${styles.shape} ${styles.half}`}
          style={{
            ...(typeof shapeStyles.half === "object" && shapeStyles.half
              ? shapeStyles.half
              : {}),
          }}
        >
          {halfMoon}
        </div>
      )}
      {!hideTriangle && (
        <div
          className={`${styles.shape} ${styles.triangle}`}
          style={{
            ...(typeof shapeStyles.triangle === "object" && shapeStyles.triangle
              ? shapeStyles.triangle
              : {}),
          }}
        >
          {triangle}
        </div>
      )}
      {!hideCircle && (
        <div
          className={`${styles.shape} ${styles.circle}`}
          style={{
            ...(typeof shapeStyles.circle === "object" && shapeStyles.circle
              ? shapeStyles.circle
              : {}),
          }}
        >
          {circleShape}
        </div>
      )}
    </div>
  );
}

export default Shapes;
