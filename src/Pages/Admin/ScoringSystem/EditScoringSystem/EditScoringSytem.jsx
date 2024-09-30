import React, { useEffect } from "react";
import styles from "./EditScoringSytem.module.scss";
import Button from "@/Components/Button/Button";
import { getScoringSystemById } from "@/apis/scoringSystem";
import InputControl from "@/Components/InputControl/InputControl";

export default function ScoringSystemModal({ handleClose, id }) {
  // ***************************** get scoring system by id ***************************

  const scoringSystem = async (id) => {
    if (!id) return;
    const res = await getScoringSystemById(id);
    if (!res) return;

    console.log("res", res);
  };

  useEffect(() => {
    if (id) {
      scoringSystem(id);
    }
  }, []);

  return (
      <div className={`${styles.container}`}>
        <div className="flex-col-xxs">
          <h2 className={styles.heading}>Edit Scoring System</h2>
          <p>Edit Scoring System, define rules, and oversee the competition.</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.mainHeading}>Batting</h2>
          <div className={styles.subSection}>
            <h3 className={styles.subHeading}>Boundary Points</h3>
            <div className={styles.subSection_row}>
              <InputControl numericInput label="Four" />
              <InputControl numericInput label="Six" />
              <InputControl numericInput label="Min Rate" />
              <InputControl numericInput label="Max Rate" />
            </div>
            <p style={{color : "blue", cursor : "pointer"}}> + ADD</p>
          </div>
          <div className={styles.subSection}>
            <h3 className={styles.subHeading}>Milestones</h3>
            <div className={styles.subSection_row}>
              <InputControl numericInput label="Runs Upto" />
              <InputControl numericInput label="Points" />
            </div>
            <p style={{color : "blue", cursor : "pointer"}}> + ADD</p>
          </div>
        </div>
        <div className="footer">
          <Button cancelButton onClick={handleClose}>
            Cancel
          </Button>
          <Button>Edit</Button>
        </div>
      </div>
  );
}
