import React, { useEffect, useState } from "react";

import styles from "./InfoMessage.module.scss";

function InfoMessage({ className = "", message = "", jsx = null }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  return (
    <div
      className={`${className || ""} ${isActive ? styles.active : ""} ${
        styles.container
      }`}
    >
      {jsx ? jsx : message}
    </div>
  );
}

export default InfoMessage;
