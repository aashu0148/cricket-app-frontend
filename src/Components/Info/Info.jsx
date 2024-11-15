import React, { useState } from "react";
import { Info as InfoIcon } from "react-feather";

import Modal from "@/Components/Modal/Modal";

import { getTooltipAttributes } from "@/utils/tooltip";

import styles from "./Info.module.scss";

function InfoModal({ onClose, information = "", title = "" }) {
  return (
    <Modal onClose={onClose}>
      <div className={styles.infoModal}>
        <p className="heading">{title}</p>
        <p className={styles.information}>{information}</p>
      </div>
    </Modal>
  );
}

function Info({
  infoTooltip = "",
  showModal = false,
  title = "",
  detailedInformation = "",
}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <React.Fragment>
      {showInfoModal && showModal ? (
        <InfoModal
          onClose={() => setShowInfoModal(false)}
          information={detailedInformation}
          title={title}
        />
      ) : (
        ""
      )}

      <div
        className={styles.infoButton}
        {...getTooltipAttributes({ text: infoTooltip })}
        onClick={() => setShowInfoModal(true)}
      >
        <InfoIcon />
      </div>
    </React.Fragment>
  );
}

export default Info;
