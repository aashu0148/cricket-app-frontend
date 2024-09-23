import React from "react";

import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";

import styles from "./JoinLeagueModal.module.scss";

function JoinLeagueModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className={`modal-container ${styles.container}`}>
        <div className="footer">
          <Button cancelButton onClick={onClose}>
            Close
          </Button>
          <Button>Join</Button>
        </div>
      </div>
    </Modal>
  );
}

export default JoinLeagueModal;
