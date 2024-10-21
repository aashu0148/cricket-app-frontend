import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-feather";
import { DayPicker } from "react-day-picker";

import Dropdown from "@/Components/Dropdown/Dropdown";

import { getDateFormatted } from "@/utils/util";

import styles from "./DatePicker.module.scss";
import "react-day-picker/dist/style.css";

function DatePicker({
  className = "",
  defaultDate = "",
  showExtraOptions = false,
  minDate,
  maxDate,
  onChange,
  onDropdownClose,
  onOptionSelect,
  showFutureDateInExtraOptions = false,
  shortDateLabels = true,
  startFromRight = true,
  rangePicker = false,
}) {
  const optionsEnum = {
    lastWeek: "last_week",
    last14Days: "last_14_days",
    lastMonth: "last_month",
    last2Months: "last_2_month",
    last3Months: "last_3_month",
    last6Months: "last_6_month",
    lastYear: "last_year",
  };

  const optionSelectionFuncRef = useRef(() => console.log("Not attached"));
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [showDropdown, setShowDropdown] = useState(false);

  const extraOptions = [
    {
      label: "Last week",
      value: optionsEnum.lastWeek,
    },
    {
      label: "Last 2 weeks",
      value: optionsEnum.last14Days,
    },
    {
      label: "Last month",
      value: optionsEnum.lastMonth,
    },
    {
      label: "Last 2 month",
      value: optionsEnum.last2Months,
    },
    {
      label: "Last 3 months",
      value: optionsEnum.last3Months,
    },
    {
      label: "Last 6 months",
      value: optionsEnum.last6Months,
    },
    {
      label: "Last year",
      value: optionsEnum.lastYear,
    },
  ].map((e) => ({
    ...e,
    label: showFutureDateInExtraOptions
      ? e.label.replace("Last", "Next")
      : e.label,
  }));

  const onOptionClick = (option) => {
    const value = option.value;

    let start, end;

    let offset = 0;
    if (value === optionsEnum.last14Days) offset = 14 * 24 * 60 * 60 * 1000;
    else if (value === optionsEnum.lastWeek) offset = 7 * 24 * 60 * 60 * 1000;
    else if (value === optionsEnum.lastMonth) offset = 30 * 24 * 60 * 60 * 1000;
    else if (value === optionsEnum.last2Months)
      offset = 2 * 30 * 24 * 60 * 60 * 1000;
    else if (value === optionsEnum.last3Months)
      offset = 3 * 30 * 24 * 60 * 60 * 1000;
    else if (value === optionsEnum.last6Months)
      offset = 6 * 30 * 24 * 60 * 60 * 1000;
    else if (value === optionsEnum.lastYear) offset = 365 * 24 * 60 * 60 * 1000;

    if (showFutureDateInExtraOptions) {
      start = new Date();
      end = new Date(Date.now() + offset);
    } else {
      start = new Date(Date.now() - offset);
      end = new Date();
    }

    if (start && end) {
      setSelectedDate({
        from: start,
        to: end,
      });

      setTimeout(() => optionSelectionFuncRef.current(), 100);
    }
  };

  useEffect(() => {
    if (typeof onOptionSelect === "function")
      optionSelectionFuncRef.current = onOptionSelect;
  }, [onOptionSelect]);

  useEffect(() => {
    if (!selectedDate || selectedDate === defaultDate) return;

    if (onChange) onChange(selectedDate);
  }, [selectedDate]);

  const diff =
    selectedDate?.to && selectedDate?.from
      ? Math.abs(selectedDate?.to?.getTime() - selectedDate?.from?.getTime())
      : 0;
  const isDiffGreaterThanYear = diff > 11 * 30 * 24 * 60 * 60 * 1000;

  return (
    <div
      className={`${className} ${styles.container} ${
        showDropdown ? styles.selected : ""
      }`}
      onClick={() => setShowDropdown((p) => !p)}
    >
      <div className={styles.calendarIcon}>
        <Calendar />
      </div>

      {rangePicker ? (
        <p className={styles.date}>
          {getDateFormatted(
            selectedDate.from,
            shortDateLabels,
            !isDiffGreaterThanYear
          ) || "select"}{" "}
          -{" "}
          {getDateFormatted(
            selectedDate.to,
            shortDateLabels,
            !isDiffGreaterThanYear
          ) || "select"}
        </p>
      ) : (
        <p className={styles.date}>
          {getDateFormatted(selectedDate, shortDateLabels) || "Select date"}
        </p>
      )}

      {showDropdown && (
        <Dropdown
          startFromRight={startFromRight}
          className={styles.dropdown}
          onClose={() => {
            setShowDropdown(false);
            if (onDropdownClose) onDropdownClose();
          }}
        >
          {showExtraOptions && (
            <div className={styles.options}>
              {extraOptions.map((item) => (
                <div
                  className={styles.option}
                  key={item.value}
                  onClick={() => onOptionClick(item)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}

          <DayPicker
            numberOfMonths={rangePicker ? 2 : 1}
            pagedNavigation
            mode={rangePicker ? "range" : "single"}
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={{
              before: minDate,
              after: maxDate,
            }}
          />
        </Dropdown>
      )}
    </div>
  );
}

export default DatePicker;
