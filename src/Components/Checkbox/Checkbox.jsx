import React, { useState } from "react";

import { Check } from "react-feather";

import styles from "./Checkbox.module.scss";

function Checkbox({
  className,
  checkboxClassName = "",
  labelClassName = "",
  checked = false,
  onChange,
  label = "",
}) {
  const [isChecked, setIsChecked] = useState(checked);

  const onButtonClick = () => {
    setIsChecked((prev) => !prev);
    if (onChange) onChange(!isChecked);
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <button
        type="button"
        className={`${styles.button} ${
          isChecked ? styles.checked : ""
        } ${checkboxClassName}`}
        onClick={onButtonClick}
      >
        <span>{isChecked ? <Check /> : ""}</span>
      </button>

      {label ? (
        <p
          className={`${styles.label} ${labelClassName}`}
          onClick={onButtonClick}
        >
          {label}
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default Checkbox;
