import React from "react";

import Modal from "@/Components/Modal/Modal";
import Button from "@/Components/Button/Button";

import styles from "./ConfirmDeleteModal.module.scss";

function ConfirmDeleteModal({
  name = "",
  onClose,
  onDelete,
  heading = "",
  description = "",
  buttonText = "",
}) {
  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        {heading ? (
          <p className={styles.title}>{heading}</p>
        ) : (
          <p className={styles.title}>
            Do you want to delete <span>{name}</span> ?
          </p>
        )}

        {description ? (
          <p className={` whitespace-pre-wrap ${styles.desc}`}>{description}</p>
        ) : (
          <p className={styles.desc}>
            It will be permanently deleted and can not be recovered. Are you
            sure ?
          </p>
        )}

        <div className={styles.form}>
          <div className={styles.footer}>
            <Button cancelButton onClick={onClose}>
              Close
            </Button>

            <Button
              redButton
              onClick={() => {
                if (onDelete) onDelete();
                if (onClose) onClose();
              }}
            >
              {buttonText || "DELETE"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
