import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "../Button/Button";

import { handleAppNavigation } from "@/utils/util";
import { applicationRoutes } from "@/utils/constants";

import styles from "./PlayedContestCard.module.scss";

export function FillerPlayerContestCard() {
  return (
    <div
      className={styles.container}
      style={{ padding: "0", opacity: "0", pointerEvents: "none" }}
    />
  );
}

function PlayedContestCard({ contestData = {} }) {
  const userDetails = useSelector((s) => s.user);
  const navigate = useNavigate();

  const rankings = contestData.teams
    .map((t) => ({
      ownerId: t.owner?._id,
      points: t.teamPoints,
      ownerName: t.owner?.name,
      name: t.name,
    }))
    .sort((a, b) => (a.points > b.points ? -1 : 1));

  const userRanking =
    rankings.findIndex((e) => e.ownerId === userDetails._id) > -1
      ? rankings.findIndex((e) => e.ownerId === userDetails._id) + 1
      : "_";

  return (
    <div className={styles.container}>
      <div className="flex-col-xs">
        <p className={styles.title}>{contestData.name}</p>
        <p className={styles.tournament}>
          {contestData.tournament?.longName}{" "}
          <span>({contestData.tournament?.season})</span>
        </p>
      </div>

      <div className={styles.info}>
        <label>Position</label>
        <p className="value">
          {userRanking} among {rankings.length} teams
        </p>
      </div>

      <div className="footer">
        <Button
          outlineButton
          small
          onClick={(e) =>
            handleAppNavigation(
              e,
              navigate,
              applicationRoutes.contest(
                contestData.tournament?._id,
                contestData._id
              )
            )
          }
        >
          View contest
        </Button>
      </div>
    </div>
  );
}

export default PlayedContestCard;
