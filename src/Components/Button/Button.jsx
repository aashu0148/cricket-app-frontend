import React from "react";
import { ArrowRight } from "react-feather";
import Spinner from "@/Components/Spinner/Spinner";
import styles from './Button.module.scss'; 

const Button = ({
  className,
  children,
  onClick,
  disabled = false,
  outlineButton,
  redButton,
  cancelButton,
  withArrow,
  small = false,
  useSpinnerWhenDisabled = false,
  whiteSpinner = false,
  gradientButton = false,
  ...inputProps
}) => {
  return (
    <button
      type={inputProps.type || styles.button}
      onClick={(event) => (onClick ? onClick(event) : "")}
      disabled={disabled}
      className={`${styles.button} ${redButton ? styles.red : ''} ${outlineButton ? styles.outline : ''} ${cancelButton ? styles.cance : ''} ${disabled ? styles.disabled : ''} ${gradientButton ? styles.gradientButton : ''} ${small ? styles.small : ''} ${className || ''}`}
      {...inputProps}
    >
      {children}
      {useSpinnerWhenDisabled && disabled ? (
        <Spinner small white={redButton} noMargin />
      ) : withArrow ? (
        <ArrowRight className={`h-4 w-4 max-sm:h-3 max-sm:w-3`} />
      ) : null}
    </button>
  );
};

export default Button;
