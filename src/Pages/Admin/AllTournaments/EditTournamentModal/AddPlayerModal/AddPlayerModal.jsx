import React, { useState } from "react";

import Button from "@/Components/Button/Button";
import Modal from "@/Components/Modal/Modal";
import InputSelect from "@/Components/InputControl/InputSelect/InputSelect";
import PlayerSmallCard from "@/Components/PlayerSmallCard/PlayerSmallCard";

import { getUniqueId } from "@/utils/util";

import styles from "./AddPlayerModal.module.scss";

function AddPlayerModal({ onClose, squads = [], player = {}, onSelect }) {
  const [selectedTeam, setSelectedTeam] = useState("");

  return (
    <Modal onClose={onClose}>
      <div className={`${styles.container}`}>
        <p className="heading">Add Player to Tournament</p>

        <PlayerSmallCard playerData={player} hideScore showCountry />

        <InputSelect
          label="Select Team"
          options={squads.map((e) => ({ label: e.teamName, value: e.squadId }))}
          placeholder="select team"
          onChange={(e) => setSelectedTeam(e.value)}
        />

        <div className="footer">
          <Button cancelButton onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={!selectedTeam}
            onClick={() =>
              onSelect({
                _id: getUniqueId(),
                player: player,
                squad: squads.find((e) => e.squadId === selectedTeam),
                squadId: selectedTeam,
              })
            }
          >
            Add Player
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AddPlayerModal;
