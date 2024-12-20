import React, { useMemo } from "react";

import Img from "@/Components/Img/Img";
import Info from "@/Components/Info/Info";

import { parseTeamsForScorePoints } from "@/utils/util";

import styles from "./LeaderBoard.module.scss";

function LeaderBoard({ teams = [], playerPoints = [] }) {
  const parsedTeams = useMemo(
    () => parseTeamsForScorePoints(teams, playerPoints),
    [teams, playerPoints]
  );

  return (
    <div className={`page-container ${styles.container}`}>
      <div className="flex">
        <p className="heading">Leader Board</p>
        <Info
          infoTooltip={` A team’s score is determined by the points from its top 11 players.`}
        />
      </div>

      <div className={styles.teams}>
        <div
          className={styles.team}
          style={{ border: "none", padding: "0 var(--var-spacing-sm)" }}
        >
          <div className={`${styles.left} flex`}></div>

          <div className={styles.right}>
            <p className={styles.label}>Score</p>
            <p className={styles.label}>Rank</p>
          </div>
        </div>

        {parsedTeams.map((team, i) => (
          <div className={styles.team} key={team._id}>
            <div className={`${styles.left} flex`}>
              <div className={styles.image}>
                <Img
                  src={team.owner?.profileImage}
                  usePLaceholderUserImageOnError
                />
              </div>
              <p className={styles.name}>{team.name || team.owner?.name}</p>
            </div>

            <div className={styles.right}>
              <p className={styles.score}>{team.teamPoints} </p>
              <p className={styles.rank}>{i + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderBoard;
