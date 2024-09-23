import React, { useState } from "react";

import Modal from "@/Components/Modal/Modal";
import InputControl from "@/Components/InputControl/InputControl";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Button from "@/Components/Button/Button";

import { createTournament } from "@/apis/tournament";
import { validateUrl } from "@/utils/util";

import styles from "./CreateTournamentModal.module.scss";

export default function CreateTournamentModal({
  handleClose,
  setLoading,
  allScoringSystems,
}) {
  const [states, setStates] = useState({
    espn: "",
    scoringSystem: { value: "", label: "" },
  });

  const [errors, setErrors] = useState({
    espn: "",
    scoringSystem: "",
  });

  //   ***************************** functions **********************************

  const handleChange = (val, label) => {
    setStates((prev) => ({ ...prev, [label]: val }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!states.espn) errors.espn = "Kindly Fill ESPN URL";
    else if (!validateUrl(states.espn)) errors.espn = "Invalid URL";
    else if (!states.espn.includes("espncricinfo.com"))
      errors.espn = "Not an espn URL ";
    if (!states.scoringSystem.value)
      errors.scoringSystem = "Kindly select any Scoring System";
    setErrors(errors);
    if (Object.values(errors).length > 0) return false;
    return true;
  };

  //   ********************************* Integrations ********************************

  const handleSubmit = async () => {
    const valid = validateForm();
    if (!valid) {
      return;
    }
    const payload = {
      espnUrl: states.espn,
      scoringSystemId: states.scoringSystem.value,
    };
    setLoading(true);
    const res = createTournament(payload);
    setLoading(false);
    if (!res) return;

    toast.success("A new Tournament Created");
    handleClose();
  };

  //   **************************************** Return Statement ************************************

  return (
    <Modal onClose={handleClose}>
      <div className={styles.modalContainer}>
        <div className="flexBox">
          <div>
            <h2 className={styles.heading}>Create Tournament</h2>
            <p>Create Matches, define rules, and oversee the competition</p>
          </div>
        </div>
        <div className={styles.createTForm}>
          <InputControl
            label="ESPN url"
            placeholder="Enter url"
            value={states.espn}
            error={errors.espn}
            onChange={(e) => handleChange(e.target.value, "espn")}
          />
          <InputSelect
            label="Select a Scoring System"
            placeholder="Select"
            value={
              states.scoringSystem?.value ? states.scoringSystem : undefined
            }
            error={errors.scoringSystem}
            onChange={(e) => handleChange(e, "scoringSystem")}
            options={allScoringSystems}
          />
        </div>
        <div className="footer">
          <Button cancelButton={true} onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()}>Create</Button>
        </div>
      </div>
    </Modal>
  );
}
