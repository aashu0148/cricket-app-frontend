import React from "react";
import styles from "./MatchCard.module.scss";
import { getDateFormatted } from "@/utils/util";
import Img from "../Img/Img";
import { Trash2 } from "react-feather";
import Spinner from "../Spinner/Spinner";

export function FillerMatchCard() {
  return (
    <div
      className={styles.matchCard}
      style={{ padding: "0", opacity: "0", pointerEvents: "none" }}
    />
  );
}

export default function MatchCard({
  matchData,
  showDeleteIcon = false,
  handleDelete,
  isDeleting,
}) {
  return (
    <div className={styles.matchCard}>
      <p className={styles.date}>{getDateFormatted(matchData.startDate)}</p>

      {showDeleteIcon && (
        <div
          className={`${styles.deleteIcon} delete-icon`}
          onClick={handleDelete}
        >
          {isDeleting ? <Spinner small /> : <Trash2 />}
        </div>
      )}

      <div className={styles.matchTeams}>
        <div className={styles.team}>
          <Img
            isEspnImage
            usePlaceholderImageOnError
            src={matchData.teams[0].image}
            alt={matchData.teams[0].name}
          />
          <span className={styles.name}>{matchData.teams[0].name}</span>
        </div>
        <span className={styles.vs}>vs</span>
        <div className={styles.team}>
          <Img
            isEspnImage
            usePlaceholderImageOnError
            src={matchData.teams[1].image}
            alt={matchData.teams[1].name}
          />
          <span className={styles.name}>{matchData.teams[1].name}</span>
        </div>
      </div>
      <p className={styles.matchStatus}>{matchData.statusText}</p>
    </div>
  );
}
