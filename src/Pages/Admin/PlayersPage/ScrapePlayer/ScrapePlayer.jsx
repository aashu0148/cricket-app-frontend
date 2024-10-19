import React, { useState } from "react";
import { toast } from "react-hot-toast";

import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";
import InputControl from "@/Components/InputControl/InputControl";

import { scrapeAndStorePlayerData } from "@/apis/players";
import { validateUrl } from "@/utils/util";

function ScrapePlayer({ onClose }) {
  const [espnUrl, setEspnUrl] = useState("");
  const [errorsMsg, setErrorsMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!validateUrl(espnUrl)) return setErrorsMsg("Invalid url");
    if (!espnUrl.includes("espncricinfo.com"))
      return setErrorsMsg("invalid ESPN URL");
    if (!espnUrl.includes("cricketers"))
      return setErrorsMsg("invalid player URL");

    setErrorsMsg("");

    setSubmitting(true);
    const res = await scrapeAndStorePlayerData({
      url: espnUrl,
    });
    setSubmitting(false);
    if (!res) return;

    toast.success("Player added to database successfully");
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
            value={espnUrl}
            error={errorsMsg}
            onChange={(e) => setEspnUrl(e.target.value)}
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
