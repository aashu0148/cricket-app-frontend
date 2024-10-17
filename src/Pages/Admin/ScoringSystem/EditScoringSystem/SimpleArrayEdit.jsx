import React from "react";
import { X } from "react-feather";

import InputControl from "@/Components/InputControl/InputControl";
import Button from "@/Components/Button/Button";

import styles from "./EditScoringSystem.module.scss";

function SimpleArrayEdit({ onChange, array = [] }) {
  return (
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
}

export default SimpleArrayEdit;
