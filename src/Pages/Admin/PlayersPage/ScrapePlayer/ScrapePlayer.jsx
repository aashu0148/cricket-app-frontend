import React, { useState } from "react";
import { toast } from "react-hot-toast";

import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";

import {
  scrapeAndStorePlayerData,
  scrapeAndStoreSquadData,
} from "@/apis/players";
import { validateUrl } from "@/utils/util";

function ScrapePlayer({ onClose }) {
  const [states, setStates] = useState({
    player: "",
    squad: "",
  });
  const [errorsMsg, setErrorsMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    console.log("states yes", states, errorsMsg)
    if (!validateUrl(states.player) && !validateUrl(states.squad))
      return setErrorsMsg("Invalid url");
    if (
      !states.player.includes("espncricinfo.com") &&
      !states.squad.includes("espncricinfo.com")
    )
      return setErrorsMsg("invalid ESPN URL");

    setErrorsMsg("");

    setSubmitting(true);

    const res = states.player
      ? await scrapeAndStorePlayerData({
          url: states.player,
        })
      : states.squad
      ? await scrapeAndStoreSquadData({
          squadUrl: states.squad,
        })
      : false;

    setSubmitting(false);
    if (!res) return;

    toast.success(
      `${states.player ? "Player" : "Squad"} added to database successfully`
    );
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className={`modal-container`} style={{ width: "800px" }}>
        <p className="heading">Scrape and Insert Player to Database</p>

        <div className="form">
          <InputControl
            label="ESPN Player URL"
            placeholder="Enter URL"
            value={states.player}
            error={errorsMsg}
            onChange={(e) =>
              setStates((prev) => ({ ...prev, player: e.target.value }))
            }
          />

          <h2 className="heading" style={{ textAlign: "center" }}>
            OR
          </h2>
          <InputControl
            label="Squad ESPN URL"
            placeholder="Enter URL"
            value={states.squad}
            error={errorsMsg}
            onChange={(e) =>
              setStates((prev) => ({ ...prev, squad: e.target.value }))
            }
          />
        </div>

        <div className="footer">
          <Button cancelButton onClick={onClose}>
            Close
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            useSpinnerWhenDisabled
          >
            Scrape and Insert
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ScrapePlayer;
