import React, { useState } from "react";

import Button from "@/Components/Button/Button";
import Modal from "@/Components/Modal/Modal";
import InputControl from "@/Components/InputControl/InputControl";

function JoinProtectedLeagueModal({ onClose, onJoin }) {
  const [pass, setPass] = useState("");

  return (
    <Modal onClose>
      <div className="page-container form">
        <p className="heading">Join League</p>
        <InputControl
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          label="League Password"
          placeholder="Enter password"
        />

        <div className="footer">
          <Button cancelButton onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onJoin(pass);
              onClose();
            }}
          >
            Join
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default JoinProtectedLeagueModal;
