import React, { useState, useEffect } from "react";

import Modal from "@/Components/Modal/Modal";
import InputControl from "@/Components/InputControl/InputControl";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import Button from "@/Components/Button/Button";

import { validateUrl } from "@/utils/util";

import styles from "./CreateTournamentModal.module.scss";
import { getAllScoringSystems } from "@/apis/scoringSystem";

export default function CreateTournamentModal({
  handleClose,
  handleCreateTournament,
}) {
  const [allScoringSystems, setAllScoringSystems] = useState([]);
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

    await handleCreateTournament(payload);
    handleClose();
  };

  async function fetchScoringSystems() {
    const res = await getAllScoringSystems();
    if (!res) return;

    const result = res.data.map((item) => ({
      label: item.name,
      value: item._id,
    }));
    setAllScoringSystems(result);
  }

  useEffect(() => {
    fetchScoringSystems();
  }, []);
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
            onChange={(e) => {
              console.log("e", e);

              handleChange(e, "scoringSystem");
            }}
            options={allScoringSystems}
            value={allScoringSystems.find(
              (item) => item.value === states.scoringSystem
            )}
            error={errors.scoringSystem}
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
