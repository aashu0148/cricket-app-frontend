import React, { useEffect, useState } from "react";
import styles from "./CreateTournamentModal.module.scss";
import Modal from "@/Components/Modal/Modal";
import InputControl from "@/Components/InputControl/InputControl";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Button from "@/Components/Button/Button";
import { createTournament } from "@/apis/tournament";

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

    if (res) {
      toast.success("A new Tournament Created");
    } else {
      toast.error("Something went wrong");
    }
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
          <Button onClick={() => handleClose()}>Close</Button>
        </div>
        <div className={styles.createTForm}>
          <InputControl
            label="Enter the ESPN url"
            value={states.espn}
            error={errors.espn}
            onChange={(e) => handleChange(e.target.value, "espn")}
          />
          <InputSelect
            label="Select a Scoring System"
            subLabel="Please choose wisely."
            value={states.scoringSystem}
            error={errors.scoringSystem}
            onChange={(e) => handleChange(e, "scoringSystem")}
            options={allScoringSystems}
            placeholder="Choose..."
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
