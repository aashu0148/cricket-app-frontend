import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";

import { colors } from "@/utils/constants";

import styles from "../InputControl.module.scss";

function InputSelect({
  containerClassName,
  label,
  subLabel,
  error,
  async,
  asyncCreatable,
  components = {},
  small = false,
  controlStyles = {},
  ...rest
}) {
  const customSelectStyle = {
    control: (provided, { selectProps: { error }, isFocused }) => ({
      ...provided,
      minHeight: 26,
      height: 37,
      backgroundColor: colors["bg-100"],
      borderColor: colors["bg-100"],
      boxShadow: error
        ? `0 0 0 1px ${colors.red}`
        : isFocused
        ? `0 0 0 1px ${colors.primary}`
        : "",
      "&:hover": {
        borderColor: isFocused || error ? "" : colors["bg-200"],
      },
      ...controlStyles,
    }),
    option: (provided, { isDisabled, isSelected, isFocused }) => ({
      ...provided,
      color: isSelected ? "#fff" : colors.title,
      backgroundColor: isSelected
        ? colors.primary
        : isFocused
        ? colors.primary_300
        : colors["bg-100"],
      cursor: isDisabled ? "not-allowed" : "default",
      "&:hover": {
        backgroundColor: isSelected
          ? colors.primary
          : isFocused
          ? colors.primary_300
          : colors["bg-200"],
        color: isSelected ? "#fff" : colors.title,
      },
    }),
    input: (provided) => ({
      ...provided,
      maxWidth: "150px !important",
    }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: "left",
      fontSize: "1rem",
      color: colors.label,
      fontWeight: 400,
    }),
    menuList: (provided) => ({
      ...provided,
      textAlign: "left",
      fontSize: "1rem",
      color: colors.title,
      fontWeight: 400,
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: "left",
      fontSize: "1rem",
      color: colors.desc,
      fontWeight: 400,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 999 }),
  };

  return (
    <div
      className={`${styles.container} ${small ? styles.smallSelect : ""} ${
        containerClassName || ""
      }`}
    >
      {label && (
        <label className={styles.label}>
          {label}
          <span> {subLabel}</span>
        </label>
      )}

      <div className={styles.selectContainer}>
        {async ? (
          <AsyncSelect
            {...rest}
            classNamePrefix="react-select"
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              ...components,
            }}
            menuPortalTarget={document.body}
            styles={customSelectStyle}
            error={error ? true : false}
          />
        ) : asyncCreatable ? (
          <AsyncCreatableSelect
            {...rest}
            classNamePrefix="react-select"
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              ...components,
            }}
            styles={customSelectStyle}
            error={error ? true : false}
            menuPortalTarget={document.body}
          />
        ) : (
          <Select
            {...rest}
            classNamePrefix="react-select"
            components={{
              // DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              ...components,
            }}
            menuPortalTarget={document.body}
            styles={customSelectStyle}
            error={error ? true : false}
          />
        )}
      </div>
      {error ? <p className={styles.errorMsg}>{error}</p> : ""}
    </div>
  );
}

export default InputSelect;
