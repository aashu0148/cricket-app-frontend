import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import styles from "./Dropdown.module.scss";

function Dropdown({
  onClose,
  children,
  startFromRight,
  startFromMiddle = false,
  position = "",
  className,
  startFromTop,
  parentElem,
  containerStyle = {},
}) {
  const closeFunRef = useRef(() => console.log("func not attached"));
  const dropdown = useRef();

  const handleClick = (event) => {
    if (dropdown.current && !dropdown.current.contains(event.target)) {
      setTimeout(() => closeFunRef.current(event));
    }
  };

  useEffect(() => {
    if (onClose && typeof onClose == "function") closeFunRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => {
      document.addEventListener("mouseup", handleClick);
    }, 500);

    return () => {
      document.removeEventListener("mouseup", handleClick);
    };
  }, []);

  const dropdownDiv = (
    <div
      ref={dropdown}
      className={`${styles.dropDown} ${
        startFromRight ? styles.startFromRight : ""
      } ${startFromMiddle ? styles.startFromMiddle : ""} ${
        startFromTop ? styles.startFromTop : ""
      } ${position === "middle-left" ? styles.middleLeft : ""} ${
        className ? className : ""
      }`}
      onClick={(event) => event.stopPropagation()}
      style={containerStyle}
    >
      {children}
    </div>
  );

  return parentElem?.parentNode
    ? ReactDOM.createPortal(dropdownDiv, parentElem)
    : dropdownDiv;
}

export default Dropdown;
