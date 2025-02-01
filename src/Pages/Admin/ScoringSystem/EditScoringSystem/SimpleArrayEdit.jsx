import React, { useEffect, useState } from "react";
import { X } from "react-feather";

import InputControl from "@/Components/InputControl/InputControl";
import Button from "@/Components/Button/Button";
import Chip from "@/Components/Chip/Chip";

import styles from "./EditScoringSystem.module.scss";

function SimpleArrayEdit({ onChange, array = [], options = [] }) {
  const [selectedOptions, setSelectedOptions] = useState([...array]);

  useEffect(() => {
    if (!options.length) return;

    onChange(selectedOptions);
  }, [selectedOptions]);

  const arrayWise = (
    <div className={styles.simpleArray}>
      {array?.map((item, index) => (
        <InputControl
          key={index}
          value={item}
          numericInput
          onChange={(event) =>
            onChange(
              array.map((e, i) =>
                i === index ? event.target.valueAsNumber : e
              )
            )
          }
          preventChangeByDragging
          icon={
            <div
              className={`delete-icon ${styles.delete}`}
              onClick={() => onChange(array.filter((_, i) => i !== index))}
            >
              <X />
            </div>
          }
        />
      ))}

      <Button outlineButton onClick={() => onChange([...array, 1])}>
        Add
      </Button>
    </div>
  );

  const chipWise = (
    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
      {options.map((item) => (
        <Chip
          key={item}
          label={item}
          selected={selectedOptions.includes(item)}
          onClick={() =>
            setSelectedOptions((prev) =>
              prev.includes(item)
                ? prev.filter((e) => e !== item)
                : [...prev, item]
            )
          }
        />
      ))}
    </div>
  );

  return options.length > 0 ? chipWise : arrayWise;
}

export default SimpleArrayEdit;
