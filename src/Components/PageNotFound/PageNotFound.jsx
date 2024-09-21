import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/Components/Button/Button";

import { applicationRoutes } from "@/utils/constants";

import styles from "./PageNotFound.module.scss";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1>Page not found</h1>
      <p>You have reached application borders. There is nothing here {":("}</p>
      <Button withArrow onClick={() => navigate(applicationRoutes.dashboard)}>
        Home
      </Button>
    </div>
  );
}

export default PageNotFound;
