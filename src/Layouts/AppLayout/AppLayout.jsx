import React from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/Layouts/AppSidebar/AppSidebar";
import MobileNavigation from "@/Layouts/MobileNavigation/MobileNavigation";

import styles from "./AppLayout.module.scss";

function AppLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarOuter}>
        <AppSidebar className={styles.sidebar} />
      </div>

      <div className={styles.app}>
        <Outlet />

        <div className={styles.mobileNavigation}>
          <MobileNavigation />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
