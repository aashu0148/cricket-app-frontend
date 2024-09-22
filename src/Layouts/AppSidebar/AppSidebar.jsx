import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Home, LogOut } from "react-feather";
import { useNavigate } from "react-router-dom";

import Logo from "@/Components/Navbar/Logo";

import {
  getDebounceFunc,
  handleAppNavigation,
  handleLogout,
} from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";
import userProfileIcon from "@/assets/profile-icon.png";
import { dashboardIcon } from "@/utils/svgs";

import styles from "./AppSidebar.module.scss";

const debounce = getDebounceFunc();
function AppSidebar({ useAdminRoutes = false, className = "", onRouteClick }) {
  const userDetails = useSelector((state) => state.user);

  const adminSections = [
    {
      icon: dashboardIcon,
      value: applicationRoutes.home,
      label: "Admin Dashboard",
      link: applicationRoutes.dashboard,
      class: "route-dashboard",
    },
  ].filter((item) => item);

  const userSections = [
    {
      icon: <Home />,
      value: applicationRoutes.home,
      label: "Home",
      link: applicationRoutes.home,
      class: "route-dashboard",
    },
  ].filter((item) => item);

  const allSections = useAdminRoutes ? adminSections : userSections;

  const navigate = useNavigate();
  const isMobileView = useSelector((state) => state.root.isMobileView);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    isMobileView ? true : false
  );

  const handleExpandSidebarEvent = () => {
    setIsSidebarExpanded(true);
  };
  const handleCloseSidebarEvent = () => {
    setIsSidebarExpanded(false);
  };

  useEffect(() => {
    // custom events to open and close sidebar programmatically
    window.addEventListener("expand-sidebar", handleExpandSidebarEvent);
    window.addEventListener("close-sidebar", handleCloseSidebarEvent);

    return () => {
      window.removeEventListener("expand-sidebar", handleExpandSidebarEvent);
      window.removeEventListener("close-sidebar", handleCloseSidebarEvent);
    };
  }, []);

  return (
    <div
      className={`${styles.container} ${className} ${
        isSidebarExpanded ? styles.expanded : ""
      }`}
      onMouseOver={() => {
        if (!isMobileView && !isSidebarExpanded)
          debounce(() => setIsSidebarExpanded(true), 90);
      }}
      onMouseLeave={() => debounce(() => setIsSidebarExpanded(false), 20)}
    >
      <Logo className={styles.logo} />

      <div className={styles.sections}>
        {allSections.map((item) => (
          <div
            className={`${styles.section} ${item.class || ""} ${
              window.location.pathname === item.link ? styles.selected : ""
            }`}
            key={item.value}
            onClick={(e) => {
              if (item.link) handleAppNavigation(e, navigate, item.link);
              if (onRouteClick) onRouteClick();
            }}
          >
            <div className={`${styles.icon}`}>{item.icon}</div>
            <p className={styles.text}>{item.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.bottomBar}>
        <div className={`${styles.profile}`}>
          <div
            className={`${styles.left} route-profile`}
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

            <p className={styles.name}>{userDetails.name}dtfbsatrfgrt</p>
          </div>

          <div className={styles.right}>
            <div
              className={`${styles.red} ${styles.icon}`}
              onClick={() => {
                handleLogout();
              }}
            >
              <LogOut />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppSidebar;
