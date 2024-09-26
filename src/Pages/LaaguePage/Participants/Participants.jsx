import React from "react";

import Img from "@/Components/Img/Img";
import Button from "@/Components/Button/Button";

import styles from "./Participants.module.scss";

function Participants({ participants = [] }) {
  return (
    <div className={`flex-col-xs ${styles.container}`}>
      <p className="heading">Participants</p>

      <div className={`cards ${styles.cards}`}>
        {participants.map((p) => (
          <div key={p._id} className={`card ${styles.card}`}>
            <div className={styles.image}>
              <Img usePLaceholderUserImageOnError src={p.owner.profileImage} />
            </div>
            <p className={styles.name}>{p.owner.name}</p>

            {p.players?.length > 0 && (
              <Button small outlineButton>
                View Team
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Participants;
