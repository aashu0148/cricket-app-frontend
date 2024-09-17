import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/Components/Button/Button";
import Logo from "./Logo";

import { handleAppNavigation } from "@/utils/util";

function Navbar({ className = "" }) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex gap-5 items-center justify-between px-8 py-3 z-20 ${
        className || ""
      }`}
    >
      <Logo />

      <Button onClick={(e) => handleAppNavigation(e, navigate, "/auth")}>
        Get started
      </Button>
    </div>
  );
}

export default Navbar;
