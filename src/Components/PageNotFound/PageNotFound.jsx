import React from "react";
import styles from "./PageNotFound.module.scss";
import { useNavigate } from "react-router-dom";
import Button from "@/Components/Button/Button";

function PageNotFound() {
  
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1>Page not found</h1>
      <p>You have reached application borders. There is nothing here {":("}</p>
      <Button withArrow onClick={()=> navigate("/")}>GO BACK</Button>
    </div>
  );
}

export default PageNotFound;
