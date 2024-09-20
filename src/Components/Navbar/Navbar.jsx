import React from "react";
import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";
import Button from "@/Components/Button/Button";
import Logo from "./Logo";

import { handleAppNavigation } from "@/utils/util";

function Navbar({ className = "" }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.navbar || className}
    >
      <Logo />
      <div>
        HOME
        ABOUT 
        FEATURES
      </div>

      <Button onClick={(e) => handleAppNavigation(e, navigate, "/auth")}>
        Get started
      </Button>
    </div>
  );
}

export default Navbar;
