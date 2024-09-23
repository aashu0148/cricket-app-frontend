import React, { useEffect, useState } from "react";

import { autoAdjustTextareaHeight } from "@/utils/util";

import styles from "./Textarea.module.scss";

const TextArea = ({
  small = false,
  containerClassName,
  name,
  type,
  placeholder,
  label,
  subLabel,
  hintClassName,
  error,
  maxCount,
  className,
  onChange,
  icon,
  hintText,
  children,
  spacedOut = false,
  autoAdjustHeight = false,
  showRequiredField = false,
  ...inputProps
}) => {
  const [value, setValue] = useState(inputProps.value || "");

  const handleChange = (event) => {
    setValue(event.target.value);
    if (!(maxCount && value.length == maxCount) && onChange) onChange(event);
  };

  useEffect(() => {
    if (inputProps.value) setValue(inputProps.value);
  }, [inputProps.value]);

  return (
    <div
      className={`${styles.container}  ${small ? styles.smallContainer : ""} ${
        containerClassName || ""
      }`}
    >
      {label && (
        <label
          className={styles.label}
          style={{ marginBottom: spacedOut ? "8px" : "" }}
        >
          {label} {inputProps.required && "*"}
        </label>
      )}
      {subLabel ? (
        <label
          className={styles.subLabel}
          style={{ marginBottom: spacedOut ? "8px" : "" }}
        >
          {subLabel}
        </label>
      ) : (
        ""
      )}

      <div className={styles.inner}>
        <textarea
          id={name}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          className={`${styles.basicInput} ${styles.input} ${className || ""} ${
            error ? styles.inputError : ""
          }`}
          maxLength={maxCount}
          onInput={(e) => (autoAdjustHeight ? autoAdjustTextareaHeight(e) : "")}
          rows={autoAdjustHeight ? 1 : ""}
          onFocus={(e) => (autoAdjustHeight ? autoAdjustTextareaHeight(e) : "")}
          aria-label={
            inputProps["aria-label"] ||
            `textarea ${label ? label.toLowerCase().trim() : ""}`
          }
          {...inputProps}
        />
        {children}

        {icon ? <div className={styles.icon}>{icon}</div> : ""}

        {maxCount ? (
          <p className={styles.count}>
            {value.length}/{maxCount}
          </p>
        ) : (
          ""
        )}
      </div>
      {error ? (
        <p className={` error-msg ${styles.error}`}>{error}</p>
      ) : hintText ? (
        <p className={`${styles.hint} ${hintClassName || ""}`}>{hintText}</p>
      ) : (
        ""
      )}
    </div>
  );
};

export default TextArea;
