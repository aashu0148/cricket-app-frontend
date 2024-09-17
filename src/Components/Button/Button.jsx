import React from "react";
import { ArrowRight } from "react-feather";

import Spinner from "@/Components/Spinner/Spinner";

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
  const classes = {
    red: ` bg-none text-white border-red-500 bg-red-500`,
    outline: `bg-none border-primary bg-white text-black`,
    cancel: ` bg-none bg-slate-100 text-black  border-slate-100`,
    disabled: ` bg-none bg-slate-300 text-black border-slate-300 active:transform-none cursor-not-allowed `,
    small: `px-3 py-1 text-sm`,
  };

  return (
    <button
      type={inputProps.type || "button"}
      onClick={(event) => (onClick ? onClick(event) : "")}
      disabled={disabled ? true : false}
      className={`outline-none w-fit bg-primary bg-gradient-to-r from-primary2 to-primary text-white border-white rounded-lg border-2 flex gap-2 items-center px-4 py-2 active:scale-[.98] transition duration-200 text-base max-sm:text-sm max-sm:py-1 max-sm:px-3 ${
        redButton
          ? classes.red
          : outlineButton
          ? classes.outline
          : cancelButton
          ? classes.cancel
          : disabled
          ? classes.disabled
          : gradientButton
          ? "gradient-button"
          : ""
      } ${small ? classes.small : ""} ${className || ""}`}
      {...inputProps}
    >
      {children}
      {useSpinnerWhenDisabled && disabled ? (
        <Spinner small white={redButton} noMargin />
      ) : withArrow ? (
        <ArrowRight className={`h-4 w-4 max-sm:h-3 max-sm:w-3`} />
      ) : (
        ""
      )}
    </button>
  );
};

export default Button;
