import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/Components/Button/Button";
import Logo from "./Logo";

import { handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";

import styles from "./Navbar.module.scss";

function Navbar({ className = "" }) {
  const navigate = useNavigate();

  return (
    <div className={`${styles.navbar}  ${className}`}>
      <Logo />

      <Button
        onClick={(e) =>
          handleAppNavigation(e, navigate, applicationRoutes.auth)
        }
      >
        Get started
      </Button>
    </div>
  );
}

export default Navbar;
