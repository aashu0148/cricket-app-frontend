import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import PageLoader from "@/Components/PageLoader/PageLoader";
import AppSidebar from "@/Layouts/AppSidebar/AppSidebar";
import MobileNavigation from "@/Layouts/MobileNavigation/MobileNavigation";

import { checkIfUserAdmin } from "@/apis/user";
import { getAppToken } from "@/utils/util";

import styles from "./AppLayout.module.scss";

function AppLayout({ adminLayout = false }) {
  const [verifying, setVerifying] = useState(adminLayout ? true : false);
  const [isAdmin, setIsAdmin] = useState(false);

  const verifyAdmin = async () => {
    const token = getAppToken();

    if (!token) return setVerifying(false);

    let res = await checkIfUserAdmin();
    setVerifying(false);
    if (!res) return;

    const isAdmin = res?.data?.admin;

    if (isAdmin) setIsAdmin(true);
  };

  useEffect(() => {
    if (!isAdmin && adminLayout && !verifying) window.location.replace("/");
  }, [isAdmin, verifying]);

  useEffect(() => {
    if (adminLayout) verifyAdmin();
    else setVerifying(false);
  }, [adminLayout]);

  return verifying ? (
    <PageLoader fullPage />
  ) : (
    <div className={styles.container}>
      <div className={styles.sidebarOuter}>
        <AppSidebar useAdminRoutes={adminLayout} className={styles.sidebar} />
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
