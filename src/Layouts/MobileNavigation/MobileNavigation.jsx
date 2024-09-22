import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import userProfileIcon from "@/assets/profile-icon.png";
import { applicationRoutes } from "@/utils/constants";
import { handleAppNavigation } from "@/utils/util";
import { dashboardIcon } from "@/utils/svgs";

import styles from "./MobileNavigation.module.scss";
import { useRoutesContext } from "../RoutesContext/RoutesContext";

function MobileNavigation({
  useAdminRoutes = false,
  className = "",
  onRouteClick,
}) {
  const userDetails = useSelector((s) => s.user);
  const navigate = useNavigate();

  const { routes } = useRoutesContext();

  return (
    <div className={`${styles.container} ${className}`}>
      {routes.map((item) => (
        <div
          className={`${styles.nav} ${item.class || ""} ${
            window.location.pathname === item.link ? styles.selected : ""
          }`}
          key={item.value}
          onClick={(e) => {
            if (item.link) handleAppNavigation(e, navigate, item.link);
            if (onRouteClick) onRouteClick();
          }}
        >
          <div className={styles.icon}>{item.icon}</div>
          <p className={styles.text}>{item.label}</p>
        </div>
      ))}

      <div
        className={styles.profile}
        onClick={(e) =>
          handleAppNavigation(e, navigate, applicationRoutes.profile)
        }
      >
        <div className={styles.image}>
          <img
            src={userDetails.profileImage || ""}
            alt={userDetails.name}
            onError={(e) => (e.target.src = userProfileIcon)}
          />
        </div>
        <p className={styles.name}>{userDetails.name}</p>
      </div>
    </div>
  );
}

export default MobileNavigation;
