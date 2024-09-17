import React from "react";
import { useNavigate } from "react-router-dom";

import { handleAppNavigation } from "@/utils/util";
import logo from "@/assets/logo.svg";

import styles from "./Logo.module.scss";

function Logo({
  onlyImage = false,
  className,
  staticLogo = false,
  large = false,
  grayImage = false,
}) {
  let navigate;
  if (!staticLogo) navigate = useNavigate();

  return (
    <div
      style={{ cursor: staticLogo ? "default" : "" }}
      className={`${styles.logo} ${className || ""} ${
        large ? styles.large : ""
      } ${grayImage ? styles.grayed : ""}`}
      onClick={(e) => (staticLogo ? "" : handleAppNavigation(e, navigate, "/"))}
    >
      <div className={styles.image}>
        <img src={logo} alt="Cric Maestro" />
      </div>
      {onlyImage ? "" : <p className={styles.text}>Cric Maestro</p>}
    </div>
  );
}

export default Logo;
