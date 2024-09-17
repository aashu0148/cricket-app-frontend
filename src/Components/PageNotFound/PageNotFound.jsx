import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/Components/Button/Button";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col gap-5 items-center justify-center max-sm:gap-3">
      <h1 className=" text-5xl max-sm:text-2xl">Page not found</h1>
      <p className=" text-lg text-center max-sm:text-sm">
        You have reached application borders. There is nothing here {":("}
      </p>
      <Button withArrow onClick={() => navigate("/")}>
        Home
      </Button>
    </div>
  );
}

export default PageNotFound;
