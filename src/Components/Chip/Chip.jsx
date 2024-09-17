import React from "react";
import { X } from "react-feather";

import Spinner from "@/Components/Spinner/Spinner";

import styles from "./Chip.module.scss";

/**
 * Chip component renders a customizable chip element with various styles and functionalities.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} [props.redChip=false] - Apply red styling to the chip.
 * @param {boolean} [props.greenChip=false] - Apply green styling to the chip.
 * @param {boolean} [props.yellowChip=false] - Apply yellow styling to the chip.
 * @param {boolean} [props.chipWithClose=false] - Show a close button on the chip.
 * @param {boolean} [props.selected=false] - Apply selected styling to the chip.
 * @param {string} [props.label=""] - Label text displayed on the chip.
 * @param {function} props.onClose - Callback function triggered when the close button is clicked.
 * @param {function} props.onClick - Callback function triggered when the chip is clicked.
 * @param {string} [props.className] - Additional class name for the chip container.
 * @param {boolean} [props.small=false] - Apply small styling to the chip.
 * @param {boolean} [props.loading=false] - Show a loading spinner within the chip.
 * @param {boolean} [props.staticChip=false] - Apply static styling to the chip (non clickable- no onClick will be fired)
 *
 * @returns {React.ReactElement} The rendered chip component.
 */
function Chip({
  redChip = false,
  greenChip = false,
  yellowChip = false,
  chipWithClose = false,
  selected = false,
  label = "",
  onClose,
  onClick,
  className,
  small = false,
  loading = false,
  staticChip = false,
}) {
  return (
    <div
      className={`${styles.chip} ${selected ? styles.selected : ""} ${
        redChip
          ? styles.redChip
          : yellowChip
          ? styles.yellowChip
          : greenChip
          ? styles.greenChip
          : ""
      } ${staticChip ? styles.static : ""} ${className || ""} ${
        small ? styles.small : ""
      }`}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
    >
      {label}
      {loading ? (
        <Spinner small white={selected} />
      ) : chipWithClose ? (
        <div
          className={styles.icon}
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
        >
          <X />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Chip;
